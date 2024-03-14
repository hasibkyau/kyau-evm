import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {Schedule} from 'src/app/interfaces/common/schedule.interface';
import {Pagination} from 'src/app/interfaces/core/pagination';
import {FilterData} from 'src/app/interfaces/gallery/filter-data';
import {AdminService} from 'src/app/services/admin/admin.service';
import {ScheduleService} from 'src/app/services/common/schedule.service';
import {ReloadService} from 'src/app/services/core/reload.service';
import {UiService} from 'src/app/services/core/ui.service';
import {UtilsService} from 'src/app/services/core/utils.service';
import {FileUploadService} from 'src/app/services/gallery/file-upload.service';
import {ConfirmDialogComponent} from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-all-schedule',
  templateUrl: './all-schedule.component.html',
  styleUrls: ['./all-schedule.component.scss']
})
export class AllScheduleComponent implements OnInit {

// Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

// Store Data
  toggleMenu: boolean = false;
  schedules: Schedule[] = [];
  holdPrevData: Schedule[] = [];
  scheduleCount = 0;
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
  searchSchedule: Schedule[] = [];

// Pagination
  currentPage = 1;
  totalSchedules = 0;
  SchedulesPerPage = 30;
  totalSchedulesStore = 0;

// FilterData
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];


// Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private scheduleService: ScheduleService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllSchedule();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllSchedule();
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
            this.searchSchedule = [];
            this.schedules = this.holdPrevData;
            this.totalSchedules = this.totalSchedulesStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.SchedulesPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            shift: 1,
            createdAt: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.scheduleService.getAllSchedule(filterData, this.searchQuery);
        })
      )
      .subscribe({
        next: (res) => {
          this.searchSchedule = res.data;
          this.schedules = this.searchSchedule;
          this.totalSchedules = res.count;
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
   * UI Essentials & Pagination
   * onToggle()
   * onPageChanged()
   */
  onToggle() {
    this.toggleMenu = !this.toggleMenu;
  }

  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * HTTP REQ HANDLE
   * getAllSchedule()
   * deleteMultipleScheduleById()
   */

  private getAllSchedule() {
    // Select
    const mSelect = {
      name: 1,
      shift: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.scheduleService.getAllSchedule(filter, null).subscribe({
      next: (res) => {
        if (res.success) {
          this.schedules = res.data;
          this.scheduleCount = res.count;
          this.holdPrevData = this.schedules;
          this.totalSchedulesStore = this.scheduleCount;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  private deleteMultipleScheduleById() {
    this.spinner.show();
    this.subDataTwo = this.scheduleService
      .deleteMultipleScheduleById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedSchedule = [];
            this.selectedIds.forEach((id) => {
              const fData = this.schedules.find((data) => data._id === id);
              if (fData) {
                selectedSchedule.push(fData);
              }
            });
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.getAllSchedule();
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
   * onSelectShowPerPage()
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
    const currentPageIds = this.schedules.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.schedules.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.schedules.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  onSelectShowPerPage(val) {
    this.SchedulesPerPage = val;
    this.getAllSchedule();
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
            this.deleteMultipleScheduleById();
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
   * FILTER DATA & Sorting
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   */

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'schedule': {
        this.filter = {...this.filter, ...{'schedule._id': value}};
        this.activeFilter2 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllSchedule();
    }
  }


  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllSchedule();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllSchedule();
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
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }

}
