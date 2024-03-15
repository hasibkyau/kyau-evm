import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TripService} from 'src/app/services/common/trip.service';
import {UiService} from 'src/app/services/core/ui.service';
import {UtilsService} from 'src/app/services/core/utils.service';

@Component({
  selector: 'app-assign-trip',
  templateUrl: './assign-trip.component.html',
  styleUrls: ['./assign-trip.component.scss']
})
export class AssignTripComponent implements OnInit {
  popup: boolean = false;

  isLoading: boolean = false;

  dataForm?: FormGroup;

  today: Date = new Date()

  //base data
  trip: any;

  // Subscriptions
  private subDataOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private tripService: TripService,
    private utilService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();
  }

  showPopup(data?: any) {
    this.trip = data;
    this.popup = true;
    this.dataForm.patchValue({date: this.utilService.getDateString(new Date)})
  }

  hidePopup() {
    this.popup = false;
  }

  onDateSelect(date: any) {
    this.dataForm.patchValue({date: date})
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    this.isLoading = true;
    const mData = {
      busConfigId: this.trip?._id,
      date: this.dataForm.value.date,
    };
    this.addTrip(mData);
  }

  private initDataForm() {
    this.dataForm = this.fb.group({
      date: [null, Validators.required],
    });
  }


  private addTrip(data: any) {
    this.subDataOne = this.tripService.addTrip(data).subscribe({
      next: res => {
        this.isLoading = false;
        if (res.success) {
          // this.hidePopup();
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
  }
}

