import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { defaultUploadImage } from 'src/app/core/utils/app-data';
import { BusGallery } from 'src/app/interfaces/common/bus-gallery.interface';
import { Select } from 'src/app/interfaces/core/select';
import { Gallery } from 'src/app/interfaces/gallery/gallery.interface';
import { BusGalleryService } from 'src/app/services/common/bus-gallery.service';
import { UiService } from 'src/app/services/core/ui.service';
import { FileUploadService } from 'src/app/services/gallery/file-upload.service';
import { AllImagesDialogComponent } from '../../gallery/images/all-images-dialog/all-images-dialog.component';
interface AccessOption {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-add-bus-gallery',
  templateUrl: './add-bus-gallery.component.html',
  styleUrls: ['./add-bus-gallery.component.scss']
})
export class AddBusGalleryComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  isLoading = false;


  HasAccessControl = new FormControl<AccessOption | null>(
    null,
    Validators.required
  );

  hasAccess: Select[] = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' },
  ];


  // Store Data
  id?: string;
  busGallery?: BusGallery;
  autoSlug = true;

  // Image Picker
  pickedImage = defaultUploadImage;
  pickedMobileImage = defaultUploadImage;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private busGalleryService: BusGalleryService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getBusGalleryById();
      }
    });

    // Auto Slug
    this.autoGenerateSlug();
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
      priority: [null],
      url: [null],
      image: [null],
      mobileImage: [null],
      status: ['publish'],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.busGallery);
    if (this.busGallery && this.busGallery.image) {
      this.pickedImage = this.busGallery.image;
    }
    if (this.busGallery && this.busGallery.mobileImage) {
      this.pickedMobileImage = this.busGallery.mobileImage;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (!this.busGallery) {
      this.addBusGallery();
    } else {
      this.updateBusGalleryById();
    }
  }

  /**
   * HTTP REQ HANDLE
   * getBusGalleryById()
   * addBusGallery()
   * updateBusGalleryById()
   */

  private getBusGalleryById() {
    this.spinnerService.show();
    this.subDataOne = this.busGalleryService.getBusGalleryById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.busGallery = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addBusGallery() {
    this.isLoading = true;
    this.subDataTwo = this.busGalleryService
      .addBusGallery(this.dataForm.value)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();
            this.pickedImage = defaultUploadImage;
            this.pickedMobileImage = defaultUploadImage;

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

  private updateBusGalleryById() {
    this.isLoading = true;
    this.subDataThree = this.busGalleryService
      .updateBusGalleryById(this.busGallery._id, this.dataForm.value)
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
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.subAutoSlug = this.dataForm.get('name').valueChanges
        .pipe(
        // debounceTime(200),
        // distinctUntilChanged()
      ).subscribe(d => {
        const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
        this.dataForm.patchValue({
          slug: res
        });
      });
    } else {
      if (!this.subAutoSlug) {
        return;
      }
      this.subAutoSlug?.unsubscribe();
    }
  }


  /**
   * COMPONENT DIALOG
   * openGalleryDialog()
   */

  public openGalleryDialog(type: 'image' | 'mobileImage' | 'bannerImage') {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: { type: 'single', count: 1 },
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
            this.dataForm.patchValue({ mobileImage: image.url });
            this.pickedMobileImage = image.url;
          } else {
            this.dataForm.patchValue({ image: image.url });
            this.pickedImage = image.url;
          }
        }
      }
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
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subAutoSlug) {
      this.subAutoSlug.unsubscribe();
    }
  }

}
