import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/common/user.interface';
import { UserDataService } from 'src/app/services/common/user-data.service';
import { RequestMedicineService } from 'src/app/services/common/request-medicine.service';
import { RequestMedicine } from 'src/app/interfaces/common/request-medicine';
import { GalleryPopupComponent } from '../gallery-popup/gallery-popup.component';


@Component({
  selector: 'app-request-medicine-details',
  templateUrl: './request-medicine-details.component.html',
  styleUrls: ['./request-medicine-details.component.scss']
})
export class RequestMedicineDetailsComponent  implements OnInit {
  @ViewChild('galleryPop', { static: false }) galleryPop!: GalleryPopupComponent;


  // Store Data
  id?: string;
  order?: RequestMedicine;
  user?: User;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subRouteOne: Subscription;




  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: RequestMedicineService,
    private spinnerService: NgxSpinnerService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderById();
      }
    });
  }







  /**
   * HTTP REQ HANDLE
   *  getOrderById()
   *  getUserById()
   * addOrder()
   * updateOrderById()
   * resetValue()
   */

  private getOrderById() {
    this.spinnerService.show();
    this.subDataTwo = this.orderService.getRequestMedicineById(this.id).subscribe(
      (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.order = res.data;
          if (this.order.user) {
            this.getUserById(this.order.user);
          }
        }
      },
      (error) => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }

  private getUserById(id) {
    this.subDataOne = this.userDataService.getUserById(id).subscribe(
      (res) => {
        this.user = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onShowPop(index: any) {
    if (index > -1) {
      this.galleryPop.onShowGallery(index);
    }
  }


  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }


    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }

}
