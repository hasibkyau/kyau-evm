import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {RouteRelations} from '../../../interfaces/common/route-relation.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteRelationService} from '../../../services/common/route-relation.service';
import {UiService} from '../../../services/core/ui.service';
import {UtilsService} from '../../../services/core/utils.service';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {Terminal} from '../../../interfaces/common/terminal.interface';
import {MatSelect} from '@angular/material/select';
import { Select } from 'src/app/interfaces/core/select';
import { SEAT_TYPES } from 'src/app/core/db/seat-type.db';

@Component({
  selector: 'app-search-trip',
  templateUrl: './search-trip.component.html',
  styleUrls: ['./search-trip.component.scss']
})
export class SearchTripComponent implements OnInit {

  @ViewChild('formInput') formInput!: ElementRef;
  @ViewChild('toInput') toInput!: ElementRef;
  @ViewChild('picker1') picker1!: MatDatepicker<any>;

  @Output() searchEvent = new EventEmitter();

  routeRelations: RouteRelations[] = [];


  isReversed = false;
  formData!: FormGroup;
  isFormFocused = false;
  isToFocused = false;
  selectedForm!: string | any;
  selectedTo!: string | any;
  //Search Form
  searchQuery!: string | any;
  //Search To;
  holdAllFormRoute = [];
  allToRoute: any[] = [];
  holdAllToRoute: any[] = [];
  totalRoute = 0;
  totalToRoute = 0;
  searchFormRoute: any[] = [];
  searchToRoute: any[] = [];

  seatTypes: Select[] = SEAT_TYPES;

  //Subscriptions;
  private subFormTerminal!: Subscription;
  private subToTerminal!: Subscription;
  private subForm!: Subscription | any;
  private subParam: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private routeRelationService: RouteRelationService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.getAllRouteRelation();

