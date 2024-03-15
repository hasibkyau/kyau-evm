import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'seatImage'
})
export class SeatImagePipe implements PipeTransform {

  transform(seatType: string, status: 'Available' | 'Booked' | 'Selected' | 'Sold', gender?: string): unknown {

    switch (seatType) {
      case 'noSeat' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/singleChair.png`;
      }
      case 'singleChair' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/singleChair.png`;
      }
      case 'singleNonAc' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/singleCabin.png`;
      }
      case 'doubleNonAc' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/doubleCabin.png`;
      }
      case 'familyAc' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/familyCabin.png`;
      }
      case 'singleAc' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/singleSleeper.png`;
      }
      case 'doubleAc' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/doubleSleeper.png`;
      }
      case 'vip' : {
        return `/assets/images/seats/${status + (gender === 'Female' ? '/Female' : '')}/vipAc.png`;
      }
      default: {
        return '-';
      }
    }

  }

}
