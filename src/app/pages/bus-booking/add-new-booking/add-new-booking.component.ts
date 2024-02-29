import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FilterData} from 'src/app/interfaces/gallery/filter-data';
import {TripService} from 'src/app/services/common/trip.service';
import {Trip} from '../../../interfaces/common/trip.interface';
import {TicketService} from '../../../services/common/ticket.service';
import {Ticket} from '../../../interfaces/common/ticket.interface';

@Component({
  selector: 'app-add-new-booking',
  templateUrl: './add-new-booking.component.html',
  styleUrls: ['./add-new-booking.component.scss'],
})
export class AddNewBookingComponent implements OnInit {

  trips: Trip[] = [];
  mode: 'edit' | 'add' = 'add';

  // Edit Data
  ticketId: string;
  ticket: Ticket = null;
  trip: Trip = null;


  // Pagination
  currentPage = 1;


  // FilterData
  private filter: any = null
  sortQuery: any = {createdAt: -1};
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];

  // Subscriptions
  private subRouteOne: Subscription;
  private subGetData: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  // Inject
  private readonly tripService = inject(TripService);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);


  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM

    this.activatedRoute.paramMap.subscribe(param => {
      if (param.get('id')) {
        this.mode = 'edit';
        this.ticketId = param.get('id');
        if (this.ticketId) {
          this.getTicketById();
        }
      }
    });

    if (this.mode === 'add') {
      this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
        if (qParam && qParam.get('page')) {
          this.currentPage = Number(qParam.get('page'));
        } else {
          this.currentPage = 1;
        }

        if (qParam.get('from')) {
          this.filter = {
            ...this.filter,
            ...{
              'from.name': qParam.get('from'),
            }
          }
        }

        if (qParam.get('to')) {
          this.filter = {
            ...this.filter,
            ...{
              'to.name': qParam.get('to'),
            }
          }
        }

        if (qParam.get('date')) {
          this.filter = {
            ...this.filter,
            ...{
              date: qParam.get('date'),
            }
          }
        }
        if (qParam.get('shift')) {
          this.filter = {
            ...this.filter,
            ...{
              'departureTime.shift': qParam.get('shift')
            }
          }
        }

        console.log('After Mode', this.mode)
        if (this.filter) {
          this.getAllTrips();
        }

      });
    }
  }


  /**
   * HTTP REQUEST HANDLE
   * getAllTrips()
   */

  private getAllTrips() {
    // Select
    const mSelect = {
      date: 1,
      bus: 1,
      departureTime: 1,
      arrivalTime: 1,
      from: 1,
      to: 1,
      boardingPoints: 1,
      droppingPoints: 1,
      price: 1,
      serviceCharge: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: this.sortQuery,
    };

    this.subGetData = this.tripService
      .getAllTrip(filter, null)
      .subscribe({
        next: (res) => {
          this.trips = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });

  }

  private getTicketById() {
   this.subDataOne =  this.ticketService.getTicketById(this.ticketId).subscribe({
      next: res => {
        this.ticket = res.data;
        if (this.ticket) {
          this.subDataTwo = this.tripService.getTripById(this.ticket.trip, 'date bus departureTime arrivalTime from to boardingPoints droppingPoints price serviceCharge createdAt')
            .subscribe({
              next: res => {
                this.trip = res.data;
                this.router.navigate([], {queryParams: {trip: this.trip._id}, queryParamsHandling: 'merge'}).then()
              },
              error: err => {
                console.log(err)
              }
            })
        }
      }
    })
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }


}
