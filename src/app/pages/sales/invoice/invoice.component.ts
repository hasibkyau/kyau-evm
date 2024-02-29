import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../../../interfaces/common/order.interface";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/core/filter-data";
import {OrderService} from "../../../services/common/order.service";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {


  @Input() data: Order;



  constructor(

  ) { }

  ngOnInit(): void {

    console.log("this.datda+mt+++++++++",this.data)

  }




}
