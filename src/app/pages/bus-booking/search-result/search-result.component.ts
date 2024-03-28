import {Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild,} from '@angular/core';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UiService} from 'src/app/services/core/ui.service';
import {Trip} from 'src/app/interfaces/common/trip.interface';
import {Seat} from '../../../interfaces/common/bus.interface';
import {Cart} from '../../../interfaces/common/cart.interface';
import {AdminService} from '../../../services/admin/admin.service';
import {CartService} from '../../../services/common/cart.service';
import {ReloadService} from '../../../services/core/reload.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {TripService} from '../../../services/common/trip.service';
import {UtilsService} from '../../../services/core/utils.service';
import {BOOKING_TIME} from '../../../core/utils/app-data';
import {Select} from '../../../interfaces/core/select';
import {Subscription} from 'rxjs';
import {Ticket} from '../../../interfaces/common/ticket.interface';
import {BusConfigService} from 'src/app/services/common/bus-config.service';
import {Price} from 'src/app/interfaces/common/bus-config.interface';
import {PricePipe} from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [PricePipe]
})
export class SearchResultComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('confirm') confirm!: ConfirmDialogComponent;

  id: string;
  @Input() trip: Trip;
  @Input() ticket: Ticket;
  @Input() mode: 'edit' | 'add';
  @Input() date: string;

  userInfo: any = null;

  userRole : any;

  selectedTrip: Trip = null;
  selectedTripFloors: string[] = [];
  prices: Price[] = [];
  price: number = 0;
  availableSeats: number = 0;

  windowWidth = window.innerWidth;
  dataForm: FormGroup;
  selectedGender = 'Male';
  isLoading: boolean = false;
  floorSelected: string = null;

  bookingTimes: Select[] = BOOKING_TIME;

  seatAnimation = false;
  selectedSeat: Seat;

  //ERROR VARIABLES
  isBoardingError = false;
  isDroppingError = false;

  carts: Cart[] = [];
  selectedSeats: Seat[] = [];
  canceledSeats: Seat[] = [];

  // Selected Boarding & Drooping Point
  selectBoardingPoints: any;
  selectDroppingPoints: any;

  // Subscriptions
  private subReload: Subscription;
  private subRoute: Subscription;
  private subRouteTwo: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private adminService: AdminService,
    private cartService: CartService,
    private tripService: TripService,
    private reloadService: ReloadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private pricePipe: PricePipe,
    private busConfigService: BusConfigService,
  ) {
  }

  ngOnInit(): void {
    this.userRole = this.adminService.getAdminRole();
    // console.log('user_role', this.userRole);
    let id = this.adminService.getAdminId();
    this.getAdminById(id);
    
    this.trip?.seats?.map(m => {
      if (m?.status === 'Available') {
        this.availableSeats += 1;
      }
    })

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      // this.getCartByTrip();
      this.getTripById();
    });

    // Init Form
    this.initDataForm();

    // Query Param
    this.subRoute = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      this.id = qParam.get('trip');
      if (this.id) {
        this.getTripById();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.getCartByTrip()
    if (this.mode && this.mode === 'edit' && this.ticket) {
      this.selectedSeats = this.ticket?.seats;
      this.dataForm.patchValue({
        phoneNo: this.ticket?.phoneNo,
        email: this.ticket?.email,
        name: this.ticket?.name,
        gender: this.ticket?.gender,
        paidAmount: this.ticket?.paidAmount,
        bookingTime: this.ticket?.bookingTime,
        ticketType: this.ticket?.ticketType,
      });
      this.selectBoardingPoints = this.ticket?.boardingPoints;
      this.selectDroppingPoints = this.ticket?.droppingPoints;
    }
  }

  @HostListener('window:resize')
  getWidth() {
    this.windowWidth = window.innerWidth;
  }

  /**
   * FORM INITIALIZE
   * initDataForm()
   * onSubmit()
   */

  initDataForm() {
    this.dataForm = this.fb.group({
      phoneNo: [null, Validators.required],
      email: [null, Validators.email],
      name: [null, Validators.required],
      gender: ['Male'],
      ticketType: ['Booked', Validators.required],
      paidAmount: [0, Validators.required],
      bookingTime: [null],
    });
  }

  onToggleFloor(floor: string) {
    this.floorSelected = floor;
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      this.uiService.wrong('Please complete all the required field');
      return;
    }
    // if (!this.selectBoardingPoints) {
    //   this.isBoardingError = true;
    //   this.uiService.wrong('Please Select Your Boarding Points');
    //   return;
    // }
    // if (!this.selectDroppingPoints) {
    //   this.isDroppingError = true;
    //   this.uiService.wrong('Please Select Your Dropping Counter');
    //   return;
    // }

    if (!this.selectedSeats.length && this.mode !== 'edit') {
      this.uiService.wrong('Sorry! No seat selected');
      return;
    }

    this.isLoading = true;
    const mData = {
      trip: this.trip._id,
      tripDate: this.trip.date,
      date: this.utilsService.getDateString(new Date()),
      time: this.utilsService.getTimeString(new Date()),
      name: this.dataForm.value.name,
      phoneNo: this.dataForm.value.phoneNo,
      email: this.dataForm.value.email,
      gender: this.dataForm.value.gender,
      subTotal: this.totalAmount,
      discount: 0,
      serviceCharge: this.serviceCharge,
      paidAmount: this.dataForm.value.paidAmount ?? 0,
      grandTotal: this.grandTotal,
      ticketType: this.dataForm.value.ticketType,
      bookingTime:
        this.dataForm.value.ticketType === 'Booked'
          ? this.dataForm.value.bookingTime
            ? Number(this.dataForm.value.bookingTime)
            : null
          : null,
      expiredIn: null,
      bus: {
        _id: this.trip.bus._id,
        name: this.trip.bus.name,
        coachType: this.trip.bus.coachType,
        totalSeat: this.trip.bus.totalSeat,
        company: this.trip.bus.company,
      },
      departureTime: this.trip?.departureTime,
      arrivalTime: this.trip?.arrivalTime,
      from: this.trip?.from,
      to: this.trip?.to,
      boardingPoints: this.selectBoardingPoints,
      droppingPoints: this.selectDroppingPoints,
      seats: this.selectedSeats.map((m) => {
        return {
          ...m,
          ...{
            gender: this.dataForm.value.gender,
            status: this.dataForm.value.ticketType,
          },
        };
      }),
      user: null,
      bookedInfo: {
        _id: this.userInfo?._id,
        name: this.userInfo?.name,
        role: this.userInfo?.role === 'admin' ? 'Super Counter' :
        this.userInfo?.role === 'editor' ? 'Counter' : this.userInfo?.role,
        applicationChannel: 'admin',
      },
    };

    if (this.mode === 'edit') {
      const finalData = {
        ...mData,
        ...{
          seats: this.selectedSeats.filter((f) => f.type === 'new'),
          oldSeats: this.selectedSeats.filter((f) => f.type !== 'new'),
          canceledSeats: this.canceledSeats,
          user: this.ticket.user
        },
      };
      this.updateBookedTrip(finalData);
    } else {
      this.bookTrip(mData);
    }
  }

  /**
   * SHOW TICKET DETAILS
   * onShow()
   * onShowMobile()
   */
  onShow(event: MouseEvent | any) {
    event.stopImmediatePropagation();
    // this.isShow = !this.isShow;
    if (!this.id) {
      this.router
        .navigate([], {
          queryParams: {trip: this.trip._id},
          queryParamsHandling: 'merge',
        })
        .then();
    } else {
      if (this.trip._id === this.selectedTrip._id) {
        this.selectedTrip = null;
        this.router
          .navigate([], {
            queryParams: {trip: null},
            queryParamsHandling: 'merge',
          })
          .then();
      } else {
        this.router
          .navigate([], {
            queryParams: {trip: this.trip._id},
            queryParamsHandling: 'merge',
          })
          .then();
      }
    }
  }

  onShowMobile(event: MouseEvent) {
    if (this.windowWidth <= 990) {
      this.onShow(event);
    }
  }

  /**
   * SELECT SEAT FUNCTIONALITY
   */
  onSelectSeat(data: Seat) {

    if (data.status === 'Available') {
      let findIndex = this.selectedTrip?.seats.findIndex(
        (s: any) => s._id === data?._id
      );
      this.selectedTrip.seats[findIndex].seatAnimation = true;
      const cartData: Cart = {
        trip: this.selectedTrip._id,
        user: {
          _id: this.adminService.getAdminId(),
          role: 'admin',
          isAuth: true,
        },
        applicationChannel: 'admin',
        date: this.selectedTrip.date,
        // date: this.date,
        seat: data._id,
        price: data?.price,
        gender: 'Male',
        version: data.version,
      };
      this.addCart(cartData, findIndex, 'add');
    } else {
      if (
        data.status === 'Selected' &&
        this.carts.find((f) => f.seat === data._id)
      ) {
        let findIndex = this.selectedTrip?.seats.findIndex(
          (s: any) => s._id === data?._id
        );
        this.selectedTrip.seats[findIndex].seatAnimation = true;
        const cartData: Cart = {
          trip: this.selectedTrip._id,
          user: {
            _id: this.adminService.getAdminId(),
            role: 'admin',
            isAuth: true,
          },
          applicationChannel: 'admin',
          date: this.selectedTrip.date,
          seat: data._id,
          price: data?.price,
          gender: 'Male',
          version: data.version,
        };
        this.addCart(cartData, findIndex, 'remove');
      } else {
        this.uiService.wrong(`This Seat Is ${data.status}`);
      }
    }
  }

  /**
   * On Select Methods
   * onSelectBoardingPoint()
   * onSelectDroppingPoint()
   * onSelectGender()
   */
  onSelectBoardingPoint(data: any) {
    this.selectBoardingPoints = data;
    this.isBoardingError = false;

    console.log('selected trip', this.selectedTrip);
    console.log('selected seats', this.selectedSeats);

  }

  onSelectDroppingPoint(data: any) {
    this.selectDroppingPoints = data;
    this.isDroppingError = false;
  }

  onSelectGender(data: string) {
    this.dataForm.patchValue({
      gender: data,
    });
    this.selectedGender = data;
  }

  /**
   * HTTP REQ Handle
   * addCart()
   * getCartByTrip()
   * bookTrip()
   */

  private addCart(data: Cart, index: number, type: 'add' | 'remove') {
    this.subDataOne = this.cartService.addCart(data).subscribe({
      next: (res) => {
        this.selectedTrip.seats[index].seatAnimation = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.selectedTrip.seats[index].status =
            type === 'add' ? 'Selected' : 'Available';
          if (this.mode === 'edit' && type === 'remove') {
            const fIndex = this.selectedSeats.findIndex(
              (f) => f._id === data.seat
            );
            this.selectedSeats.splice(fIndex, 1);
          }
          this.reloadService.needRefreshData$();

        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        this.uiService.wrong('Something went wrong! Try again');
        console.log(err);
      },
    });
  }

  private getCartByTrip() {
    const data = {
      user: this.adminService.getAdminId(),
      trip: this.selectedTrip?._id,
    };
    this.subDataTwo = this.cartService.getCartByTrip(data).subscribe({
      next: (res) => {
        this.carts = res.data;
        const seats: Seat[] = [];

        if (this.carts.length) {
          this.carts.forEach((cart: any) => {
            const fSeat = this.selectedTrip.seats.find(
              (f) => f._id === cart.seat
            );
            seats.push({...fSeat, ...{type: 'new'}});
          });
        }

        if (this.mode !== 'edit') {
          this.selectedSeats = seats;
        } else {
          seats.forEach((s) => {
            const fIndex = this.selectedSeats.findIndex((f) => f._id === s._id);
            if (fIndex === -1) {
              this.selectedSeats.push(s);
            }
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private bookTrip(data: any) {
    this.subDataThree = this.tripService.bookTrip(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.reloadService.needRefreshData$();
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
        this.initDataForm();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  private updateBookedTrip(data: any) {
    this.subDataThree = this.tripService
      .updateBookedTrip(this.ticket._id, data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.reloadService.needRefreshData$();
            this.uiService.success(res.message);
            // this.router.navigate(['/bus-booking/all-tickets']);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }

  private getTripById() {
    this.subDataFour = this.tripService.getTripById(this.id).subscribe({
      next: (res) => {
        this.selectedTrip = res.data;

        const floors = [];
        if (this.selectedTrip) {
          this.selectedTrip.seats.forEach((f) => {
            f.seatAnimation = false;
            const fIndex = floors.findIndex(g => g === f.floorNo);
            if (fIndex === -1) {
              floors.push(f.floorNo)
            }
          });
          this.selectedTripFloors = floors.sort();
          if(!this.floorSelected){
            this.floorSelected = this.selectedTripFloors[0];
          }
          this.getCartByTrip();

          setTimeout(() => {
            window.scrollTo({top: 300, behavior: 'smooth'});
          }, 300)
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  /**
   * Calculation
   * totalAmount()
   * serviceCharge()
   * grandTotal()
   */

  get totalAvailableSeats() {
    return this.availableSeats;
  }

  get totalAmount() {
    let price = 0;
    this.selectedSeats.forEach(seat => {
      price += this.pricePipe.transform(this.selectedTrip.prices, seat.seatType);
    })
    return price
  }

  get serviceCharge() {
    if (this.mode !== 'edit') {
      if (this.carts.length) {
        return this.trip?.serviceCharge * this.carts.length ?? 0;
      } else {
        return 0;
      }
    } else {
      if (this.selectedSeats.length) {
        return this.trip?.serviceCharge * this.selectedSeats.length;
      } else {
        return 0;
      }
    }
  }

  get grandTotal() {
    return this.totalAmount + this.serviceCharge;
  }

  ngOnDestroy() {
    if (this.subReload) {
      this.subReload.unsubscribe();
    }

    if (this.subRoute) {
      this.subRoute.unsubscribe();
    }

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }

  onRemoveBookedSeat(seat: Seat) {
    const fIndex = this.selectedSeats.findIndex((f) => f._id === seat._id);
    this.selectedSeats.splice(fIndex, 1);
    this.canceledSeats.push(seat);
  }

  onRemoveCanceledSeat(seat: Seat) {
    const fIndex = this.canceledSeats.findIndex((f) => f._id === seat._id);
    this.canceledSeats.splice(fIndex, 1);
    this.selectedSeats.push(seat);
  }


  private getAdminById(id:string){
    this.adminService.getAdminBYId(id).subscribe({
      next: res => {
        console.log('getAdminById', res);
        this.userInfo = res?.data; 
      },
      error: err => {
        console.log(err);
        
      }
    })
  }
}
