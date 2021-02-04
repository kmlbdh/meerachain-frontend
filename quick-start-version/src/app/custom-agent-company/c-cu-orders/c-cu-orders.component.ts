import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { COrdersService } from 'src/app/Shared/CustomAgentCompany/Orders/corders.service';
import { DatePipe, formatDate } from '@angular/common';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';

@Component({
  selector: 'app-c-cu-orders',
  templateUrl: './c-cu-orders.component.html',
  styleUrls: ['./c-cu-orders.component.scss']
})
export class CCuOrdersComponent implements OnInit {
  infoForm: FormGroup;
  //
  cardLoad
  orderId;
  editableOrder: any = { orderGenerals: {}, orderShippings: {}, orderCustoms: {} };
  Options = {};
  dFormat = 'yyyy-dd-MM';
  constructor(private fbuilder: FormBuilder, private route: ActivatedRoute,private thirdPartytoastyService: ThirdPartytoastyService, private cOrdersService: COrdersService, public datepipe: DatePipe) {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.cOrdersService.singleOrder(this.orderId).subscribe(z => {
        console.log(z);
        
        this.editableOrder = z;
        this.formatEditableOrderDates()
      })
    } else {
      alert("Error! Please back and reOpen the order")
    }
  }
  dateFormater(date) {
    if (date) return formatDate(date, 'yyyy-MM-dd', 'en')
    else return ''
  }
  formatEditableOrderDates() {
    this.editableOrder.orderCreationDate = this.dateFormater(this.editableOrder.orderCreationDate);
    this.editableOrder.arrivalDateToPort = this.dateFormater(this.editableOrder.arrivalDateToPort);


    this.editableOrder.orderGenerals.readyDate = this.dateFormater(this.editableOrder.orderGenerals.readyDate);
    this.editableOrder.orderGenerals.orderIsUrgent = this.dateFormater(this.editableOrder.orderGenerals.orderIsUrgent);


    this.editableOrder.orderShippings.openingShippingOrderDate = this.dateFormater(this.editableOrder.orderShippings.openingShippingOrderDate);
    this.editableOrder.orderShippings.departureDate = this.dateFormater(this.editableOrder.orderShippings.departureDate);
    this.editableOrder.orderShippings.shippingDate = this.dateFormater(this.editableOrder.orderShippings.shippingDate);


    this.editableOrder.orderCustoms.documentApproved = this.dateFormater(this.editableOrder.orderCustoms.documentApproved);
    this.editableOrder.orderCustoms.documentReceived = this.dateFormater(this.editableOrder.orderCustoms.documentReceived);
    this.editableOrder.orderCustoms.customsFileOpeningDate = this.dateFormater(this.editableOrder.orderCustoms.customsFileOpeningDate);
    this.editableOrder.orderCustoms.agentPaymentDate = this.dateFormater(this.editableOrder.orderCustoms.agentPaymentDate);
    this.editableOrder.orderCustoms.isCleared = this.dateFormater(this.editableOrder.orderCustoms.isCleared);

    this.editableOrder.orderContainers.forEach(oc => {
      oc.returnedDateToPort = this.dateFormater(oc.returnedDateToPort);
      oc.arrivalDateToCompany = this.dateFormater(oc.arrivalDateToCompany);
      oc.isScanned = this.dateFormater(oc.isScanned);
      oc.actualArrival = this.dateFormater(oc.actualArrival);
      oc.exitDate = this.dateFormater(oc.exitDate);
    });
  }
  ngOnInit() {
  }

  prepareObjToServer() {
    let objToServer = {};


    objToServer['id'] = this.editableOrder['id'];
    objToServer['arrivalDateToPort'] = this.editableOrder['arrivalDateToPort'];
    objToServer['orderContainers'] = [];
    objToServer['orderCustoms'] = {};

    ['id', 'isScanned', 'scanningHour', 'scanByText'].forEach(propName => {
      this.editableOrder['orderContainers'].forEach((e,i) => {
        if(typeof objToServer['orderContainers'][i] == 'undefined') objToServer['orderContainers'][i] = {};
        objToServer['orderContainers'][i][propName] = this.editableOrder['orderContainers'][i][propName];
      });
    })

    objToServer['orderCustoms']['orderId'] = this.editableOrder['orderCustoms']['orderId'];
    objToServer['orderCustoms']['documentReceived'] = this.editableOrder['orderCustoms']['documentReceived'];
    objToServer['orderCustoms']['documentApproved'] = this.editableOrder['orderCustoms']['documentApproved'];
    objToServer['orderCustoms']['customsFileNumber'] = this.editableOrder['orderCustoms']['customsFileNumber'];
    objToServer['orderCustoms']['customesDeclarationNumber'] = this.editableOrder['orderCustoms']['customesDeclarationNumber'];
    objToServer['orderCustoms']['isScanned'] = this.editableOrder['orderCustoms']['isScanned'];

    return objToServer;
  }


  save() {
    let objToServer = {};
    this.thirdPartytoastyService.addToastDefault('wait');
    objToServer = this.prepareObjToServer();
    this.cOrdersService.editOrder(objToServer).subscribe(z => {
      console.log("Accepted");
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
    })
  }


}
