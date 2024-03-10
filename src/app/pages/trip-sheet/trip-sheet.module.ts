import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {PipesModule} from 'src/app/shared/pipes/pipes.module';
import {SearchTripModule} from '../../shared/components/search-trip/search-trip.module';
import { DatePickerModule } from 'src/app/shared/components/date-picker/date-picker.module';
import { TripSheetComponent } from './trip-sheet.component';
import { NgxSpinner } from 'ngx-spinner';
import { RouterLink } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    TripSheetComponent
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    NgxMatTimepickerModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    PipesModule,
    FlexLayoutModule,
    DigitOnlyModule,
    SearchTripModule,
    DatePickerModule,
    RouterLink,
    NgxPrintModule
  ]
})
export class TripSheetModule {
}
