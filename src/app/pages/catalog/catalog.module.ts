import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CatalogRoutingModule} from './catalog-routing.module';
import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {AddTerminalComponent} from './terminal/add-terminal/add-terminal.component';
import {AllTerminallComponent} from './terminal/all-terminall/all-terminall.component';
import {AddCounterComponent} from './counter/add-counter/add-counter.component';
import {AllCounterComponent} from './counter/all-counter/all-counter.component';
import {AddScheduleComponent} from './shcedule/add-schedule/add-schedule.component';
import {AllScheduleComponent} from './shcedule/all-schedule/all-schedule.component';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {AddRouteComponent} from './route/add-route/add-route.component';
import {AllRouteComponent} from './route/all-route/all-route.component';
import {AddRouteRelationComponent} from './route-relation/add-route-relation/add-route-relation.component';
import {AllRouteRelationComponent} from './route-relation/all-route-relation/all-route-relation.component';
import {AddBusComponent} from './bus/add-bus/add-bus.component';
import {AllBusComponent} from './bus/all-bus/all-bus.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {PipesModule} from 'src/app/shared/pipes/pipes.module';
import {AddTripComponent} from './trip/add-trip/add-trip.component';
import {AllTripComponent} from './trip/all-trip/all-trip.component';
import {AddBusConfigComponent} from './bus-config/add-bus-config/add-bus-config.component';
import {AllBusConfigComponent} from './bus-config/all-bus-config/all-bus-config.component';
import {SearchTripModule} from '../../shared/components/search-trip/search-trip.module';
import { AssignTripComponent } from './bus-config/all-bus-config/assign-trip/assign-trip.component';
import { DatePickerModule } from 'src/app/shared/components/date-picker/date-picker.module';

@NgModule({
  declarations: [
    AddTerminalComponent,
    AllTerminallComponent,
    AddCounterComponent,
    AllCounterComponent,
    AddScheduleComponent,
    AllScheduleComponent,
    AddRouteComponent,
    AllRouteComponent,
    AddRouteRelationComponent,
    AllRouteRelationComponent,
    AddBusComponent,
    AllBusComponent,
    AddTripComponent,
    AllTripComponent,
    AddBusConfigComponent,
    AllBusConfigComponent,
    AssignTripComponent,
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
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
    DatePickerModule
  ]
})
export class CatalogModule {
}
