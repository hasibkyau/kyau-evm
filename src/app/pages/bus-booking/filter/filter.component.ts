import { Component } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  isFilterBuy = false;


  /**
   * FILTER BUY DESIGN CONTROLL
   * onShowFilterBuy()
   */
  onShowFilterBuy(){
      this.isFilterBuy = !this.isFilterBuy;
  }
}
