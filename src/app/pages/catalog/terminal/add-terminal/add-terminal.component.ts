import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Counter } from 'src/app/interfaces/common/counter.interface';
import { Terminal } from 'src/app/interfaces/common/terminal.interface';
import { Select } from 'src/app/interfaces/core/select';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { CounterService } from 'src/app/services/common/counter.service';
import { TerminalService } from 'src/app/services/common/terminal.service';
import { UiService } from 'src/app/services/core/ui.service';
interface AccessOption {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-add-terminal',
  templateUrl: './add-terminal.component.html',
  styleUrls: ['./add-terminal.component.scss']
})
export class AddTerminalComponent implements OnInit {

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
  terminal?: Terminal;
  counters:Counter[];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour:Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private terminalService: TerminalService,
    private counterService:CounterService
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getTerminalById();
      }
    });

    this.getAllCounters();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null,Validators.required],
      counters:[null],
      priority: [null],
      status: ['publish'],
    });
  }


  private setFormValue() {
    let counters:string[];

    if(this.terminal && this.terminal.counters){
      counters = this.terminal.counters.map((v) => v._id);
    }
    this.dataForm.patchValue(
      {
        ...this.terminal,
        counters:counters
      }
    );
    
  }



  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    //Merge Data
    const mData = {
         ...this.dataForm.value
    }

    if (this.dataForm.value.counters) {
      mData.counters = []
      this.dataForm.value.counters.map((item) => {
        mData.counters.push({
          _id: item,
          name: this.counters.find(f => f._id === item)?.name,
        })
      })
    }

    if (!this.terminal) {
      this.addTerminal(mData);
    } else {
      this.updateTerminalById(mData);
    }
  }

  /**
   * HTTP REQ HANDLE
   * getTerminalById()
   * addTerminal()
   * updateTerminalById()
   * getAllCounters()
   */

  private getTerminalById() {
    this.spinnerService.show();
    this.subDataOne = this.terminalService.getTerminalById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.terminal = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addTerminal(data:any) {
    this.isLoading = true;
    this.subDataTwo = this.terminalService
      .addTerminal(data)
      .subscribe({
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

  private updateTerminalById(data:any) {
    this.isLoading = true;
    this.subDataThree = this.terminalService
      .updateTerminalById(this.terminal._id, data)
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

  private getAllCounters(){
       const mSelect = {
          name:1,
       }
       const filter:FilterData = {
          select:mSelect,
          pagination:null,
          sort:{createdAt:-1},
          filter:null
       }

       this.subDataFour = this.counterService.getAllCounter(filter).subscribe({
        next:(res) => {
             if(res.success){
                 this.counters = res.data;
                //  console.log(this.counters);
             }
        },
        error:(err) => {
             if(err){
                 console.log(err);
             }
        }
       })
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

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }

}
