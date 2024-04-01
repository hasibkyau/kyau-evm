import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BusBookingRoutingModule} from './bus-booking-routing.module';
import {AllTicketsComponent} from './all-tickets/all-tickets.component';
import {AddNewBookingComponent} from './add-new-booking/add-new-booking.component';
import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from 'src/app/shared/pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {AuthorSelectModule} from '../../shared/lazy/author-select/author-select.module';
import {PublisherSelectModule} from "../../shared/lazy/publisher-select/publisher-select.module";
import {CategorySelectModule} from '../../shared/lazy/category-select/category-select.module';
import {SubCategorySelectModule} from '../../shared/lazy/sub-category-select/sub-category-select.module';
import {BrandSelectModule} from 'src/app/shared/lazy/brand-select/brand-select.module';
import {QuillEditorComponent} from "ngx-quill";
import {TypeSelectModule} from "../../shared/lazy/type-select/type-select.module";
import {GenericSelectModule} from "../../shared/lazy/generic-select/generic-select.module";
import {UnitSelectModule} from "../../shared/lazy/unit-select/unit-select.module";
import {SearchResultComponent} from './search-result/search-result.component';
import {FilterComponent} from './filter/filter.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {SearchTripModule} from '../../shared/components/search-trip/search-trip.module';
import { NgxPrintModule } from 'ngx-print';
import { CanceledListComponent } from './canceled-list/canceled-list.component';

@NgModule({
  declarations: [
    AllTicketsComponent,
    AddNewBookingComponent,
    SearchResultComponent,
    FilterComponent,
    ConfirmDialogComponent,
    CanceledListComponent,
  ],
  imports: [
    CommonModule,
    BusBookingRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    NgxPrintModule,
    MaterialModule,
    DirectivesModule,
    PipesModule,
    FlexLayoutModule,
    DigitOnlyModule,
    AuthorSelectModule,
    BrandSelectModule,
    PublisherSelectModule,
    CategorySelectModule,
    SubCategorySelectModule,
    QuillEditorComponent,
    TypeSelectModule,
    GenericSelectModule,
    UnitSelectModule,
    SearchTripModule,
    DirectivesModule
  ]
})
export class BusBookingModule {
}
