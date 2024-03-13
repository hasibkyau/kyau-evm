import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, pluck, debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { AdminPermissions } from 'src/app/enum/admin-permission.enum';
import { Routes } from 'src/app/interfaces/common/route.interface';
import { Pagination } from 'src/app/interfaces/core/pagination';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { AdminService } from 'src/app/services/admin/admin.service';
import { RouteService } from 'src/app/services/common/route.service';
import { ReloadService } from 'src/app/services/core/reload.service';
import { UiService } from 'src/app/services/core/ui.service';
import { UtilsService } from 'src/app/services/core/utils.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-all-route',
  templateUrl: './all-route.component.html',
  styleUrls: ['./all-route.component.scss']
})
export class AllRouteComponent implements OnInit {

// Admin Base Data
adminId: string;
role: string;
permissions: AdminPermissions[];

// Store Data
toggleMenu: boolean = false;
routes: Routes[] = [];
holdPrevData: Routes[] = [];
routeCount = 0;
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
searchRoute: Routes[] = [];

// Pagination
currentPage = 1;
totalRoutes = 0;
RoutesPerPage = 5;
totalRoutesStore = 0;

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
private subDataThree: Subscription;
private subForm: Subscription;
private subRouteOne: Subscription;
private subReload: Subscription;

constructor(
  private adminService: AdminService,
  private routeService: RouteService,
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
  // Reload Data
  this.subReload = this.reloadService.refreshData$.subscribe(() => {
    this.getAllRoute();
  });

  // GET PAGE FROM QUERY PARAM
  this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
    if (qParam && qParam.get('page')) {
      this.currentPage = Number(qParam.get('page'));
    } else {
      this.currentPage = 1;
    }
    this.getAllRoute();
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
          this.searchRoute = [];
          this.routes = this.holdPrevData;
          this.totalRoutes = this.totalRoutesStore;
          this.searchQuery = null;
          return EMPTY;
        }
        const pagination: Pagination = {
          pageSize: Number(this.RoutesPerPage),
          currentPage: Number(this.currentPage) - 1,
        };

        // Select
        const mSelect = {
          from: 1,
          to: 1,
          createdAt: 1,
          priority: 1,
          viaRoutes: 1,
          status: 1,
        };

        const filterData: FilterData = {
          pagination: pagination,
          filter: this.filter,
          select: mSelect,
          sort: {'from.name': 1},
          // sort: {createdAt: -1},
        };

        return this.routeService.getAllRoute(
          filterData,
          this.searchQuery
        );
      })
    )
    .subscribe({
      next: (res) => {        
        this.searchRoute = res.data;
        this.routes = this.searchRoute;
        this.totalRoutes = res.count;
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
 * getAllRoute()
 * deleteMultipleRouteById()
 */

private getAllRoute() {
  // Select
  const mSelect = {
    from: 1,
    to: 1,
    viaRoutes: 1,
    createdAt: 1,
    priority: 1,
    status: 1,
  };

  const filter: FilterData = {
    filter: this.filter,
    pagination: null,
    select: mSelect,
    sort: {'from.name': 1},
    // sort: {createdAt: -1},
  };

  this.subDataOne = this.routeService
    .getAllRoute(filter, null)
    .subscribe({
      next: (res) => {
        if (res.success) {
          this.routes = res.data;
          this.routeCount = res.count;
          this.holdPrevData = this.routes;
          this.totalRoutesStore = this.routeCount;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
}

private deleteMultipleRouteById() {
  this.spinner.show();
  this.subDataTwo = this.routeService
    .deleteMultipleRouteById(this.selectedIds)
    .subscribe(
      (res) => {
        this.spinner.hide();
        if (res.success) {
          // Get Data array
          const selectedRoute = [];
          this.selectedIds.forEach((id) => {
            const fData = this.routes.find((data) => data._id === id);
            if (fData) {
              selectedRoute.push(fData);
            }
          });

          this.selectedIds = [];
          this.uiService.success(res.message);
          // fetch Data
          if (this.currentPage > 1) {
            this.router.navigate([], {queryParams: {page: 1}});
          } else {
            this.getAllRoute();
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

private updateMultipleRouteById(data: any) {
  this.spinner.show();
  this.subDataThree = this.routeService.updateMultipleRouteById(this.selectedIds, data)
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
  const currentPageIds = this.routes.map((m) => m._id);
  if (event.checked) {
    this.selectedIds = this.utilsService.mergeArrayString(
      this.selectedIds,
      currentPageIds
    );
    this.routes.forEach((m) => {
      m.select = true;
    });
  } else {
    currentPageIds.forEach((m) => {
      this.routes.find((f) => f._id === m).select = false;
      const i = this.selectedIds.findIndex((f) => f === m);
      this.selectedIds.splice(i, 1);
    });
  }
}


onSelectShowPerPage(val) {
  this.RoutesPerPage = val;
  this.getAllRoute();
}

/**
 * COMPONENT DIALOG VIEW
 * openConfirmDialog()
 */
public openConfirmDialog(type: string, data?: any) {
  switch (type) {
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
          this.updateMultipleRouteById(data);
        }
      });
      break;
    }
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
          this.deleteMultipleRouteById();
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
 * onRemoveAllQuery()
 */

filterData(value: any, index: number, type: string) {
  switch (type) {
    case 'route': {
      this.filter = {...this.filter, ...{'route._id': value}};
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
    this.getAllRoute();
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

    const qData = {dateString: {$gte: startDate, $lte: endDate}};
    this.filter = {...this.filter, ...qData};
    // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));

    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllRoute();
    }
  }
}

sortData(query: any, type: number) {
  this.sortQuery = query;
  this.activeSort = type;
  this.getAllRoute();
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
    this.getAllRoute();
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
  if (this.subDataThree) {
    this.subDataThree.unsubscribe();
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
