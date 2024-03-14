import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {Bus} from 'src/app/interfaces/common/bus.interface';
import {Pagination} from 'src/app/interfaces/core/pagination';
import {FilterData} from 'src/app/interfaces/gallery/filter-data';
import {BusService} from 'src/app/services/common/bus.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {UiService} from 'src/app/services/core/ui.service';
import {UtilsService} from 'src/app/services/core/utils.service';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-all-bus',
  templateUrl: './all-bus.component.html',
  styleUrls: ['./all-bus.component.scss']
})
export class AllBusComponent implements OnInit {

  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  toggleMenu: boolean = false;
  buss: Bus[] = [];
  holdPrevData: Bus[] = [];
  id?: string;

  // Pagination
  currentPage = 1;
  totalBuss = 0;
  BussPerPage = 30;
  totalBussStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = {name: 1};
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchBus: Bus[] = [];

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
    private busService: BusService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    // Reload
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllBus();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
        this.pageNo = this.currentPage;
      } else {
        this.currentPage = 1;
      }
      this.getAllBus();
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
            this.searchBus = [];
            this.buss = this.holdPrevData;
            this.totalBuss = this.totalBussStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.BussPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            createdAt: 1,
            coachNo: 1,
            coachType: 1,
            company: 1,
            totalSeat: 1,
            status: 1,
            seats: 1,
            priority: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: {name: 1},
            //  sort: {createdAt: -1},
          };

          return this.busService.getAllBus(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchBus = res.data;
          this.buss = this.searchBus;
          this.totalBuss = res.count;
          this.currentPage = 1;
          this.router.navigate([], {queryParams: {page: this.currentPage}});
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
    this.BussPerPage = val;
    this.getAllBus();
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
   * getAllBus()
   * deleteMultipleBusById()
   * deleteMultipleFile()
   */

  private getAllBus() {
    // Select
    const mSelect = {
      name: 1,
      createdAt: 1,
      coachNo: 1,
      coachType: 1,
      company: 1,
      totalSeat: 1,
      status: 1,
      seats: 1,
      priority: 1,

    };

    const pagination: Pagination = {
      pageSize: this.BussPerPage,
      currentPage: this.currentPage - 1
    }

    const filter: FilterData = {
      filter: this.filter,
      pagination: pagination,
      select: mSelect,
      sort: this.sortQuery
    };

    this.subDataOne = this.busService
      .getAllBus(filter, null)
      .subscribe({
        next: (res) => {
          console.log()
          if (res.success) {
            this.buss = res.data;
            this.totalBuss = res.count;
            this.holdPrevData = this.buss;
            this.totalBussStore = this.totalBuss;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }


  private deleteMultipleBusById() {
    this.spinner.show();
    this.subDataTwo = this.busService
      .deleteMultipleBusById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedBus = [];
            this.selectedIds.forEach((id) => {
              const fData = this.buss.find((data) => data._id === id);
              if (fData) {
                selectedBus.push(fData);
              }
            });
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.getAllBus();
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
    this.getAllBus();
  }

  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  onPaginationInputChange() {
    this.router.navigate([], {queryParams: {page: this.pageNo}});
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
    const currentPageIds = this.buss.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.buss.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.buss.find((f) => f._id === m).select = false;
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
            this.deleteMultipleBusById();
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
            this.updateMultipleBusById(data);
          }
        });
        break;
      }
      default: {
        break;
      }
    }

  }

  private updateMultipleBusById(data: any) {
    this.spinner.show();
    this.subDataThree = this.busService.updateMultipleBusById(this.selectedIds, data)
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
   * ON REMOVE ALL QUERY
   * onRemoveAllQuery()
   */

  onRemoveAllQuery() {
    this.activeSort = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllBus();
    }
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
