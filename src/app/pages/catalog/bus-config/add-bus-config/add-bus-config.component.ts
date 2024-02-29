import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { SEAT_TYPES } from 'src/app/core/db/seat-type.db';
import { PRODUCT_STATUS } from 'src/app/core/utils/app-data';
import { BusConfig } from 'src/app/interfaces/common/bus-config.interface';
import { Bus } from 'src/app/interfaces/common/bus.interface';
import { Counter } from 'src/app/interfaces/common/counter.interface';
import { Schedule } from 'src/app/interfaces/common/schedule.interface';
import { Terminal } from 'src/app/interfaces/common/terminal.interface';
import { Select } from 'src/app/interfaces/core/select';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
import { BusConfigService } from 'src/app/services/common/bus-config.service';
import { BusService } from 'src/app/services/common/bus.service';
import { CounterService } from 'src/app/services/common/counter.service';
import { ScheduleService } from 'src/app/services/common/schedule.service';
import { TerminalService } from 'src/app/services/common/terminal.service';
import { UiService } from 'src/app/services/core/ui.service';
import { UtilsService } from 'src/app/services/core/utils.service';

@Component({
  selector: 'app-add-bus-config',
  templateUrl: './add-bus-config.component.html',
  styleUrls: ['./add-bus-config.component.scss'],
})
export class AddBusConfigComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  // Form Array
  seatsDataArray?: FormArray;
  priceDataArray?: FormArray;

  // Store Data
  id?: string;
  busConfig?: BusConfig;
  schedules: Schedule[] = [];
  terminals: Terminal[] = [];
  counters: Counter[] = [];
  buss: Bus[] = [];

  isLoading = false;

  // Static Data
  busConfigStatus: Select[] = PRODUCT_STATUS;
  seatTypes: Select[] = SEAT_TYPES;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private busConfigService: BusConfigService,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private scheduleService: ScheduleService,
    private terminalService: TerminalService,
    private busService: BusService,
    private counterService: CounterService,
    private utilService: UtilsService
  ) {}

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getBusConfigById();
      }
    });

    /**
     * BASE DATA
     */

    this.getAllSchedule();
    this.getAllTerminals();
    this.getAllCounters();
    this.getAllBus();
  }

  /**
   * FORMS METHODS
   * initDataForm()
   * setFormValue()
   * onAddNewSpecifications()
   * removeFormArrayField()
   * clearFormArray()
   * findInvalidControls()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      bus: [null, Validators.required],
      departureTime: [null, Validators.required],
      arrivalTime: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      boardingPoints: [null],
      droppingPoints: [null],
      price: [null],
      prices: this.fb.array([]),
      serviceCharge: [null],
      //  seats: [null],
      status: ['publish'],
      priority: [null, Validators.required],
    });
    this.priceDataArray = this.dataForm.get('prices') as FormArray;
  }

  private setFormValue() {
    let boardingPoints: string[];
    let droppingPoints: string[];

    if (this.busConfig && this.busConfig.boardingPoints) {
      boardingPoints = this.busConfig.boardingPoints.map((v) => v._id);
    }
    if (this.busConfig && this.busConfig.droppingPoints) {
      droppingPoints = this.busConfig.droppingPoints.map((v) => v._id);
    }
    this.dataForm.patchValue({
      ...this.busConfig,
      bus: this.busConfig.bus?._id,
      from: this.busConfig.from?._id,
      to: this.busConfig.to?._id,
      departureTime: this.busConfig.departureTime?._id,
      arrivalTime: this.busConfig.arrivalTime?._id,
      boardingPoints: boardingPoints,
      droppingPoints: droppingPoints,
    });

    // Form Array Seats
    if (this.busConfig.prices && this.busConfig.prices.length) {
      this.busConfig.prices.map((m) => {
        const f = this.fb.group({
          price: [m.price],
          seatType: [m.seatType],
        });
        (this.dataForm?.get('prices') as FormArray).push(f);
      });
    }
  }

  onAddNewSeat() {
    const f = this.fb.group({
      price: [null, Validators.required],
      seatType: [null, Validators.required],
    });
    (this.dataForm?.get('prices') as FormArray).push(f);
    console.log(this.seatsDataArray);
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    const mData = {
      ...this.dataForm.value,
      ...{
        // date:this.utilService.getDateString(this.dataForm.value.date),
        bus: this.buss.find((m) => m._id === this.dataForm.value.bus),
        from: this.terminals.find((m) => m._id === this.dataForm.value.from),
        to: this.terminals.find((m) => m._id === this.dataForm.value.to),
        departureTime: this.schedules.find(
          (m) => m._id === this.dataForm.value.departureTime
        ),
        arrivalTime: this.schedules.find(
          (m) => m._id === this.dataForm.value.arrivalTime
        ),
      },
    };

    //Filter Boarding Points
    if (this.dataForm.value.boardingPoints) {
      mData.boardingPoints = [];
      this.dataForm.value.boardingPoints.map((item) => {
        mData.boardingPoints.push({
          _id: item,
          name: this.counters.find((f) => f._id === item)?.name,
        });
      });
    }
    //Filter Dropping Points
    if (this.dataForm.value.droppingPoints) {
      mData.droppingPoints = [];
      this.dataForm.value.droppingPoints.map((item) => {
        mData.droppingPoints.push({
          _id: item,
          name: this.counters.find((f) => f._id === item)?.name,
        });
      });
    }

    if (this.busConfig) {
      this.updateBusConfigById(mData);
    } else {
      this.addBusConfig(mData);
    }
  }

  /**
   * HTTP REQ HANDLE
   * getBusConfigById()
   * addBusConfig()
   * updateBusConfigById()
   * getAllSchedule()
   * getAllTerminals()
   * getAllCounters()
   * getAllBus()
   */

  private getBusConfigById() {
    this.spinnerService.show();
    this.subDataTwo = this.busConfigService
      .getBusConfigById(this.id)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.busConfig = res.data;
            this.setFormValue();
          }
        },
        error: (error) => {
          this.spinnerService.hide();
          console.log(error);
        },
      });
  }

  private addBusConfig(data: any) {
    this.isLoading = true;
    this.subDataOne = this.busConfigService.addBusConfig(data).subscribe({
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

  private updateBusConfigById(data: any) {
    this.isLoading = true;
    this.subDataThree = this.busConfigService
      .updateBusConfigById(this.busConfig._id, data)
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

  private getAllSchedule() {
    const mSelect = {
      name: 1,
      shift: 1,
    };
    const filterData: FilterData = {
      filter: null,
      pagination: null,
      sort: { createdAt: -1 },
      select: mSelect,
    };

    this.subDataFour = this.scheduleService
      .getAllSchedule(filterData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.schedules = res.data;
          }
        },
        error: (err) => {
          if (err) {
            console.log(err);
          }
        },
      });
  }
  private getAllTerminals() {
    const mSelect = {
      name: 1,
    };
    const filterData: FilterData = {
      filter: null,
      pagination: null,
      sort: { createdAt: -1 },
      select: mSelect,
    };

    this.subDataFour = this.terminalService
      .getAllTerminal(filterData)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.terminals = res.data;
          }
        },
        error: (err) => {
          if (err) {
            console.log(err);
          }
        },
      });
  }

  private getAllCounters() {
    const mSelect = {
      name: 1,
    };
    const filterData: FilterData = {
      filter: null,
      pagination: null,
      sort: { createdAt: -1 },
      select: mSelect,
    };

    this.subDataFour = this.counterService.getAllCounter(filterData).subscribe({
      next: (res) => {
        if (res.success) {
          this.counters = res.data;
        }
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      },
    });
  }

  private getAllBus() {
    const mSelect = {
      name: 1,
      coachType: 1,
      totalSeat: 1,
      seats: 1,
      company: 1,
    };
    const filterData: FilterData = {
      filter: null,
      pagination: null,
      sort: { createdAt: -1 },
      select: mSelect,
    };

    this.subDataFour = this.busService.getAllBus(filterData).subscribe({
      next: (res) => {
        if (res.success) {
          this.buss = res.data;
        }
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      },
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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }
}
