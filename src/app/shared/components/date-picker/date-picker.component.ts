import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  @ViewChild('navmenu', { static: true }) navMenu: MatMenu;

  @Output() passDataEvent = new EventEmitter();
  @Input() inputDate: string = null;
  @Input() label: string = null;
  @Input() touched: boolean = false;
  @Input() isLocal: boolean = true;

  errorMsg: boolean = false;

  @Input() dateSelected: Date | null;
  localDate: string | null;
  dateFormat: string = null;

  constructor(
  ){}

  ngOnInit(){
  }

  ngOnChanges(): void {
    if (this.inputDate) {
      this.dateSelected = new Date(this.inputDate);
      this.localDate = this.dateSelected.toLocaleDateString();
    }

    if (this.touched && this.dateSelected === undefined) {
      this.errorMsg = true;
    } else {
      this.errorMsg = false;
    }
  }

  getMenuName() {
    return this.navMenu;
  }


  onDateReset() {
    this.dateSelected === undefined;
    this.inputDate = null;
    this.localDate = null;
    this.passDataEvent.emit(null);
  }

  onDateChange(date: any) {
    if (this.dateSelected !== undefined) {
      this.localDate = this.dateSelected.toLocaleDateString('en-US');
      const date = new Date(this.dateSelected.toLocaleDateString('en-US'));
      const isoDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      this.errorMsg = false;
      this.passDataEvent.emit(isoDateString);
      // console.log(isoDateString);

      this.navMenu.closed.next();
    }
  }
}

