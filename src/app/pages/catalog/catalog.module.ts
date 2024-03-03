import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CatalogRoutingModule} from './catalog-routing.module';
import {AddCategoryComponent} from './category/add-category/add-category.component';
import {AllCategoryComponent} from './category/all-category/all-category.component';

import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {AllSubCategoryComponent} from './sub-category/all-sub-category/all-sub-category.component';
import {AddSubCategoryComponent} from './sub-category/add-sub-category/add-sub-category.component';
import {AllPublisherComponent} from './publisher/all-publisher/all-publisher.component';
import {AddPublisherComponent} from './publisher/add-publisher/add-publisher.component';
import {AllAuthorComponent} from './author/all-author/all-author.component';
import {AddAuthorComponent} from './author/add-author/add-author.component';
import {AllTagComponent} from './tag/all-tag/all-tag.component';
import {AddTagComponent} from './tag/add-tag/add-tag.component';
import {AddBrandComponent} from './brand/add-brand/add-brand.component';
import {AllBrandComponent} from './brand/all-brand/all-brand.component';
import {AddTypeComponent} from "./types/add-type/add-type.component";
import {AllTypesComponent} from "./types/all-types/all-types.component";
import {AddGenericComponent} from './generic/add-generic/add-generic.component';
import {AllGenericComponent} from './generic/all-generic/all-generic.component';
import {AddUnitComponent} from './unit/add-unit/add-unit.component';
import {AllUnitComponent} from './unit/all-unit/all-unit.component';
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
    AddCategoryComponent,
    AllCategoryComponent,
    AllSubCategoryComponent,
    AddSubCategoryComponent,
    AllPublisherComponent,
    AddPublisherComponent,
    AllAuthorComponent,
    AddAuthorComponent,
    AllTagComponent,
    AddTagComponent,
    AddBrandComponent,
    AllBrandComponent,
    AddTypeComponent,
    AllTypesComponent,
    AddGenericComponent,
    AllGenericComponent,
    AddUnitComponent,
    AllUnitComponent,
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
