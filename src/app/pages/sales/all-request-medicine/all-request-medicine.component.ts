import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { EMPTY, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { UpdateOrderStatusComponent } from '../update-order-status/update-order-status.component';
import * as XLSX from 'xlsx';
import { AdminPermissions } from '../../../enum/admin-permission.enum';
import { Order } from '../../../interfaces/common/order.interface';
import { AdminService } from '../../../services/admin/admin.service';
import {
  CITIES, MONTHS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_TYPES, REPORT_FILTER, YEARS,
} from '../../../core/utils/app-data';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgClassService } from '../../../services/core/ng-class.service';
import { UiService } from '../../../services/core/ui.service';
import { Pagination } from '../../../interfaces/core/pagination';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { Select } from '../../../interfaces/core/select';
import { UtilsService } from '../../../services/core/utils.service';
import { OrderService } from '../../../services/common/order.service';
import { ReloadService } from '../../../services/core/reload.service';
import { FilterData } from '../../../interfaces/core/filter-data';
import {Admin} from "../../../interfaces/admin/admin";
import {Courier} from "../../../interfaces/common/courier.interface";
import { RequestMedicineService } from 'src/app/services/common/request-medicine.service';
import { RequestMedicine } from 'src/app/interfaces/common/request-medicine';

@Component({
  selector: 'app-all-request-medicine',
  templateUrl: './all-request-medicine.component.html',
  styleUrls: ['./all-request-medicine.component.scss']
})
export class AllRequestMedicineComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  admin?: Admin;
  years: Select[] = YEARS;
  months: Select[] = MONTHS;
  calculation: any = null;
  showCalculation: boolean = false;
  couriers: Courier[] = [];
  requestMedicines: RequestMedicine[] = [];
  holdPrevData: RequestMedicine[] = [];
  toggleMenu: boolean = false;
  showPerPageList = [
    { num: '25' },
    { num: '50' },
    { num: '100' },
    { num: '500' },
    { num: '1000' },
  ];

  // Pagination
  currentPage = 1;
  totalRequestMedicines = 0;
  requestMedicinesPerPage = 30;
  totalRequestMedicinesStore = 0;

  // SEARCH AREA
  searchRequestMedicines: RequestMedicine[] = [];
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // FilterData
  cities: string[] = CITIES;
  paymentTypes: Select[] = PAYMENT_TYPES;
  paymentStatus: Select[] = PAYMENT_STATUS;
  orderStatus: Select[] = ORDER_STATUS;
  dateByReport: Select[] = REPORT_FILTER;

  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  dataFormDeliveryRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Sort
  sortQuery = { createdAt: -1 };
  activeSort: number = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter3: number = null;
  activeFilter4: number = null;
  activeFilter5: number = null;
  activeFilter6: number = null;
  activeFilter7: number = null;
  activeFilter8: number = null;

  // FilterData
  filter: any = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subDataEight: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subForm: Subscription;

  constructor(
    private dialog: MatDialog,
    private requestMedicineService: RequestMedicineService,
    private adminService: AdminService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public ngClassService: NgClassService
  ) {}

  ngOnInit(): void {
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllRequestMedicines();
    });

    // Base Admin Data
    this.getAdminBaseData();

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParams.subscribe((qParam) => {
      if (qParam && qParam['page']) {
        this.currentPage = qParam['page'];
      } else {
        this.currentPage = 1;
      }
      this.getAllRequestMedicines();
    });
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
            this.searchRequestMedicines = [];
            this.requestMedicines = this.holdPrevData;
            this.totalRequestMedicines = this.totalRequestMedicinesStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.requestMedicinesPerPage),
            currentPage: Number(this.currentPage) - 1,
          };
          // Select
          const mSelect = {
            name: 1,
            orderId: 1,
            phoneNo: 1,
            city: 1,
            paymentType: 1,
            grandTotal: 1,
            checkoutDate: 1,
            orderStatus: 1,
            paymentStatus: 1,
            createdAt: 1,
            deliveryDate: 1,
            preferredDate: 1,
            preferredTime: 1,
            preferredDateString: 1,
            division:1,
            area:1,
            zone:1
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: this.sortQuery,
          };
          return this.requestMedicineService.getAllRequestMedicines(filterData, this.searchQuery);
        })
      )
      .subscribe(
        (res) => {
          this.searchRequestMedicines = res.data;
          this.requestMedicines = this.searchRequestMedicines;
          this.totalRequestMedicines = res.count;
          this.currentPage = 1;
          this.router.navigate([], { queryParams: { page: this.currentPage } });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * CHECK ADMIN PERMISSION
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   * getAdminBaseData()
   */
  get checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  get checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }
  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions();
  }

  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   * checkSelectionData()
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
    const currentPageIds = this.requestMedicines.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.requestMedicines.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.requestMedicines.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }
  private checkSelectionData() {
    let isAllSelect = true;
    this.requestMedicines.forEach((m) => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } });
  }

  /**
   * FILTER DATA With Date Range
   * endChangeRegDateRange()
   * endChangeDeliveryDateRange()
   */

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getNextDateString(
        this.dataFormDateRange.value.end,
        1
      );

      const qData = { checkoutDate: { $gte: startDate, $lte: endDate } };
      this.filter = { ...this.filter, ...qData };


      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllRequestMedicines();
      }
    }
  }

  endChangeDeliveryDateRange(event: MatDatepickerInputEvent<any>) {

    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDeliveryRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDeliveryRange.value.end
      );

      const qData = { preferredDateString: { $gte: startDate, $lte: endDate } };

      this.filter = { ...this.filter, ...qData };


      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllRequestMedicines();
      }
    }
  }

  onChangeShowCalculation(event: any) {
    this.showCalculation = event;
    localStorage.setItem('showCalculation', String(this.showCalculation));
  }
  /**
   * SORTING
   */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllRequestMedicines();
  }

  /**
   * FILTERING
   */
  filterData(value: string, index: number, type: string) {
    switch (type) {
      case 'paymentStatus': {
        this.filter = { ...this.filter, ...{ paymentStatus: value } };
        this.activeFilter1 = index;
        break;
      }
      case 'paymentType': {
        this.filter = { ...this.filter, ...{ paymentType: value } };
        this.activeFilter2 = index;
        break;
      }
      case 'orderStatus': {
        this.filter = { ...this.filter, ...{ orderStatus: value } };
        this.activeFilter3 = index;
        break;
      }
      case 'city': {
        this.filter = { ...this.filter, ...{ 'division.name': value.toLowerCase() } };
        this.activeFilter4 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data

    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllRequestMedicines();
    }
  }

  /**
   * ON REMOVE ALL QUERY
   */

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.activeFilter3 = null;
    this.activeFilter4 = null;
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllRequestMedicines();
    }
  }

  /**
   * HTTP REQ HANDLE
   * getAllRequestMedicines()
   * deleteMultipleOrderById()
   * changeOrderStatus()
   */

  private getAllRequestMedicines() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.requestMedicinesPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    // FilterData
    // const mQuery = this.filter.length > 0 ? {$and: this.filter} : null;

    // Select
    const mSelect = {
      name: 1,
      orderId: 1,
      phoneNo: 1,
      city: 1,
      paymentType: 1,
      grandTotal: 1,
      checkoutDate: 1,
      orderStatus: 1,
      paymentStatus: 1,
      createdAt: 1,
      deliveryDate: 1,
      preferredDate: 1,
      preferredTime: 1,
      division:1,
      area:1,
      zone:1,
      orderNotes:1,
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: this.filter,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.requestMedicineService
      .getAllRequestMedicines(filterData, this.searchQuery)
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.requestMedicines = res.data;

          if (this.requestMedicines && this.requestMedicines.length) {
            this.requestMedicines.forEach((m, i) => {
              const index = this.selectedIds.findIndex((f) => f === m._id);
              this.requestMedicines[i].select = index !== -1;
            });

            this.totalRequestMedicines = res.count;
            if (!this.searchQuery) {
              this.holdPrevData = res.data;
              this.totalRequestMedicinesStore = res.count;
            }

            this.checkSelectionData();
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }


  private deleteMultipleOrderById() {
    this.spinner.show();
    this.subDataFour = this.requestMedicineService
      .deleteMultipleRequestMedicineById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } });
            } else {
              this.getAllRequestMedicines();
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

  private changeOrderStatus(id: string, data: any) {
    this.spinner.show();
    this.subDataThree = this.requestMedicineService.changeRequestMedicineStatus(id, data).subscribe(
      (res) => {
        this.spinner.hide();
        if (res.success) {
          this.selectedIds = [];
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
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

  private changeOrderMultiStatus(id: string, data: any) {
    this.spinner.show();
    this.subDataThree = this.requestMedicineService.updateMultipleRequestMedicineById(this.selectedIds, data)
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
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openUpdateOrderStatusDialog()
   */
  public openConfirmDialog(type: string) {
    switch (type) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.deleteMultipleOrderById();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  public openUpdateOrderStatusDialog(order: Order) {
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      width: '95%',
      maxWidth: '480px',
      data: order,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (dialogResult.data) {
          this.changeOrderStatus(order._id, dialogResult.data);
        }
      }
    });
  }


  // open  Update Multi Order Status Dialogs

  public openUpdateOrderStatusDialogs(order: Order) {
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      width: '95%',
      maxWidth: '480px',
      data:  {order: order, orderStatus: this.orderStatus}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data) {
          this.changeOrderMultiStatus(order?._id, dialogResult.data);
        }
      }
    });

  }

  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */
  exportToExcel() {
    this.spinner.show();
    // Select
    const mSelect = {
      name: 1,
      email: 1,
      orderId: 1,
      phoneNo: 1,
      city: 1,
      grandTotal: 1,
      checkoutDate: 1,
      orderStatus: 1,
      paymentStatus: 1,
      paymentType: 1,
      createdAt: 1,
      shippingAddress: 1,
      deliveryDate: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: this.filter,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.requestMedicineService
      .getAllRequestMedicines(filterData, this.searchQuery)
      .subscribe(
        (res) => {

          this.spinner.hide();
          const subscriptionReports = res.data;
          const date = this.utilsService.getDateString(new Date());
          const mData = subscriptionReports.map((m) => {
            return {
              orderId: m.orderId,
              phoneNo: m.phoneNo,
              name: m.name,
              email: m.email ? m.email : 'n/a',
              orderAt: m.checkoutDate,
              city: m.city,
              shippingAddress: m.shippingAddress,
              createdAt: this.utilsService.getDateString(m.createdAt),
            };
          });


          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          XLSX.writeFile(wb, `Products_Reports_${date}.xlsx`);
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  /**
   *onSelectShowPerPage()
   */

  onSelectShowPerPage(val) {
    this.requestMedicinesPerPage = val;
    this.getAllRequestMedicines();
  }

  /**
   * UI Essentials
   * onToggle()
   */
  onToggle() {
    console.log('Click');
    this.toggleMenu = !this.toggleMenu;
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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }
    if (this.subDataEight) {
      this.subDataEight.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }
}
