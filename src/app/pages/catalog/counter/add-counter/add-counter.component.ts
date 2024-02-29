import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Counter } from 'src/app/interfaces/common/counter.interface';
import { Select } from 'src/app/interfaces/core/select';
import { CounterService } from 'src/app/services/common/counter.service';
import { UiService } from 'src/app/services/core/ui.service';
interface AccessOption {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-add-counter',
  templateUrl: './add-counter.component.html',
  styleUrls: ['./add-counter.component.scss']
})
export class AddCounterComponent implements OnInit {

 // Data Form
 @ViewChild('formElement') formElement: NgForm;
 dataForm?: FormGroup;

 HasAccessControl = new FormControl<AccessOption | null>(
   null,
   Validators.required
 );

 hasAccess: Select[] = [
   {value: true, viewValue: 'Yes'},
   {value: false, viewValue: 'No'},
 ];


 // Store Data
 id?: string;
 counter?: Counter;
 autoSlug = true;
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
   private counterService: CounterService,
 ) {
 }

 ngOnInit(): void {
   // Init Form
   this.initDataForm();

   // GET ID FORM PARAM
   this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
     this.id = param.get('id');

     if (this.id) {
       this.getCounterById();
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
     name: [null],
     priority: [null],
     status: ['publish'],
   });
 }

 private setFormValue() {
   this.dataForm.patchValue(this.counter);
 }

 onSubmit() {
   if (this.dataForm.invalid) {
     this.uiService.warn('Please filed all the required field');
     return;
   }
   if (!this.counter) {
     this.addCounter();
   } else {
     this.updateCounterById();
   }
 }

 /**
  * HTTP REQ HANDLE
  * getCounterById()
  * addCounter()
  * updateCounterById()
  */

 private getCounterById() {
   this.spinnerService.show();
   this.subDataOne = this.counterService.getCounterById(this.id).subscribe({
     next: (res) => {
       this.spinnerService.hide();
       if (res.data) {
         this.counter = res.data;
         this.setFormValue();
       }
     },
     error: (error) => {
       this.spinnerService.hide();
       console.log(error);
     },
   });
 }

 private addCounter() {
   this.isLoading = true;
   this.subDataTwo = this.counterService
     .addCounter(this.dataForm.value)
     .subscribe({
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

 private updateCounterById() {
  this.isLoading = true;
   this.subDataThree = this.counterService
     .updateCounterById(this.counter._id, this.dataForm.value)
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
