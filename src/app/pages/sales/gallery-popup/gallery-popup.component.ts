import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReloadService } from 'src/app/services/core/reload.service';

@Component({
  selector: 'app-gallery-popup',
  templateUrl: './gallery-popup.component.html',
  styleUrls: ['./gallery-popup.component.scss']
})
export class GalleryPopupComponent implements OnInit {

  @ViewChild('fullScreen') elem!: ElementRef;
  @Input() galleryData!: any[];
  indexNo = 0;
  onShow = false;
  onAutoPlay = false;
  interval: any;
  constructor(
    private reloadService: ReloadService
  ) {

  }
  ngOnInit(): void {
    this.reloadService.refreshAutoplay$.subscribe((res) => {
      if (res === true) {
        this.onAutoPlayControl();
      } else {
        clearInterval(this.interval);
      }
    })

  }


  //ALL GALLERY METHOD 
  /**
   * onShowGallery();
   * onHideGallery();
   * selectGalleryImg();
   * nextSlide();
   * prevSlide();
   * slideControl();
   * onAutoPlayControl();
   */
  onShowGallery(index: any) {
    this.onShow = true;
    this.indexNo = index;

  }
  onHideGallery() {
    this.onShow = false;
  }

  selectGalleryImg(gIndex: any) {
    this.indexNo = gIndex;
  }

  nextSlide() {
    this.indexNo = this.indexNo + 1;
    this.slideControl(this.indexNo);
  }
  prevSlide() {
    this.indexNo = this.indexNo - 1;
    this.slideControl(this.indexNo);
  }

  slideControl(n: any) {
    if (n > this.galleryData.length - 1) {
      this.indexNo = 0;
    }
    if (n < 0) {
      this.indexNo = this.galleryData.length - 1;
    }
    console.log(this.indexNo);
  }

  onAutoPlayToggle() {
    this.onAutoPlay = !this.onAutoPlay;
    this.reloadService.needRefreshAutoPlay$(this.onAutoPlay);
  }

  onFullScreen() {
    if (this.elem.nativeElement.requestFullscreen) {
      this.elem.nativeElement.requestFullscreen();
    } else if (this.elem.nativeElement.webkitRequestFullscreen) { /* Safari */
      this.elem.nativeElement.webkitRequestFullscreen();
    } else if (this.elem.nativeElement.msRequestFullscreen) { /* IE11 */
      this.elem.nativeElement.msRequestFullscreen();
    }
  }


  onAutoPlayControl() {
    let lastIndex = 0;
    if (this.onAutoPlay === true) {
      this.interval = setInterval(() => {
        lastIndex = this.indexNo;
        this.indexNo = this.indexNo + 1;
        if (this.indexNo == this.galleryData.length) {
          this.indexNo = 0;
        }
      }, 3000);
    } else {
      this.indexNo = lastIndex;
    }
  }

}
