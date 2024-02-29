import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Counter } from 'src/app/interfaces/common/counter.interface';
import { RouteRelations } from 'src/app/interfaces/common/route-relation.interface';
import { Terminal } from 'src/app/interfaces/common/terminal.interface';
import { FilterData } from 'src/app/interfaces/core/filter-data';
import { Select } from 'src/app/interfaces/core/select';
import { CounterService } from 'src/app/services/common/counter.service';
import { RouteRelationService } from 'src/app/services/common/route-relation.service';
import { RouteService } from 'src/app/services/common/route.service';
import { TerminalService } from 'src/app/services/common/terminal.service';
import { UiService } from 'src/app/services/core/ui.service';

interface AccessOption {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-add-route-relation',
  templateUrl: './add-route-relation.component.html',
  styleUrls: ['./add-route-relation.component.scss']
})
export class AddRouteRelationComponent implements OnInit {

// Data Form
@ViewChild('formElement') formElement: NgForm;
dataForm?: FormGroup;


HasAccessControl = new FormControl<AccessOption | null>(
  null,
  Validators.required
);




// Store Data
id?: string;
routeRelation?: RouteRelations;
terminals:Terminal[];
isLoading = false;

// Subscriptions
private subDataOne: Subscription;
private subDataTwo: Subscription;
private subDataThree: Subscription;
private subDataFour:Subscription;
private subDataFive:Subscription;
private subRouteOne: Subscription;

constructor(
  private fb: FormBuilder,
  private uiService: UiService,
  private spinnerService: NgxSpinnerService,
  private activatedRoute: ActivatedRoute,
  private routeRelationService: RouteRelationService,
  private counterService:CounterService,
  private terminalService:TerminalService
) {
}

ngOnInit(): void {
  // Init Form
  this.initDataForm();

  // GET ID FORM PARAM
  this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
    this.id = param.get('id');

    if (this.id) {
      this.getRouteById();
    }
  });

  //Base 
  this.getAllTerminals();
}

/**
 * FORM METHODS
 * initDataForm()
 * setFormValue()
 * onSubmit()
 */

private initDataForm() {
  this.dataForm = this.fb.group({
    from: [null,Validators.required],
    to: [null,Validators.required],
    priority: [null],
    status: ['publish'],
  });
}


private setFormValue() {
  let to:string[];

  if(this.routeRelation && this.routeRelation.to){
    to = this.routeRelation.to.map((v) => v._id);
  }
  this.dataForm.patchValue(
    {
      ...this.routeRelation,
      from:this.routeRelation.from._id,
      to:to,
    }
  );
  
}



onSubmit() {
  if (this.dataForm.invalid) {
    this.uiService.warn('Please filed all the required field');
    return;
  }

  //Merge Data
  const mData = {
       ...this.dataForm.value,
       ...{
          from: this.terminals.find((m) => m._id === this.dataForm.value.from),
       }
  }

  //Filter Boarding Points
  if (this.dataForm.value.to) {
    mData.to = []
    this.dataForm.value.to.map((item) => {
      mData.to.push({
        _id: item,
        name: this.terminals.find(f => f._id === item)?.name,
      })
    })
  }

  if (!this.routeRelation) {
    this.addRoute(mData);
  } else {
    this.updateRouteById(mData);
  }
}

/**
 * HTTP REQ HANDLE
 * getRouteById()
 * addRoute()
 * updateRouteById()
 * getAllCounters()
 */

private getRouteById() {
  this.spinnerService.show();
  this.subDataOne = this.routeRelationService.getRouteRelationById(this.id).subscribe({
    next: (res) => {
      this.spinnerService.hide();
      if (res.data) {
        this.routeRelation = res.data;
        this.setFormValue();
      }
    },
    error: (error) => {
      this.spinnerService.hide();
      console.log(error);
    },
  });
}

private addRoute(data:any) {
  this.isLoading = true;
  this.subDataTwo = this.routeRelationService
    .addRouteRelation(data)
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

private updateRouteById(data:any) {
  this.isLoading = true;
  this.subDataThree = this.routeRelationService
    .updateRouteRelationById(this.routeRelation._id, data)
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



private getAllTerminals(){
  const mSelect = {
     name:1,
  }
  const filter:FilterData = {
     select:mSelect,
     pagination:null,
     sort:{createdAt:-1},
     filter:null
  }

  this.subDataFive = this.terminalService.getAllTerminal(filter).subscribe({
   next:(res) => {
        if(res.success){
            this.terminals = res.data;
        }
   },
   error:(err) => {
        if(err){
            console.log(err);
        }
   }
  })
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
  if (this.subDataFour) {
    this.subDataFour.unsubscribe();
  }
  if (this.subDataFive) {
    this.subDataFive.unsubscribe();
  }
  if (this.subRouteOne) {
    this.subRouteOne.unsubscribe();
  }
}

}
