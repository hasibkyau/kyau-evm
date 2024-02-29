import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {OrderGuide} from "../../../../interfaces/common/order-guide.interface";
import {defaultUploadImage} from "../../../../core/utils/app-data";
import {Subscription} from "rxjs";
import {UiService} from "../../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderGuideService} from "../../../../services/common/order-guide.service";
import {FileUploadService} from "../../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {AllImagesDialogComponent} from "../../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../../interfaces/gallery/gallery.interface";

@Component({
  selector: 'app-add-order-guide',
  templateUrl: './add-order-guide.component.html',
  styleUrls: ['./add-order-guide.component.scss']
})
export class AddOrderGuideComponent implements OnInit {

  // Ngx Quill
  modules: any = null;
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  isLoading = false;

  // Store Data
  id?: string;
  orderGuide?: OrderGuide;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;



  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private orderGuideService: OrderGuideService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getOrderGuideById();
      }
    });
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null],
      image: [null],
      mobileImage: [null],
      description: [null],
      title: [null],
      url: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.orderGuide);
    if (this.orderGuide && this.orderGuide.image) {

      this.pickedImage = this.orderGuide.image;

    }
    if (this.orderGuide && this.orderGuide.mobileImage) {
      this.pickedMobileImage = this.orderGuide.mobileImage;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    if (!this.orderGuide) {
      this.addOrderGuide();
    } else {
      this.updateOrderGuideById();
    }

  }

  /**
   * HTTP REQ HANDLE
   * getOrderGuideById()
   * addOrderGuide()
   * updateOrderGuideById()
   */

  private getOrderGuideById() {
    this.spinnerService.show();
    this.subDataOne = this.orderGuideService.getOrderGuideById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.orderGuide = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addOrderGuide() {
    this.isLoading = true;
    this.subDataTwo = this.orderGuideService
      .addOrderGuide(this.dataForm.value)
      .subscribe({
        next: (res) => {
         this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();


          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }

  private updateOrderGuideById() {
    this.isLoading = true;
    this.subDataThree = this.orderGuideService
      .updateOrderGuideById(this.orderGuide._id, this.dataForm.value)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);

          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }



  /**
   * COMPONENT DIALOG
   * openGalleryDialog()
   */

  public openGalleryDialog(type: 'image' | 'mobileImage') {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'single', count: 1},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          const image: Gallery = dialogResult.data[0] as Gallery;
          if (type === 'mobileImage') {
            this.dataForm.patchValue({mobileImage: image.url});
            this.pickedMobileImage = image.url;
          } else {
            this.dataForm.patchValue({image: image.url});
            this.pickedImage = image.url;
          }
        }
      }
    });
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
  }

}
