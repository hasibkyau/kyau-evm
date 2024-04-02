import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  constructor() {
  }

  transform(prices: any[], seatType: string): number {
    if (prices.length) {
      const f = prices.find(f => f.seatType === seatType);
      return f?.price ? f?.price :  0
    } else {
      return 0;
    }
  }

}
