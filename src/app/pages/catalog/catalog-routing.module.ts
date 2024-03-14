import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllTerminallComponent} from './terminal/all-terminall/all-terminall.component';
import {AddTerminalComponent} from './terminal/add-terminal/add-terminal.component';
import {AllCounterComponent} from './counter/all-counter/all-counter.component';
import {AddCounterComponent} from './counter/add-counter/add-counter.component';
import {AllScheduleComponent} from './shcedule/all-schedule/all-schedule.component';
import {AddScheduleComponent} from './shcedule/add-schedule/add-schedule.component';
import {AllRouteComponent} from './route/all-route/all-route.component';
import {AddRouteComponent} from './route/add-route/add-route.component';
import {AllRouteRelationComponent} from './route-relation/all-route-relation/all-route-relation.component';
import {AddRouteRelationComponent} from './route-relation/add-route-relation/add-route-relation.component';
import {AllBusComponent} from './bus/all-bus/all-bus.component';
import {AddBusComponent} from './bus/add-bus/add-bus.component';
import {AllTripComponent} from './trip/all-trip/all-trip.component';
import {AddTripComponent} from './trip/add-trip/add-trip.component';
import {AddBusConfigComponent} from './bus-config/add-bus-config/add-bus-config.component';
import {AllBusConfigComponent} from './bus-config/all-bus-config/all-bus-config.component';

const routes: Routes = [
  {path: 'all-counter', component: AllCounterComponent},
  {path: 'add-counter', component: AddCounterComponent},
  {path: 'edit-counter/:id', component: AddCounterComponent},
  {path: 'all-terminal', component: AllTerminallComponent},
  {path: 'add-terminal', component: AddTerminalComponent},
  {path: 'edit-terminal/:id', component: AddTerminalComponent},
  {path: 'all-schedule', component: AllScheduleComponent},
  {path: 'add-schedule', component: AddScheduleComponent},
  {path: 'edit-schedule/:id', component: AddScheduleComponent},
  {path: 'all-route', component: AllRouteComponent},
  {path: 'add-route', component: AddRouteComponent},
  {path: 'edit-route/:id', component: AddRouteComponent},
  {path: 'all-route-relation', component: AllRouteRelationComponent},
  {path: 'add-route-relation', component: AddRouteRelationComponent},
  {path: 'edit-route-relation/:id', component: AddRouteRelationComponent},
  {path: 'all-bus', component: AllBusComponent},
  {path: 'add-bus', component: AddBusComponent},
  {path: 'edit-bus/:id', component: AddBusComponent},
  {path: 'all-trip', component: AllTripComponent},
  {path: 'add-trip', component: AddTripComponent},
  {path: 'edit-trip/:id', component: AddTripComponent},
  {path: 'add-bus-config', component: AddBusConfigComponent},
  {path: 'all-bus-config', component: AllBusConfigComponent},
  {path: 'edit-bus-config/:id', component: AddBusConfigComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule {
}
