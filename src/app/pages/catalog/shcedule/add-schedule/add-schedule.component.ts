import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Schedule } from 'src/app/interfaces/common/schedule.interface';
import { ScheduleService } from 'src/app/services/common/schedule.service';
import { UiService } from 'src/app/services/core/ui.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {

// Data Form
@ViewChild('formElement') formElement: NgForm;
dataForm?: FormGroup;

// Store Data
id?: string;
schedule?: Schedule;

isLoading = false;


// Subscriptions
private subDataOne: Subscription;
private subDataTwo: Subscription;
private subDataThree: Subscription;
private subRouteOne: Subscription;

constructor(
  private fb: FormBuilder,
  private uiService: UiService,
  private spinnerService: NgxSpinnerService,
  private activatedRoute: ActivatedRoute,
  private scheduleService: ScheduleService,
) {
}

ngOnInit(): void {
  // Init Form
  this.initDataForm();

  // GET ID FORM PARAM
  this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
    this.id = param.get('id');
    if (this.id) {
      this.getScheduleById();
    }
  });
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
    priority: [null],
    status: ['publish'],
    shift:['Morning',Validators.required]
  });
}

private setFormValue() {
  this.dataForm.patchValue(this.schedule);
}

onSubmit() {
  if (this.dataForm.invalid) {
    this.uiService.warn('Please filed all the required field');
    return;
  }

  
  if (this.schedule) {

    this.updateScheduleById();

  } else {

    this.addSchedule();

  }
}

/**
 * HTTP REQ HANDLE
 * getScheduleById()
 * addSchedule()
 * updateScheduleById()
 * removeSingleFile()
 */

private getScheduleById() {
  this.spinnerService.show();
  this.subDataOne = this.scheduleService.getScheduleById(this.id).subscribe({
    next: (res) => {
      this.spinnerService.hide();
      if (res.data) {
        this.schedule = res.data;
        this.setFormValue();
      }
    },
    error: (error) => {
      this.spinnerService.hide();
      console.log(error);
    },
  });
}

private addSchedule() {
  this.isLoading = true;
  this.subDataTwo = this.scheduleService.addSchedule(this.dataForm.value).subscribe({
    next: (res) => {
      this.isLoading = false;
      if (res.success) {
        this.uiService.success(res.message);
        this.formElement.resetForm();
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

private updateScheduleById() {
  this.isLoading = true;
  this.subDataThree = this.scheduleService
    .updateScheduleById(this.schedule._id, this.dataForm.value)
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
