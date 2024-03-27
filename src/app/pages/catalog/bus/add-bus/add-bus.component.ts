import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { SEAT_TYPES } from 'src/app/core/db/seat-type.db';
import { VEHICLE } from 'src/app/core/db/vehicle.db';
import { PRODUCT_STATUS, DISCOUNT_TYPES } from 'src/app/core/utils/app-data';
import { Bus } from 'src/app/interfaces/common/bus.interface';
import { Tag } from 'src/app/interfaces/common/tag.interface';

import { Select } from 'src/app/interfaces/core/select';
import { BusService } from 'src/app/services/common/bus.service';
import { UiService } from 'src/app/services/core/ui.service';
@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.component.html',
  styleUrls: ['./add-bus.component.scss']
})
export class AddBusComponent implements OnInit {
  // Ngx Quill
  modules: any = null;
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  // Form Array
  seatsDataArray?: FormArray;
  // Store Data
  id?: string;
  bus?: Bus;

  isLoading = false;

  // Static Data
  busStatus: Select[] = PRODUCT_STATUS;
  seatType: Select[] = SEAT_TYPES;
  tempFloor: string = '1';
  seatsArray:any[]=[];
  vehicles: any[] = VEHICLE;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private busService: BusService,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getBusById();
      }
    });
  }

  /**
   * FORMS METHODS
   * initDataForm()
   * setFormValue()
   * onAddNewSpecifications()
   * removeFormArrayField()
   * clearFormArray()
   * findInvalidControls()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      coachNo: [null],
      coachType: [null],
      totalSeat: [null],
      company: [null],
      seats: this.fb.array([
      ]),
      status:['publish'],
      priority:[null]
    });

    this.seatsDataArray = this.dataForm.get(
      'seats'
    ) as FormArray;
  }

  private setFormValue() {
    this.dataForm.patchValue(this.bus);

    // Form Array Seats
    if (this.bus.seats && this.bus.seats.length) {
      this.bus.seats.map((m) => {
        const f = this.fb.group({
          floorNo: [m.floorNo],
          seatNo: [m.seatNo],
          seatType: [m.seatType],
          status: [m.status],
          xaxis: [m.xaxis],
          yaxis: [m.yaxis],
          serialNo: [m.serialNo],
        });
        (this.dataForm?.get('seats') as FormArray).push(f);
      });
    }
  }

  
  onAddNewSeat() {
    const f = this.fb.group({
      floorNo: [this.tempFloor, Validators.required],
      seatNo: [null, Validators.required],
      seatType: [null,Validators.required],
      status: ['Available' ,Validators.required],
      xaxis: [null,Validators.required],
      yaxis: [null,Validators.required],
      serialNo: [null,Validators.required],
    });
    (this.dataForm?.get('seats') as FormArray).push(f);
    // console.log(this.seatsDataArray);
  }


  onBusFloorSelect(evt:string){
    this.tempFloor = evt;
  }

  removeFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'seat': {
        formDataArray = this.seatsDataArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
  }


  onSubmit() {
    // console.log(this.dataForm.value)
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    const mData = {
      ...this.dataForm.value,
    };

    if (this.bus) {
      this.updateBusById(mData);
    } else {
      this.addBus(mData);
    }
  }


  /**
   * HTTP REQ HANDLE
   * getBusById()
   * addBus()
   * updateBusById()
   * deleteMultipleFile()
   */


  private getBusById() {
    this.spinnerService.show();
    this.subDataThree = this.busService.getBusById(this.id).subscribe({
      next: res => {
        this.spinnerService.hide();
        if (res.success) {
          this.bus = res.data;
          // console.log('this.bus', this.bus)
          this.setFormValue();
        }
      },
      error: error => {
        this.spinnerService.hide();
        console.log(error);
      }

    })

  }

  private addBus(data: any) {
    this.isLoading = true;
    this.subDataTwo = this.busService.addBus(data).subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
          this.initDataForm();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: error => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

  private updateBusById(data: any) {
    this.isLoading = true;
    this.subDataFour = this.busService
      .updateBusById(this.bus._id, data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: error => {
          this.isLoading = false;
          console.log(error);
        }
      });

  }





  /**
   * ON DESTROY
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
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }

}
