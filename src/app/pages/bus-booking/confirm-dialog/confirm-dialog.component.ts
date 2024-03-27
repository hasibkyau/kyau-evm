import { Component, OnInit } from '@angular/core';
import { ALL_TICKET } from 'src/app/core/db/ticket.db';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  isConfirm = false;
  ticket:any;
  selectedMethod!:string;
  isShowPayment = false;
  allTicket:any[] = [];

   ngOnInit(): void {
       this.allTicket = JSON.parse(`${sessionStorage.getItem('all_ticket')}`) ? JSON.parse(`${sessionStorage.getItem('all_ticket')}`) : [];
   }


  /**
   * CONFIRM DIALOG
   */

  onShowConfirmDialog(data:any){
      this.isConfirm = true;
      this.ticket = data;
      // console.log(data);
  }

  onHideConfirmDialog(){
    this.isConfirm = false;
    this.allTicket.push(this.ticket);
    // console.log(this.ticket);
    sessionStorage.setItem('booked_ticket', JSON.stringify(this.ticket));
    sessionStorage.setItem('all_ticket', JSON.stringify(this.allTicket));
  }

  onSelectPaymentMethod(method:string){
       this.selectedMethod = method;
       this.isShowPayment = false;
  }
  onShowPaymentDropDown(){
       this.isShowPayment = !this.isShowPayment;
  }


}
