import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import * as moment from 'moment';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { OrderManagementService } from '../order-management.service';
import { OrderGenerals } from 'src/app/Shared/Orders/OrderGenerals';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
@Component({
  selector: 'app-create-general-order',
  templateUrl: './create-general-order.component.html',
  styles: []
})
export class CreateGeneralOrderComponent implements OnInit {
  exampleDatepickerConfig;
  public maskDateSlash = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  infoForm: FormGroup;
  Options = [];
  tupleTypes;
  lstWarehouses = [];
  @Output() formGeneralValues = new EventEmitter();
  testTupleTypes = (itmTT) => itmTT == this.tupleTypes['Country'] || itmTT == this.tupleTypes['Discharge Destination Port'] || itmTT == this.tupleTypes['Destination Port'];
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      this.lstWarehouses = z.warehouses.map((itm) => {
        return {
          value: '' + itm.id,
          label: itm.name
        }
      });
      z.autoComplete.forEach(itm => {
        if (this.testTupleTypes(itm.tupleType)) {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
          // this.cardLoad = false;
        }
      });
    });
  }
  constructor(private fbuilder: FormBuilder,private companyPreDefinedAutoDataService:CompanyPreDefinedAutoDataService, private router: Router, private datePipe: DatePipe, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.tupleTypes = TupleTypes;
    this.loadOptionsFirst();
  }
  setupData;
  ngOnInit() {
    if (this.router.url.indexOf("t=e") != -1) {
      this.getAutharizationLevel('edit')
    } else {
      this.getAutharizationLevel('add')
    }

    if (typeof this.orderManagementService.GeneralOrder == 'undefined' || !(this.orderManagementService.GeneralOrder instanceof Object)) {
      this.PrepareForm({});
    }
    else {
      this.PrepareForm(this.orderManagementService.PrepareProp(this.orderManagementService.stringIds(this.orderManagementService.GeneralOrder)));
    }





    if (this.router.url.indexOf("t=e") == -1) {
      this.companyPreDefinedAutoDataService.getCompanySetupData().subscribe(z => {
        this.frmC.originOfGoods.setValue(String(z['originOfGoodsId']))
        this.frmC.exportCountryId.setValue(String(z['exportCountryId']))
        this.frmC.warehousesId.setValue(String(z['warehouseId']))
        this.frmC.destinationPortId.setValue(String(z['destinationPortId']))
        this.frmC.dischargePortId.setValue(String(z['dischargePortId']))
      })
    }
  }
  get frmC() {
    return this.infoForm.controls;
  }

  fileds;
  getAutharizationLevel(mode) {
    if (this.router.url.split('/')[2] == 'performas') {
      this.fileds = this.orderManagementService.getOrderPartsFileds('orderGenerals', mode, true)['showEditable'];
    } else
      if (!this.fileds) {
        this.fileds = this.orderManagementService.getOrderPartsFileds('orderGenerals', mode)['showEditable'];
      }
  }
  PrepareForm(itm) {
    if (itm == null) itm = {};
    this.infoForm = this.fbuilder.group({
      "orderId": [itm.orderId],
      "orderRefrence": [itm.orderRefrence],
      "originOfGoods": [itm.originOfGoods],
      "exportCountryId": [itm.exportCountryId],
      "paymentTerms": [itm.paymentTerms],
      "readyDate": [itm.readyDate ? formatDate(itm.readyDate, 'yyyy-MM-dd', 'en') : ''],
      "orderIsUrgent": [itm.orderIsUrgent ? formatDate(itm.orderIsUrgent, 'yyyy-MM-dd', 'en') : ''],
      "transshipmentAllowed": [itm.transshipmentAllowed],
      "netWeight": [itm.netWeight],
      "totalWeight": [itm.totalWeight],
      "numberOfPackages": [itm.numberOfPackages],
      "cubicVolume": [itm.cubicVolume],
      "destinationPortId": [itm.destinationPortId],
      "dischargePortId": [itm.dischargePortId],
      "warehousesId": [itm.warehousesId],
      "is_changed": [itm.is_changed],
    });
    this.infoForm.valueChanges.subscribe(z => {
      this.orderManagementService.isChaged = true;
      if (this.infoForm.valid) {

        this.orderManagementService.GeneralOrder = this.orderManagementService.EmptyToNulls(this.infoForm.value);
      }
    })

  }

}
