import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../../enum/admin-permission.enum";
import {OrderGuide} from "../../../../interfaces/common/order-guide.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {EMPTY, Subscription} from "rxjs";
import {AdminService} from "../../../../services/admin/admin.service";
import {OrderGuideService} from "../../../../services/common/order-guide.service";
import {UiService} from "../../../../services/core/ui.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../../services/core/reload.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../../interfaces/core/pagination";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-all-order-guide',
  templateUrl: './all-order-guide.component.html',
  styleUrls: ['./all-order-guide.component.scss']
})
export class AllOrderGuideComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  toggleMenu: boolean = false;
  orderGuides: OrderGuide[] = [];
  holdPrevData: OrderGuide[] = [];
  orderGuideCount = 0;
  id?: string;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchOrderGuide: OrderGuide[] = [];

  // Pagination
  currentPage = 1;
  totalOrderGuides = 0;
  OrderGuidesPerPage = 5;
  totalOrderGuidesStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeSort: number;
  number = [{ num: '10' }, { num: '25' }, { num: '50' }, { num: '100' }];


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private orderGuideService: OrderGuideService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllOrderGuide();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllOrderGuide();
    });

    // Base Data
    this.getAdminBaseData();

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
            this.searchOrderGuide = [];
            this.orderGuides = this.holdPrevData;
            this.totalOrderGuides = this.totalOrderGuidesStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.OrderGuidesPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            title: 1,
            amount: 1,
            url: 1,
            image: 1,
            mobileImage: 1,
            createdAt: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: { createdAt: -1 },
          };

          return this.orderGuideService.getAllOrderGuide(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchOrderGuide = res.data;
          this.orderGuides = this.searchOrderGuide;
          this.totalOrderGuides = res.count;
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
   * getAdminBaseData()
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   */

  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions();
  }

  get checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  get checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }


  /**
   * Pagination
   * onPageChanged()
   */


  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }



  /**
   * HTTP REQ HANDLE
   * getAllOrderGuide()
   * deleteOrderGuideById()
   * deleteMultipleOrderGuideById()
   * deleteMultipleFile()
   */

  private getAllOrderGuide() {
    // Select
    const mSelect = {
      name: 1,
      title: 1,
      amount: 1,
      description: 1,
      url: 1,
      image: 1,
      mobileImage: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataOne = this.orderGuideService
      .getAllOrderGuide(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.orderGuides = res.data;
            this.orderGuideCount = res.count;
            this.holdPrevData = this.orderGuides;
            this.totalOrderGuidesStore = this.orderGuideCount;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private deleteMultipleOrderGuideById() {
    this.spinner.show();
    this.subDataTwo = this.orderGuideService
      .deleteMultipleOrderGuideById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedOrderGuide = [];
            this.selectedIds.forEach((id) => {
              const fData = this.orderGuides.find((data) => data._id === id);
              if (fData) {
                selectedOrderGuide.push(fData);
              }
            });

            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } });
            } else {
              this.getAllOrderGuide();
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
    const currentPageIds = this.orderGuides.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.orderGuides.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.orderGuides.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
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
            this.deleteMultipleOrderGuideById();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }


  /**
   * DATA Sorting
   * sortData()
   */



  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllOrderGuide();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = { createdAt: -1 };
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllOrderGuide();
    }
  }


  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
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
