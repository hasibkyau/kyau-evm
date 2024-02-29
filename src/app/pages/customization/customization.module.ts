import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomizationRoutingModule } from './customization-routing.module';
import { AddCarouselComponent } from './carousel/add-carousel/add-carousel.component';
import { AllCarouselsComponent } from './carousel/all-carousels/all-carousels.component';
import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { AllBannerComponent } from './banner/all-banner/all-banner.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import { AddPopupComponent } from './popup/add-popup/add-popup.component';
import { AllPopupComponent } from './popup/all-popup/all-popup.component';
import { ShopInformationComponent } from './shop-information/shop-information.component';
import { AddOrderGuideComponent } from './order-guide/add-order-guide/add-order-guide.component';
import { AllOrderGuideComponent } from './order-guide/all-order-guide/all-order-guide.component';
import {QuillEditorComponent} from "ngx-quill";

@NgModule({
  declarations: [
    AddCarouselComponent,
    AllCarouselsComponent,
    AddBannerComponent,
    AllBannerComponent,
    AddPopupComponent,
    AllPopupComponent,
    ShopInformationComponent,
    AddOrderGuideComponent,
    AllOrderGuideComponent,
  ],
  imports: [
    CommonModule,
    CustomizationRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    QuillEditorComponent,
  ],
})
export class CustomizationModule {}
