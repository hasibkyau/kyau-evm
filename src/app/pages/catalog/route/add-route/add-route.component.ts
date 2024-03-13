import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Counter } from 'src/app/interfaces/common/counter.interface';
import { Routes } from 'src/app/interfaces/common/route.interface';
import { Terminal } from 'src/app/interfaces/common/terminal.interface';
import { Select } from 'src/app/interfaces/core/select';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { CounterService } from 'src/app/services/common/counter.service';
import { RouteService } from 'src/app/services/common/route.service';
import { TerminalService } from 'src/app/services/common/terminal.service';
import { UiService } from 'src/app/services/core/ui.service';

interface AccessOption {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss'],
})
export class AddRouteComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  isLoading = false;

  HasAccessControl = new FormControl<AccessOption | null>(
    null,
    Validators.required
  );

  hasAccess: Select[] = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' },
  ];

  // Store Data
  id?: string;
  route?: Routes;
  counters: Counter[];
  terminals: Terminal[];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService,
    private counterService: CounterService,
    private terminalService: TerminalService
  ) {}

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
    });

    //Base
    // this.getAllCounters();
    this.getAllTerminals();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      viaRoutes: [null],
      boardingPoints: [null],
      droppingPoints: [null],
      priority: [null],
      status: ['publish'],
    });
  }

  private setFormValue() {
    let boardingPoints: string[];
    let droppingPoints: string[];

    if (this.route && this.route.boardingPoints) {
      boardingPoints = this.route.boardingPoints.map((v) => v._id);
    }
    if (this.route && this.route.droppingPoints) {
      droppingPoints = this.route.droppingPoints.map((v) => v._id);
    }
    this.dataForm.patchValue({
      ...this.route,
      from: this.route.from._id,
      to: this.route.to._id,
      boardingPoints: boardingPoints,
      droppingPoints: droppingPoints,
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    //Merge Data
    const mData = {
      ...this.dataForm.value,
      ...{
        from: this.terminals.find((m) => m._id === this.dataForm.value.from),
        to: this.terminals.find((m) => m._id === this.dataForm.value.to),
      },
    };

    //Filter Boarding Points
    if (this.dataForm.value.boardingPoints) {
      mData.boardingPoints = [];
      this.dataForm.value.boardingPoints.map((item) => {
        mData.boardingPoints.push({
          _id: item,
          name: this.terminals.find((f) => f._id === item)?.name,
        });
      });
    }
    //Filter Dropping Points
    if (this.dataForm.value.droppingPoints) {
      mData.droppingPoints = [];
      this.dataForm.value.droppingPoints.map((item) => {
        mData.droppingPoints.push({
          _id: item,
          name: this.terminals.find((f) => f._id === item)?.name,
        });
      });
    }

    if (!this.route) {
      this.addRoute(mData);
    } else {
      this.updateRouteById(mData);
    }
  }

  /**
   * HTTP REQ HANDLE
   * getRouteById()
   * addRoute()
   * updateRouteById()
   * getAllCounters()
   */

  private getRouteById() {
    this.spinnerService.show();
    this.subDataOne = this.routeService.getRouteById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.route = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addRoute(data: any) {
    this.isLoading = true;
    this.subDataTwo = this.routeService.addRoute(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
          this.initDataForm();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  private updateRouteById(data: any) {
    this.isLoading = true;
    this.subDataThree = this.routeService
      .updateRouteById(this.route._id, data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }

  // private getAllCounters(){
  //      const mSelect = {
  //         name:1,
  //      }
  //      const filter:FilterData = {
  //         select:mSelect,
  //         pagination:null,
  //         sort:{createdAt:-1},
  //         filter:null
  //      }

  //      this.subDataFour = this.counterService.getAllCounter(filter).subscribe({
  //       next:(res) => {
  //            if(res.success){
  //                this.counters = res.data;
  //            }
  //       },
  //       error:(err) => {
  //            if(err){
  //                console.log(err);
  //            }
  //       }
  //      })
  // }

  private getAllTerminals() {
    const mSelect = {
      name: 1,
    };
    const filter: FilterData = {
      select: mSelect,
      pagination: null,
      sort: { createdAt: -1 },
      filter: null,
    };

    this.subDataFive = this.terminalService.getAllTerminal(filter).subscribe({
      next: (res) => {
        if (res.success) {
          this.terminals = res.data;
        }

        if (this.id) {
          this.getRouteById();
        }
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      },
    });
  }

  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }
}
