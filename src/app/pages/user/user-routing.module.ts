import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user.component";
import {UserListComponent} from "./user-list/user-list.component";
import {AddUserComponent} from "./add-user/add-user.component";
import {CartListComponent} from './cart-list/cart-list.component';


const routes: Routes = [
  {path: '', component: UserComponent},
  {path: 'user-list', component: UserListComponent},
  {path: 'add-user', component: AddUserComponent},
  {path: 'edit-user/:id', component: AddUserComponent},
  {path: 'user-cart-list/:id', component: CartListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
