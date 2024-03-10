import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {NgxSpinnerModule} from "ngx-spinner";
import {MaterialModule} from "../material/material.module";
import { TripSheetComponent } from './trip-sheet/trip-sheet.component';
import { TripSheetModule } from './trip-sheet/trip-sheet.module';


@NgModule({
  declarations: [
    PagesComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    NgxSpinnerModule,
    MaterialModule,
    TripSheetModule
  ]
})
export class PagesModule {
}
