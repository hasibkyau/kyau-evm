import {Pipe, PipeTransform} from '@angular/core';
import {Ticket} from '../../interfaces/common/ticket.interface';

@Pipe({
  name: 'ticketSeats',
  pure: true
})
export class TicketSeatsPipe implements PipeTransform {


  transform(ticket: Ticket, type?: 'Canceled'): any {

    if (type && type === 'Canceled') {
      if (ticket.canceledSeats.length) {
        return ticket.canceledSeats.map(m => m.seatNo).join();
      } else {
        return '-'
      }
    } else {
      if (ticket.seats.length) {
        return ticket.seats.map(m => m.seatNo).join();
      } else {
        return '-'
      }
    }


  }

}
