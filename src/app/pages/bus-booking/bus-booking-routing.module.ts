import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddNewBookingComponent} from './add-new-booking/add-new-booking.component';
import {AllTicketsComponent} from './all-tickets/all-tickets.component';

const routes: Routes = [
  {path: 'add-booking', component: AddNewBookingComponent},
  {path: 'edit-booking/:id', component: AddNewBookingComponent},
  {path: 'all-tickets', component: AllTicketsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusBookingRoutingModule {
}