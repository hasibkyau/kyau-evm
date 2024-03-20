import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TICKET_TYPES} from 'src/app/core/utils/app-data';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {Bus} from 'src/app/interfaces/common/bus.interface';
import {Ticket} from 'src/app/interfaces/common/ticket.interface';
import {Select} from 'src/app/interfaces/core/select';
import {FilterData} from 'src/app/interfaces/gallery/filter-data';
import {BusService} from 'src/app/services/common/bus.service';
import {TicketService} from 'src/app/services/common/ticket.service';
import {UtilsService} from 'src/app/services/core/utils.service';


@Component({
  selector: 'app-trip-sheet',
  templateUrl: './trip-sheet.component.html',
  styleUrls: ['./trip-sheet.component.scss']
})
export class TripSheetComponent implements OnInit {
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

  // FilterData
  filter: any = null;
  sortQuery: any = {createdAt: -1};
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
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private ticketService: TicketService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private busService: BusService,
  ) {
  }

  ngOnInit(): void {

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam.get('from')) {
        this.filter = {
          ...this.filter,
          ...{
            'from.name': qParam.get('from'),
          }
        }
      }

      if (qParam.get('to')) {
        this.filter = {
          ...this.filter,
          ...{
            'to.name': qParam.get('to'),
          }
        }
      }

      if (qParam.get('date')) {
        this.filter = {
          ...this.filter,
          ...{
            tripDate: qParam.get('date'),
          }
        }
      }
      if (qParam.get('shift')) {
        this.filter = {
          ...this.filter,
          ...{
            'departureTime.shift': qParam.get('shift')
          }
        }
      }

      this.getAllTicket();
    });


    // Base Data
    this.getAllBus();
  }

  /**
   * CHECK ADMIN PERMISSION
   * onSelectShowPerPage()
   * checkAddPermission()
   * checkEditPermission()
   * checkDeletePermission()
   */
  checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }

  checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  /**
   * UI Essentials
   * onToggle()
   */

  onToggle() {
    this.toggleMenu = !this.toggleMenu;
  }

  /**
   * HTTP REQ HANDLE
   * getAllTicket()
   * deleteMultipleTicketById()
   * deleteMultipleFile()
   */

  private getAllTicket() {
    // Select
    const mSelect = {
      ticketNo: 1,
      date: 1,
      name: 1,
      phoneNo: 1,
      email: 1,
      subTotal: 1,
      serviceCharge: 1,
      grandTotal: 1,
      ticketType: 1,
      paidAmount: 1,
      departureTime: 1,
      arrivalTime: 1,
      from: 1,
      to: 1,
      bookedInfo: 1,
      issuedInfo: 1,
      boardingPoints: 1,
      droppingPoints: 1,
      expiredIn: 1,
      seats: 1,
      canceledSeats: 1,
      bus: 1,

    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.ticketService
      .getAllTicket(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.tickets = res.data;
            this.totalTickets = res.count;
            this.holdPrevData = this.tickets;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }


  private getAllBus() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {name: 1},
    };

    this.subDataOne = this.busService
      .getAllBus(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.buss = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }


  /**
   * FILTER DATA & Sorting
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   * onPageChanged()
   */

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'ticketType': {
        this.filter = {...this.filter, ...{'ticketType': value}};
        this.activeFilter2 = index;
        break;
      }
      case 'bus': {
        this.filter = {...this.filter, ...{'bus.name': value}};
        this.activeFilter1 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllTicket();
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllTicket();
  }

  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.tickets.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.tickets.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.tickets.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }


  /**
   * ON REMOVE ALL QUERY
   * onRemoveAllQuery()
   */

  onRemoveAllQuery() {
    this.activeSort = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.router.navigate([], {queryParams: {page: null, from: null, to: null, date: null, shift: null}}).then()
  }

  /**
   * Ng Styles
   * getTicketTypeStyle()
   */

  getTicketTypeStyle(ticketType: string) {
    if (ticketType === 'Booked') {
      return {color: '#ea7515'}
    } else if (ticketType === 'Sold') {
      return {color: '#018e55'}
    } else if (ticketType === 'Canceled') {
      return {color: '#d83333'}
    } else {
      return {color: '#000000'}
    }
  }


  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    clearInterval(this.myInterval);

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }


}
