import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {Trip} from 'src/app/interfaces/common/trip.interface';
import {Pagination} from 'src/app/interfaces/core/pagination';
import {FilterData} from 'src/app/interfaces/gallery/filter-data';
import {TripService} from 'src/app/services/common/trip.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {UiService} from 'src/app/services/core/ui.service';
import {UtilsService} from 'src/app/services/core/utils.service';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Bus} from '../../../../interfaces/common/bus.interface';
import {BusService} from '../../../../services/common/bus.service';
import { BusConfigService } from 'src/app/services/common/bus-config.service';

@Component({
  selector: 'app-all-trip',
  templateUrl: './all-trip.component.html',
  styleUrls: ['./all-trip.component.scss']
})
export class AllTripComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  buss: Bus[] = [];
  trips: Trip[] = [];
  id?: string;

  // Pagination
  currentPage = 1;
  totalTrips = 0;
  TripsPerPage = 30;

  // FilterData
  filter: any = null;
  sortQuery: any = {createdAt: -1};
  activeSort: number;
  activeFilter1: number = null;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private tripService: TripService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private busService: BusService,
    private busConfigService: BusConfigService
  ) {
  }

  ngOnInit(): void {
    // Reload
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllTrip();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }

      if (qParam.get('from')) {
        this.filter = {
          ...this.filter,
          ...{
            'from.name': qParam.get('from'),
            status: 'publish'
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

      // if (qParam.get('date')) {
      //   this.filter = {
      //     ...this.filter,
      //     ...{
      //       date: qParam.get('date'),
      //     }
      //   }
      // }
      // if (qParam.get('shift')) {
      //   this.filter = {
      //     ...this.filter,
      //     ...{
      //       'departureTime.shift': qParam.get('shift')
      //     }
      //   }
      // }

      this.getAllTrip();
    });

    // Base Data
    this.getAllBus();
  }

  onTripActivate(event: any, data?:any, id?:string){
    let mData = {
      ...data,
      status: event.target.checked ? 'publish' : 'draft'
    }
    this.updateBusConfigById(mData, id);
  }

  private updateBusConfigById(data: any, id: any) {
    this.subDataThree = this.busConfigService
      .updateBusConfigById(id, data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.success(res.message);
            this.getAllTrip();
          } else {
            this.uiService.warn(res.message);
          }
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
    this.TripsPerPage = val;
    this.getAllTrip();
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
   * HTTP REQ HANDLE
   * getAllBus()
   * getAllTrip()
   * deleteMultipleTripById()
   * deleteMultipleFile()
   */

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

  private getAllTrip() {
    // Select
    const mSelect = {
      bus: 1,
      createdAt: 1,
      date: 1,
      from: 1,
      to: 1,
      price: 1,
      serviceCharge: 1,
      status: 1,
      seats: 1,
      priority: 1,

    };

    const pagination: Pagination = {
      pageSize: this.TripsPerPage,
      currentPage: this.currentPage - 1
    }

    const filter: FilterData = {
      filter: this.filter,
      pagination: pagination,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.busConfigService
      .getAllBusConfig(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {            
            this.trips = res.data;
            this.totalTrips = res.count;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }


  private deleteMultipleTripById() {
    this.spinner.show();
    this.subDataTwo = this.tripService
      .deleteMultipleTripById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedTrip = [];
            this.selectedIds.forEach((id) => {
              const fData = this.trips.find((data) => data._id === id);
              if (fData) {
                selectedTrip.push(fData);
              }
            });
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.getAllTrip();
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
   * sortData()
   * onPageChanged()
   */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllTrip();
  }

  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
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
    const currentPageIds = this.trips.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.trips.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.trips.find((f) => f._id === m).select = false;
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
  public openConfirmDialog(type: string, data?: any) {
    switch (type) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?'
          }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.deleteMultipleTripById();
          }
        });
        break;
      }
      case 'edit': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Edit',
            message: 'Are you sure you want edit this data?'
          }
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            this.updateMultipleTripById(data);
          }
        });
        break;
      }
      default: {
        break;
      }
    }

  }

  private updateMultipleTripById(data: any) {
    this.spinner.show();
    this.subDataThree = this.tripService.updateMultipleTripById(this.selectedIds, data)
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

  /**
   * FILTER DATA & Sorting
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   * onPageChanged()
   */

  filterData(value: any, index: number, type: string) {
    switch (type) {
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
      this.getAllTrip();
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
   * ON DESTROY
   */

  ngOnDestroy() {
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
