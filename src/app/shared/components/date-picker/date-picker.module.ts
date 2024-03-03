import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    DatePickerComponent
  ],
  imports: [
    CommonModule, MatInputModule, MaterialModule
  ],
  exports: [DatePickerComponent]
})
export class DatePickerModule { }
