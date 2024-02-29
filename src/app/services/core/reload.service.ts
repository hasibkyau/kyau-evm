
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private refreshUser = new Subject<void>();
  private refreshData = new Subject<void>();
  private refreshBrand = new Subject<void>();
  private refreshPopup = new Subject<void>();
  private refreshProduct = new Subject<void>();
  private refreshCategory = new Subject<void>();
  private refreshSubCategory = new Subject<void>();
  private refreshUnit = new Subject<void>();
  private refreshCustomer = new Subject<void>();
  private refreshVendor = new Subject<void>();
  private refresPlay = new Subject<boolean>();

  /**
   * REFRESH GLOBAL
   */
  get refreshBrand$() {
    return this.refreshBrand;
  }
  get refreshPopup$() {
    return this.refreshPopup;
  }
  needRefreshBrand$() {
    this.refreshBrand.next();
  }

  needRefreshPopup$() {
    this.refreshPopup.next();
  }

  get refreshProduct$() {
    return this.refreshProduct;
  }

  needRefreshProduct$() {
    this.refreshProduct.next();
  }

  get refreshCategory$() {
    return this.refreshCategory;
  }

  needRefreshCategory$() {
    this.refreshCategory.next();
  }

  get refreshSubCategory$() {
    return this.refreshSubCategory;
  }

  needRefreshSubCategory$() {
    this.refreshSubCategory.next();
  }

  get refreshUnit$() {
    return this.refreshUnit;
  }

  needRefreshUnit$() {
    this.refreshUnit.next();
  }

  get refreshCustomer$() {
    return this.refreshCustomer;
  }

  needRefreshCustomer$() {
    this.refreshCustomer.next();
  }

  get refreshVendor$() {
    return this.refreshVendor;
  }

  needRefreshVendor$() {
    this.refreshVendor.next();
  }

  /**
   * REFRESH GLOBAL DATA
   */
  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }

  /**
   * REFRESH USEr DATA
   */

  get refreshUser$() {
    return this.refreshUser;
  }
  needRefreshUser$() {
    this.refreshUser.next();
  }

    /**
   * REFRES AUTO PLAY GALLERY SLIDE
   */

    get refreshAutoplay$() {
      return this.refresPlay;
    }
  
    needRefreshAutoPlay$(a: any) {
      this.refresPlay.next(a);
    }
}
