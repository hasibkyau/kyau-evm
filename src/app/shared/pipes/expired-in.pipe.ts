import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../../services/core/utils.service';

@Pipe({
  name: 'expiredIn',
  pure: true
})
export class ExpiredInPipe implements PipeTransform {

  constructor(
    private utilsService: UtilsService
  ) {
  }

  transform(date: any, type: 'HH:MM' | 'DD:HH:MM' | 'DD:HH:MM:SS'): any {

    if (date) {
      const data = this.utilsService.getExpiredIn(date);
      if (type === 'HH:MM') {
        return `${data.hours} Hours ${data.minutes} Minutes`
      } else if (type === 'DD:HH:MM') {
        return `${data.days} Days ${data.hours} Hours ${data.minutes} Minutes`
      } else if (type === 'DD:HH:MM:SS') {
        return `${data.days}d: ${data.hours}h: ${data.minutes}m:  ${data.seconds}s`
      }
      else {
        return '-'
      }
    } else {
      return '-';
    }

  }

}
