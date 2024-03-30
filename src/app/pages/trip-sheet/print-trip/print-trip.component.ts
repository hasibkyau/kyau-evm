import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TICKET_TYPES } from 'src/app/core/utils/app-data';
import { AdminPermissions } from 'src/app/enum/admin-permission.enum';
import { Bus } from 'src/app/interfaces/common/bus.interface';
import { Ticket } from 'src/app/interfaces/common/ticket.interface';
import { Select } from 'src/app/interfaces/core/select';
import { BusService } from 'src/app/services/common/bus.service';
import { TicketService } from 'src/app/services/common/ticket.service';
import { TripService } from 'src/app/services/common/trip.service';
import { UtilsService } from 'src/app/services/core/utils.service';

@Component({
  selector: 'app-print-trip',
  templateUrl: './print-trip.component.html',
  styleUrls: ['./print-trip.component.scss'],
})
export class PrintTripComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  ticketTypes: Select[] = TICKET_TYPES;
  toggleMenu: boolean = false;
  tickets: Ticket[] = [];
  holdPrevData: Ticket[] = [];
  totalTickets: number;
  id?: string;
  buss: Bus[] = [];

  tripSheets: any[] = [];
  tripDetails: any;

  // FilterData
  filter: any = null;
  sortQuery: any = { createdAt: -1 };
  activeSort: number;
  activeFilter1: number = null;
  activeFilter2: number = null;

  myInterval: any;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;

  // Subscriptions
  private subRouteOne: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private busService: BusService,
    private tripService: TripService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        // this.getBusById();
        this.getTripSheetByTrip(this.id);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAllTicket()
   */

  private getTripSheetByTrip(id: string) {
    this.tripService.getTripSheetById(id).subscribe({
      next: (res: any) => {
        console.log('tripSheet', res?.data);
        this.tripSheets = res?.data?.tripSheet;
        this.tripDetails = res?.data?.tripDetails;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }
}
