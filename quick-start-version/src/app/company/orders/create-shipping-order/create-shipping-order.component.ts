import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { OrderManagementService } from '../order-management.service';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-shipping-order',
  templateUrl: './create-shipping-order.component.html',
  styles: []
})
export class CreateShippingOrderComponent implements OnInit {
  public maskDateSlash = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  infoForm: FormGroup;
  tupleTypes;
  @Output() formShuppingValues = new EventEmitter();
  lstForworders = [];
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      this.lstForworders = z.forworders;
    });
  }
  constructor(private fbuilder: FormBuilder,private router:Router, private datePipe: DatePipe, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.loadOptionsFirst();
    this.tupleTypes = TupleTypes;
  }

  ngOnInit() {
    if(this.router.url.indexOf("t=e") != -1){
      this.getAutharizationLevel('edit')
    }else{
      this.getAutharizationLevel('add')
    }
    
    if (typeof this.orderManagementService.ShippingOrder == 'undefined' || !(this.orderManagementService.ShippingOrder instanceof Object)) {
      this.PrepareForm({});
    }
    else {
      this.PrepareForm(this.orderManagementService.PrepareProp(this.orderManagementService.stringIds(this.orderManagementService.ShippingOrder)));
    }
  }

  get frmC() {
    return this.infoForm.controls;
  }
  fileds;
  getAutharizationLevel(mode) {
    if (!this.fileds) {
      this.fileds = this.orderManagementService.getOrderPartsFileds('orderShippings', mode)['showEditable'];
    }
  }
  PrepareForm(itm) {
    this.infoForm = this.fbuilder.group({
      "orderId": [itm.orderId],
      "orderShippingsStatus": [itm.orderShippingsStatus],//Not input
      "shippingCompanyRefrence": [itm.shippingCompanyRefrence],
      "openingShippingOrderDate": [itm.openingShippingOrderDate ? formatDate(itm.openingShippingOrderDate, 'yyyy-MM-dd', 'en') : ''],
      "departureDate": [itm.departureDate ? formatDate(itm.departureDate, 'yyyy-MM-dd', 'en') : ''],
      "shippingDate": [itm.shippingDate ? formatDate(itm.shippingDate, 'yyyy-MM-dd', 'en') : ''],
      "forwarderId": [itm.forwarderId],
      "shippingLine": [itm.shippingLine],
      "foreignAgent": [itm.foreignAgent],
      "delayedContainerDays": [itm.delayedContainerDays],
      "bOLNo": [itm.bOLNo],
      "vessel": [itm.vessel],
      "isDirectShipping": [itm.isDirectShipping],
      "shippingPrice": [itm.shippingPrice],
      "craneFees": [itm.craneFees],
      "deliveryCost": [itm.deliveryCost],
    });
    setTimeout(() => {
      this.setinitDates('openingShippingOrderDate', 'shippingDate');
    }, 200);
    this.infoForm.valueChanges.subscribe(z => {
      if (this.infoForm.valid) {
        this.orderManagementService.ShippingOrder = this.orderManagementService.EmptyToNulls(this.infoForm.value);
      }
      this.orderManagementService.isChaged = true;
    })

  }

  setinitDates(...lstDatesIds) {
    lstDatesIds.forEach(
      propName => {
        var z: any = document.getElementById(propName);
        if (z != null)
          z.value = this.infoForm.controls[propName].value;
      }
    )
  }

  frmDate(propName) {
    setTimeout(() => {
      var z: any = document.getElementById(propName);
      typeof this.infoForm.controls[propName] != 'undefined' ? this.infoForm.controls[propName].setValue(z.value) : null;
    }, 300);
    // return value;
  }
}
