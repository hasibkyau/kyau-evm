import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { AllBannerComponent } from './banner/all-banner/all-banner.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarouselComponent } from './carousel/add-carousel/add-carousel.component';
import { AllCarouselsComponent } from './carousel/all-carousels/all-carousels.component';
import {AllPopupComponent} from "./popup/all-popup/all-popup.component";
import {AddPopupComponent} from "./popup/add-popup/add-popup.component";
import { ShopInformationComponent } from './shop-information/shop-information.component';
import {AllOrderGuideComponent} from "./order-guide/all-order-guide/all-order-guide.component";
import {AddOrderGuideComponent} from "./order-guide/add-order-guide/add-order-guide.component";

const routes: Routes = [
  { path: 'all-carousels', component: AllCarouselsComponent },
  { path: 'add-carousel', component: AddCarouselComponent },
  { path: 'edit-carousel/:id', component: AddCarouselComponent },
  { path: 'all-banner', component: AllBannerComponent },
  { path: 'add-banner', component: AddBannerComponent },
  { path: 'edit-banner/:id', component: AddBannerComponent },
  {path:"shop-information",component:ShopInformationComponent},
  { path: 'all-popup', component: AllPopupComponent },
  { path: 'add-popup', component: AddPopupComponent},
  { path: 'edit-popup/:id', component: AddPopupComponent },
  { path: 'all-order-guide', component: AllOrderGuideComponent },
  { path: 'add-order-guide', component: AddOrderGuideComponent},
  { path: 'edit-order-guide/:id', component: AddOrderGuideComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizationRoutingModule {}