    this.subParam = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam) {
        this.selectedForm = qParam.get('from');
        this.selectedTo = qParam.get('to');
        this.formData.patchValue({
          from: qParam.get('from'),
          to: qParam.get('to'),
          date: qParam.get('date'),
          // shift: qParam.get('shift'),
          seatType: qParam.get('seatType'),
        });
      }
    })
  }

  ngAfterViewInit(): void {
    let formRoute = this.formData.get('from')?.valueChanges;
    formRoute?.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((el) => el?.trim()),
    )
      .subscribe((res) => {
        this.searchQuery = res?.toLowerCase();
        this.routeRelations = this.holdAllFormRoute;
        if (this.searchQuery == null || this.searchQuery == '') {
          this.searchFormRoute = [];
          this.routeRelations = this.holdAllFormRoute;
          this.totalRoute = this.holdAllFormRoute.length;
          this.searchQuery = null;
          return;
        }
        this.searchFormRoute = this.routeRelations.filter((el) => el.from.name.toLowerCase().indexOf(this.searchQuery) > -1);
        this.routeRelations = this.searchFormRoute;
        this.totalRoute = this.searchFormRoute.length;
      })

    let toRoute = this.formData.get('to')?.valueChanges;
    toRoute?.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((el) => el?.trim())
    )
      .subscribe((res) => {
        this.searchQuery = res?.toLowerCase();
        this.allToRoute = this.holdAllToRoute;
        if (this.searchQuery == null || this.searchQuery == '') {
          this.searchToRoute = [];
          this.allToRoute = this.holdAllToRoute;
          this.totalToRoute = this.holdAllToRoute.length;
          this.searchQuery = null;
          return;
        }
        this.searchToRoute = this.allToRoute.filter((el) => el.name.toLowerCase().indexOf(this.searchQuery) > -1);
        this.allToRoute = this.searchToRoute;
        this.totalToRoute = this.searchToRoute.length;

      })


  }


  /***
   * FROM INITIALIZE
   * initForm()
   */

  initForm() {
    this.formData = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      date: [null, Validators.required],
      shift: [null],
      seatType: [null]
    })
  }

  onSubmit() {
    if (this.formData.valid) {
      this.searchEvent.emit(this.formData.value);
      this.router.navigate([], {
        queryParams: {
          from: this.selectedForm,
          to: this.selectedTo,
          date: this.utilsService.getDateString(this.formData.value.date),
          // shift: this.formData.value.shift,
          seatType: this.formData.value.seatType
        },
        queryParamsHandling: 'merge'
      }).then();
    } else {
      this.uiService.warn('Invalid Form');
    }
  }

  /**
   * BANNER HTTP REQUEST HANDLE
   * getAllRouteRelation()
   */
  private getAllRouteRelation() {
    const mSelect = {
      from: 1,
      to: 1,
    }

    const filterData: FilterData = {
      select: mSelect,
      pagination: null,
      sort: {'from.name': 1},
      filter: {
        status: 'publish'
      }
    }

    this.subFormTerminal = this.routeRelationService.getAllRouteRelation(filterData).subscribe((res) => {
        if (res.success) {
          this.routeRelations = res.data;
          this.holdAllFormRoute = res.data;
          this.totalRoute = res.count;
        }
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    )
  }


  /**
   * FOCUS,Select FORM AND TO FORM FIELD CONTROLL
   */

  onFocusedForm() {
    let inputForm = this.formInput.nativeElement as HTMLInputElement;
    this.isFormFocused = true;
    if (this.selectedForm) {
      inputForm.placeholder = this.selectedForm;
      this.formData.patchValue({
        from: ''
      })
    }
  }

  onBlurForm() {
    let inputForm = this.formInput.nativeElement as HTMLInputElement;
    let inputTo = this.toInput.nativeElement as HTMLInputElement;
    this.isFormFocused = false;
    inputTo.focus();

    if (this.selectedForm) {
      inputForm.placeholder = 'FORM';
      this.formData.patchValue({
        form: this.selectedForm
      })
    }
  }

  onFocusedTo() {
    this.isToFocused = true;
    let inputTo = this.toInput.nativeElement as HTMLInputElement;
    if (this.selectedTo) {
      inputTo.placeholder = this.selectedTo;
      this.formData.patchValue({
        to: ''
      })
    }
  }

  onBlurTo() {
    this.isToFocused = false;
    let inputTo = this.toInput.nativeElement as HTMLInputElement;
    if (this.selectedTo) {
      inputTo.placeholder = 'TO';
      this.formData.patchValue({
        to: this.selectedTo
      })
    }
  }


  reverseFormTo() {
    this.isReversed = !this.isReversed;

    if (this.isReversed) {
      let temp = this.selectedForm;
      this.selectedForm = this.selectedTo;
      this.selectedTo = temp;
      if (this.selectedForm && this.selectedTo) {
        this.formData.patchValue({
          from: this.selectedForm
        })
        this.formData.patchValue({
          to: this.selectedTo
        })
      }


    } else {

      let temp = this.selectedTo;
      this.selectedTo = this.selectedForm;
      this.selectedForm = temp;

      if (this.selectedForm && this.selectedTo) {
        this.formData.patchValue({
          from: this.selectedForm
        })
        this.formData.patchValue({
          to: this.selectedTo
        })
      }
    }


  }

  onSelectFrom(data: RouteRelations) {
    if (data) {
      this.allToRoute = data.to;
      this.holdAllToRoute = data.to;
      this.formData.patchValue({
        from: data.from.name
      })
      this.selectedForm = data.from.name;

    }
  }

  onSelectToValue(data: Terminal) {
    this.selectedTo = data.name;
    this.formData.patchValue({
      to: data?.name
    })
    this.picker1.open();
  }


  onSelectClick(select: MatSelect) {
    select.open();
  }


  /**
   * ON DESTROY SUBSCRIPTION
   */
  ngOnDestroy(): void {
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subFormTerminal) {
      this.subFormTerminal.unsubscribe();
    }
    if (this.subToTerminal) {
      this.subToTerminal.unsubscribe();
    }
    if (this.subParam) {
      this.subParam.unsubscribe();
    }
  }
}
