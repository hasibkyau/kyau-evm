import {Component, Input, OnInit} from '@angular/core';
import { Seat } from 'src/app/interfaces/common/bus.interface';
import { Ticket } from 'src/app/interfaces/common/ticket.interface';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  @Input() ticket: Ticket = null;


  constructor() { }

  ngOnInit(): void {
    console.log("singleLaunchData",this.ticket)
  }

  openPopup(data?:Ticket){
    this.ticket = data;
    console.log('ticket',data);
    
  }

  // getCabinSeats(seats: Seat[]) {
  //   if (seats && seats.length) {
  //     return seats.map(m => {
  //       if (m.zone && m.type) {
  //         return `Zone:${m.zone} ${m.seatNo} (${m.type})`
  //       } else {
  //         return m.seatNo
  //       }
  //     }).join(',');
  //   }
  // }

}
