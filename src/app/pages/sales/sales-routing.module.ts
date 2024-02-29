import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllOrdersComponent} from './all-orders/all-orders.component';
import {AddOrderComponent} from './add-order/add-order.component';
import {OrderDetailsComponent} from './order-details/order-details.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ShippingChargeComponent } from './shipping-charge/shipping-charge.component';
import { AllPrescriptionOrdersComponent } from './all-prescription-orders/all-prescription-orders.component';
import { PrescriptionOrderDertailsComponent } from './prescription-order-dertails/prescription-order-dertails.component';
import {AddPrescriptionOrderComponent} from './add-prescription-order/add-prescription-order.component';
import {AllRequestMedicineComponent} from './all-request-medicine/all-request-medicine.component';
import {RequestMedicineDetailsComponent} from './request-medicine-details/request-medicine-details.component';
import {AddRequestMedicineComponent} from './add-request-medicine/add-request-medicine.component';

const routes: Routes = [
  // {path: '', redirectTo: 'all-orders'},
  {path: 'all-orders', component: AllOrdersComponent},
  {path: 'all-prescription-orders', component: AllPrescriptionOrdersComponent},
  {path: 'add-prescription-orders/:id', component: AddPrescriptionOrderComponent},
  {path: 'add-order', component: AddOrderComponent},
  {path: 'transaction', component: TransactionsComponent},
  {path: 'edit-order/:id', component: AddOrderComponent},
  {path: 'order-details/:id', component: OrderDetailsComponent},
  {path: 'prescription-order-details/:id', component: PrescriptionOrderDertailsComponent},
  {path: 'shipping-charge', component: ShippingChargeComponent},
  {path: 'all-request-orders', component: AllRequestMedicineComponent},
  {path: 'request-medicine-details/:id', component: RequestMedicineDetailsComponent},
  {path: 'add-request-medicine/:id', component: AddRequestMedicineComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
