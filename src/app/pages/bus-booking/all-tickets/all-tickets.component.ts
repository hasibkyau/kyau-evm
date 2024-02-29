import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, pluck, debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { AdminPermissions } from 'src/app/enum/admin-permission.enum';
import { Ticket } from 'src/app/interfaces/common/ticket.interface';
import { Pagination } from 'src/app/interfaces/core/pagination';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { TicketService } from 'src/app/services/common/ticket.service';
import { ReloadService } from 'src/app/services/core/reload.service';
import { UiService } from 'src/app/services/core/ui.service';
import { UtilsService } from 'src/app/services/core/utils.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Bus} from '../../../interfaces/common/bus.interface';
import {BusService} from '../../../services/common/bus.service';
import {TripService} from '../../../services/common/trip.service';
import {Select} from '../../../interfaces/core/select';
import {TICKET_TYPES} from '../../../core/utils/app-data';


@Component({
  selector: 'app-all-tickets',
  templateUrl: './all-tickets.component.html',
  styleUrls: ['./all-tickets.component.scss'],
})
export class AllTicketsComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  ticketTypes: Select[] = TICKET_TYPES;
  toggleMenu: boolean = false;
  tickets: Ticket[] = [];
  holdPrevData: Ticket[] = [];
  id?: string;
  buss: Bus[] = [];

  // Pagination
  currentPage = 1;
  totalTickets = 0;
  TicketsPerPage = 30;
  totalTicketsStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = { createdAt: -1 };
  activeSort: number;
  activeFilter1: number = null;
  activeFilter2: number = null;

  myInterval:any;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchTicket: Ticket[] = [];

  // Pagination Input
  pageNo: number = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private ticketService: TicketService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private busService: BusService,
    private tripService: TripService,
  ) {
  }

  ngOnInit(): void {
    // Reload
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllTicket();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
        this.pageNo = this.currentPage;
      } else {
        this.currentPage = 1;
      }

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

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data;
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.searchTicket = [];
            this.tickets = this.holdPrevData;
            this.totalTickets = this.totalTicketsStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.TicketsPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

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

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: { createdAt: -1 },
          };

          return this.ticketService.getAllTicket(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchTicket = res.data;
          this.tickets = this.searchTicket;
          this.totalTickets = res.count;
          this.currentPage = 1;
          this.router.navigate([], { queryParams: { page: this.currentPage } });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * CHECK ADMIN PERMISSION
   * onSelectShowPerPage()
   * checkAddPermission()
   * checkEditPermission()
   * checkDeletePermission()
   */
  onSelectShowPerPage(val) {
    this.TicketsPerPage = val;
    this.getAllTicket();
  }

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

    const pagination: Pagination = {
      pageSize: this.TicketsPerPage,
      currentPage: this.currentPage - 1
    }

    const filter: FilterData = {
      filter: this.filter,
      pagination: pagination,
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
            this.totalTicketsStore = this.totalTickets
            this.onExpireTimeCount();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onExpireTimeCount() {
    this.myInterval = setInterval(() => {
      this.tickets = this.tickets?.map(m=>{
        let time = this.utilsService.getexpiredTime(m.expiredIn, "DD:HH:MM:SS");
        return{
          ...m,
          ...{
            expireTime: time
          }
        }
      })
    }, 1000);
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


  private deleteMultipleTicketById() {
    this.spinner.show();
    this.subDataTwo = this.ticketService
      .deleteMultipleTicketById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedTicket = [];
            this.selectedIds.forEach((id) => {
              const fData = this.tickets.find((data) => data._id === id);
              if (fData) {
                selectedTicket.push(fData);
              }
            });
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } });
            } else {
              this.getAllTicket();
            }
          } else {
            this.uiService.warn(res.message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
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
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}, queryParamsHandling: 'merge'}).then();
    } else {
      this.getAllTicket();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllTicket();
  }

  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } });
  }
  onPaginationInputChange() {
    this.router.navigate([], { queryParams: { page: this.pageNo } });
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
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(type: 'canceled', data?: any) {
    switch (type) {
      case 'canceled': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Cancel',
            message: 'Are you sure you want cancel this ticket?'
          }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            const finalData = {
              seats: [],
              oldSeats: [],
              canceledSeats: data.seats,
            }
            this.updateBookedTrip(data._id, finalData);
          }
        });
        break;
      }
      default: {
        break;
      }
    }

  }

  private updateMultipleTicketById(data: any) {
    this.spinner.show();
    this.subDataThree = this.ticketService.updateMultipleTicketById(this.selectedIds, data)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
          this.selectedIds = [];
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message)
        }
      }, error => {
        this.spinner.hide()
        console.log(error);
      });

  }

  private updateBookedTrip(ticketId: string, data: any) {
    this.subDataThree = this.tripService.updateBookedTrip(ticketId, data)
      .subscribe({
        next: res => {
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
          this.reloadService.needRefreshData$();
        },
        error: err => {
          console.log(err)
        }
      })
  }


  /**
   * ON REMOVE ALL QUERY
   * onRemoveAllQuery()
   */

  onRemoveAllQuery() {
    this.activeSort = null;
    this.sortQuery = { createdAt: -1 };
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
    }else {
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
