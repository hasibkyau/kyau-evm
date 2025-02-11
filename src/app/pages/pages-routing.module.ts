import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckAuthAccessGuard} from '../auth-guard/check-auth-access.guard';
import {PagesComponent} from './pages.component';
import { TripSheetComponent } from './trip-sheet/trip-sheet.component';
import { PrintTripComponent } from './trip-sheet/print-trip/print-trip.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [CheckAuthAccessGuard]
      },

      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule),
        // canActivate: [CheckAuthAccessGuard],
      },

      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'bus-booking',
        loadChildren: () => import('./bus-booking/bus-booking.module').then(m => m.BusBookingModule),
      },

      {
        path: 'customization',
        loadChildren: () => import('./customization/customization.module').then(m => m.CustomizationModule),
      },
      {
        path: 'catalog',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
      },
      {path: 'trip-sheet', component: TripSheetComponent},
      {path: 'trip-sheet/:id', component: PrintTripComponent},

      {
        path: 'admin-control',
        loadChildren: () => import('./admin-control/admin-control.module').then(m => m.AdminControlModule),
        // canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'review',
        loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule),
      },
      {
        path: 'discount-percent',
        loadChildren: () => import('./discount-percent/discount-percent.module').then(m => m.DiscountPercentModule),
      },
      {
        path: 'additionl-page',
        loadChildren: () => import('./additionl-page/additionl-page.module').then(m => m.AdditionlPageModule),
      },
      {
        path:"address",
        loadChildren:() => import('./address/address.module').then(m => m.AddressModule)
      },
      {
        path:"seo",
        loadChildren:() => import('./seo-page/seo-page.module').then( m => m.SeoPageModule)
      },
      {
        path:"bus-gallery",
        loadChildren: () => import('./bus-gallery/bus-gallery.module').then(m => m.BusGalleryModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PagesRoutingModule {
}
