import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { PRODUCT_STATUS } from 'src/app/core/utils/app-data';
import { Schedule } from 'src/app/interfaces/common/schedule.interface';
import { Terminal } from 'src/app/interfaces/common/terminal.interface';
import { Trip } from 'src/app/interfaces/common/trip.interface';
import { Select } from 'src/app/interfaces/core/select';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { BusConfigService } from 'src/app/services/common/bus-config.service';
import { ScheduleService } from 'src/app/services/common/schedule.service';
import { TerminalService } from 'src/app/services/common/terminal.service';
import { TripService } from 'src/app/services/common/trip.service';
import { UiService } from 'src/app/services/core/ui.service';
import { UtilsService } from 'src/app/services/core/utils.service';

@Component({
  selector: 'app-assign-trip',
  templateUrl: './assign-trip.component.html',
  styleUrls: ['./assign-trip.component.scss']
})
export class AssignTripComponent implements OnInit{
  popup: boolean = false;
  description: any = undefined;

  schedules: Schedule[] = [];
  terminals: Terminal[] = [];
  tripStatus: Select[] = PRODUCT_STATUS;

  dataForm?: FormGroup;
  date?: string;

  //base data
  trip: any;
  tripType: number = 1;

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
    private uiService: UiService,
    private tripService: TripService,
    private spinnerService: NgxSpinnerService,
    private scheduleService: ScheduleService,
    private terminalService: TerminalService,
    private utilService:UtilsService,
    private busConfigService: BusConfigService
  ) {}

  ngOnInit(): void {}

  showPopup(data?: any) {
    // Init Data Form
    this.initDataForm();
    this.trip = data;    

    console.log(data);
    this.popup = true;
    this.date = this.utilService.getDateString(new Date);
  }

  hidePopup() {
    this.popup = false;
  }

  onToggleTripType(type:any){
    this.tripType = type;
  }

  onDateSelect(date:any){
    this.date = date;
  }

  onSubmit() {
    this.getAllTrip(this.date);
  }

  private initDataForm() {
    this.dataForm = this.fb.group({
      date: [null, Validators.required],
    });

    this.setFormValue();
  }

  private setFormValue() {
  }


  private addTrip(data: any) {
    this.subDataOne = this.tripService.addTrip(data).subscribe({
      next: res => {
        if (res.success) {
          // this.hidePopup();
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  private getAllTrip(date:string) {
    // Select
    const mSelect = {
      bus: 1,
      date: 1,
      from: 1,
      to: 1,
      status: 1,
    };

    let mFilter ={
      busConfig: this.trip._id,
      date: this.date 
    }

    const filter: FilterData = {
      filter: mFilter,
      select: mSelect,
    };

    this.subDataOne = this.tripService
      .getAllTrip(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) { 
            console.log('all trip', res);
            if(res?.data?.length > 0){
              let dateString = moment(this.date).format('YYYY-MM-DD');
              this.uiService.wrong("Trip already added for " + dateString)
            }else{
              const mData = {
                ...this.trip,
                ...{
                    _id: null,
                    busConfig: this.trip?._id,
                    date: this.date,
                }
              };    
              this.addTrip(mData);
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
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

