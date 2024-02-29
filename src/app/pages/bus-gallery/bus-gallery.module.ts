import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusGalleryRoutingModule } from './bus-gallery-routing.module';
import { AddBusGalleryComponent } from './add-bus-gallery/add-bus-gallery.component';
import { AllBusGalleryComponent } from './all-bus-gallery/all-bus-gallery.component';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';


@NgModule({
  declarations: [
    AddBusGalleryComponent,
    AllBusGalleryComponent
  ],
  imports: [
    CommonModule,
    BusGalleryRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
  ]
})
export class BusGalleryModule { }
