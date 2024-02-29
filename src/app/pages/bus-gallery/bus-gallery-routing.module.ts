import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllBusGalleryComponent } from './all-bus-gallery/all-bus-gallery.component';
import { AddBusGalleryComponent } from './add-bus-gallery/add-bus-gallery.component';

const routes: Routes = [
  {
    path:"all-bus-gallery",component:AllBusGalleryComponent},
  { path: 'add-bus-gallery', component: AddBusGalleryComponent },
  { path: 'edit-bus-gallery/:id', component: AddBusGalleryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusGalleryRoutingModule { }
