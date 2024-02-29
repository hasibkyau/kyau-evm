import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../../enum/admin-permission.enum";
import {Generic} from "../../../../interfaces/common/generic.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {EMPTY, Subscription} from "rxjs";
import {AdminService} from "../../../../services/admin/admin.service";
import {GenericService} from "../../../../services/common/generic.service";
import {UiService} from "../../../../services/core/ui.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../../services/core/reload.service";
import {FileUploadService} from "../../../../services/gallery/file-upload.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../../interfaces/core/pagination";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-all-generic',
  templateUrl: './all-generic.component.html',
  styleUrls: ['./all-generic.component.scss']
})
export class AllGenericComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  toggleMenu: boolean = false;
  generics: Generic[] = [];
  holdPrevData: Generic[] = [];
  genericCount = 0;
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
  searchGeneric: Generic[] = [];

  // Pagination
  currentPage = 1;
  totalGenerics = 0;
  GenericsPerPage = 5;
  totalGenericsStore = 0;

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
  private subDataThree: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private genericService: GenericService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {

    // Reload Data
    this.subReload =  this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllGeneric();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllGeneric();
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
            this.searchGeneric = [];
            this.generics = this.holdPrevData;
            this.totalGenerics = this.totalGenericsStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.GenericsPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            image: 1,
            createdAt: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: { createdAt: -1 },
          };

          return this.genericService.getAllGeneric(filterData, this.searchQuery);
        })
      )
      .subscribe({
        next: (res) => {
          this.searchGeneric = res.data;
          this.generics = this.searchGeneric;
          this.totalGenerics = res.count;
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
   * getAllGeneric()
   * deleteMultipleGenericById()
   */

  private getAllGeneric() {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subDataOne = this.genericService.getAllGeneric(filter, null).subscribe({
      next: (res) => {
        if (res.success) {
          this.generics = res.data;
          this.genericCount = res.count;
          this.holdPrevData = this.generics;
          this.totalGenericsStore = this.genericCount;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  private deleteMultipleGenericById() {
    this.spinner.show();
    this.subDataTwo = this.genericService
      .deleteMultipleGenericById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedGeneric = [];
            this.selectedIds.forEach((id) => {
              const fData = this.generics.find((data) => data._id === id);
              if (fData) {
                selectedGeneric.push(fData);
              }
            });
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], { queryParams: { page: 1 } });
            } else {
              this.getAllGeneric();
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
    const currentPageIds = this.generics.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.generics.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.generics.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  onSelectShowPerPage(val) {
    this.GenericsPerPage = val;
    this.getAllGeneric();
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
            this.deleteMultipleGenericById();
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
      case 'generic': {
        this.filter = { ...this.filter, ...{ 'generic._id': value } };
        this.activeFilter2 = index;
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
      this.getAllGeneric();
    }
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );

      const qData = { dateString: { $gte: startDate, $lte: endDate } };
      this.filter = { ...this.filter, ...qData };
      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));

      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllGeneric();
      }
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllGeneric();
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
      this.getAllGeneric();
    }
  }



  /**
   * EXPORTS TO EXCEL
   * exportToAllExcel()
   */

  exportToAllExcel() {
    const date = this.utilsService.getDateString(new Date());

    // Select
    const mSelect = {
      date: 1,
      genericFor: 1,
      name: 1,
      paidAmount: 1,
      dueAmount: 1,
      images: 1,
      createdAt: 1,
    };

    const filterData: FilterData = {
      filter: null,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subDataOne = this.genericService
      .getAllGeneric(filterData, this.searchQuery)
      .subscribe({
        next: (res) => {
          const subscriptionReports = res.data;

          const mData = subscriptionReports.map((m) => {
            return {
              image: m?.image,
              name: m?.name,
              createdAt: this.utilsService.getDateString(m.createdAt),
            };
          });

          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          XLSX.writeFile(wb, `Generic Reports_${date}.xlsx`);
        },
        error: (error) => {
          console.log(error);
        },
      });
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
