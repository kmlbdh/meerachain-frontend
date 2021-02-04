import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { OrderManagementService } from '../order-management.service';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';

@Component({
  selector: 'app-create-customs-order',
  templateUrl: './create-customs-order.component.html',
  styles: []
})
export class CreateCustomsOrderComponent implements OnInit {
  public maskDateSlash = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  infoForm: FormGroup;
  Options = [];
  tupleTypes;
  lstInlandShippers;
  lstCustomsAgents;
  @Output() formCustomValues = new EventEmitter();
  testTupleTypes = (itmTT) => itmTT == this.tupleTypes['Local Crossing'];
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      this.lstInlandShippers = z.inlandShippers;
      this.lstCustomsAgents = z.customAgents;
      z.autoComplete.forEach(itm => {
        if (this.testTupleTypes(itm.tupleType)) {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
        }
      });
    });
  }
  constructor(private fbuilder: FormBuilder, private router: Router,private companyPreDefinedAutoDataService:CompanyPreDefinedAutoDataService, private datePipe: DatePipe, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.tupleTypes = TupleTypes;
  }
  ngOnInit() {
    this.loadOptionsFirst();
    if (this.router.url.indexOf("orders") != -1) {
      if (this.router.url.indexOf("t=e") != -1) {
        this.getAutharizationLevel('edit')
      } else {
        this.getAutharizationLevel('add')
      }
    }
    if (typeof this.orderManagementService.CustomOrder == 'undefined' || !(this.orderManagementService.CustomOrder instanceof Object)) {
      this.PrepareForm({});
    }
    else {
      this.PrepareForm(this.orderManagementService.PrepareProp(this.orderManagementService.stringIds(this.orderManagementService.CustomOrder)));
    }





    if (this.router.url.indexOf("t=e") == -1) {
      this.companyPreDefinedAutoDataService.getCompanySetupData().subscribe(z => {
        this.frmC.localCrossingId.setValue(String(z['localCrossingId']))
        this.frmC.customsAgentId.setValue(String(z['customAgentId']))
        this.frmC.inlandShipperId.setValue(String(z['inlandShipperId']))
      })
    }
  }
  get frmC() {
    return this.infoForm.controls;
  }
  fileds;
  getAutharizationLevel(mode) {
    if (!this.fileds) {
      this.fileds = this.orderManagementService.getOrderPartsFileds('orderCustoms', mode)['showEditable'];
    }
  }
  PrepareForm(itm) {
    this.infoForm = this.fbuilder.group({
      "orderId": [itm.orderId],
      "customsAgentId": [itm.customsAgentId],
      "documentReceived": [itm.documentReceived ? formatDate(itm.documentReceived, 'yyyy-MM-dd', 'en') : ''],
      "documentApproved": [itm.documentApproved ? formatDate(itm.documentApproved, 'yyyy-MM-dd', 'en') : ''],
      "customsFileOpeningDate": [itm.customsFileOpeningDate ? formatDate(itm.customsFileOpeningDate, 'yyyy-MM-dd', 'en') : ''],
      "customsFileNumber": [itm.customsFileNumber],
      "agentPaymentDate": [itm.agentPaymentDate ? formatDate(itm.agentPaymentDate, 'yyyy-MM-dd', 'en') : ''],
      "localCrossingId": [itm.localCrossingId],
      "inlandShipperId": [itm.inlandShipperId],
      "customesDeclarationNumber": [itm.customesDeclarationNumber],
      "customsPaymentDate": [itm.customsPaymentDate ? formatDate(itm.customsPaymentDate, 'yyyy-MM-dd', 'en') : ''],
      "isCleared": [itm.isCleared ? formatDate(itm.isCleared, 'yyyy-MM-dd', 'en') : ''],
    });
    this.infoForm.controls.inlandShipperId.valueChanges.subscribe(z => {
      this.orderManagementService.maininlandShipperIdChange.next(z);
    })
    this.infoForm.valueChanges.subscribe(z => {
      this.orderManagementService.isChaged = true;
      if (this.infoForm.valid) {
        this.orderManagementService.CustomOrder = this.orderManagementService.EmptyToNulls(this.infoForm.value);
      }
    })

  }
  clickOnCustomsCalculation() {
    console.log("clickOnCustomsCalculation");
    if (confirm("Please make save for any updates before go to custom calculation!")) {
      this.router.navigate([`../impostorcompany/ordercustomcalculation/${this.frmC.orderId.value}`])
      return;
    }
  }

}
