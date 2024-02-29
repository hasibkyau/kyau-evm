import {Pipe, PipeTransform} from '@angular/core';
import {PriceData, Product} from '../../interfaces/common/product.interface';
import {DiscountTypeEnum} from '../../enum/product.enum';
import {UtilsService} from '../../services/core/utils.service';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  constructor(
    private utilsService: UtilsService
  ) {
  }

  transform(product: Product | PriceData, type: 'salePrice' | 'discountAmount' | 'discountPercentage' | 'regularPrice', quantity?: number): number {
    if (product) {
      switch (type) {
        case 'salePrice': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            const disPrice = (product?.discountAmount / 100) * product?.salePrice;
            if (quantity) {
              return this.utilsService.roundNumber((product?.salePrice - disPrice) * quantity);
            }
            return this.utilsService.roundNumber(product?.salePrice - disPrice);
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (quantity) {
              return this.utilsService.roundNumber((product?.salePrice - product.discountAmount) * quantity);
            }
            return this.utilsService.roundNumber(product?.salePrice - product.discountAmount);
          } else {
            if (quantity) {
              return this.utilsService.roundNumber((product?.salePrice) * quantity);
            }
            return this.utilsService.roundNumber(product?.salePrice);
          }
        }
        case 'discountAmount': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (quantity) {
              return this.utilsService.roundNumber(((product?.discountAmount / 100) * product?.salePrice) * quantity);
            }
            return this.utilsService.roundNumber((product?.discountAmount / 100) * product?.salePrice);
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (quantity) {
              return product?.discountAmount * quantity;
            }
            return product?.discountAmount;
          } else {
            return 0;
          }
        }
        case 'discountPercentage': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (quantity) {
              return product?.discountAmount;
            }
            return product?.discountAmount;
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (quantity) {
              return Math.round((product?.discountAmount / product?.salePrice) * 100);
            }
            return Math.round((product?.discountAmount / product?.salePrice) * 100);
          } else {
            return 0;
          }
        }
        case 'regularPrice': {
          if (quantity) {
            return this.utilsService.roundNumber(product?.salePrice * quantity);
          }
          return this.utilsService.roundNumber(product?.salePrice);
        }
        default: {
          return product?.salePrice;
        }
      }
    }
    else {
      return 0;
    }
  }

}
