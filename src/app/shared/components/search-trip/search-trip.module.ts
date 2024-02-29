import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchTripComponent } from './search-trip.component';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [
    SearchTripComponent
  ],
  imports: [
    CommonModule,
    DigitOnlyModule,
    FormsModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule
  ],
  exports: [
    SearchTripComponent
  ]
})
export class SearchTripModule { }
