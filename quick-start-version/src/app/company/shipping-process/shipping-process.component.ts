import { Component, OnInit } from '@angular/core';
import { OrderProcessService } from 'src/app/Shared/OrderProcess/order-process.service';
import { Subject, of } from 'rxjs';
import { Orders } from 'src/app/Shared/Orders/Orders';
import { OrderShippings } from 'src/app/Shared/Orders/OrderShippings';
import { Router } from '@angular/router';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-shipping-process',
  templateUrl: './shipping-process.component.html',
  styleUrls: ['./shipping-process.component.scss']
})
export class ShippingProcessComponent implements OnInit {

  TopSearchObj = {
    ShippingStatus: { label: 'Pending', value: 0 },
  }
  txtSearchFilter = new FormControl("");
  FfilterOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Booked', value: 1 },
    { label: 'Departured', value: 2 },
    { label: 'At Port', value: 3 },
  ]
  loadCard;
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }

  lstOrders: Orders[] = [];
  suppliers;
  inlandShippers;
  forwarders;
  upDateCounter(index) {
    this.counters[index]--;
    this.counters[++index]++;
  }
  log(v) {
    console.log(v);
  }
  beforeChange($event) {
    this.TopSearchObj.ShippingStatus.value = $event;
    console.log(this.TopSearchObj.ShippingStatus.value);
    this.search();
  };
  TestCaseStatus(rowIndex) {
    if (this.TopSearchObj.ShippingStatus.value == 0) { // Pending Status
      console.log('f > Pending Status', this.lstOrders[rowIndex].orderShippings.shippingDate, this.lstOrders[rowIndex].orderShippings.forwarderId, this.lstOrders[rowIndex].orderShippings.delayedContainerDays);
      if (this.lstOrders[rowIndex].orderShippings.shippingDate && this.lstOrders[rowIndex].orderShippings.forwarderId && this.lstOrders[rowIndex].orderShippings.delayedContainerDays) {
        console.log('sucess change det >> Pending Status');

        this.lstOrders.splice(rowIndex, 1);
        this.upDateCounter(this.TopSearchObj.ShippingStatus.value);
      }
    }
    else if (this.TopSearchObj.ShippingStatus.value == 1) { // Booked Status
      console.log('f > Booked Status', this.lstOrders[rowIndex].orderShippings.departureDate);
      if (this.lstOrders[rowIndex].orderShippings, this.lstOrders[rowIndex].orderShippings.departureDate) {
        console.log('sucess change det >> Booked Status');

        this.lstOrders.splice(rowIndex, 1);
        this.upDateCounter(this.TopSearchObj.ShippingStatus.value);
      }
    }
  }
  rowChangeDetiction(rowIndex) {
    setTimeout(() => {
      this.updateRow(rowIndex)
      this.TestCaseStatus(rowIndex)
    }, 100)
  }
  updateRow(rowIndex) {
    var z = this.lstOrders[rowIndex].orderShippings;
    this.log(JSON.stringify(z));
    z.inlandShipper = null;
    z.containerType = null;
    z.suplier = null;
    z.forwarder = null;
    this.orderProcessService.updateshippingprocessstate(z).subscribe(z => {
      console.log("updateshippingprocessstate >> Done");
    })
  }


  onShippingDateChanged(rowIndex, $event) {
    this.lstOrders[rowIndex].orderShippings.shippingDate = $event;
    this.rowChangeDetiction(rowIndex);
  }
  onDepartureDateChanged(rowIndex, $event) {
    this.lstOrders[rowIndex].orderShippings.departureDate = $event;
    this.rowChangeDetiction(rowIndex);
  }
  onArrivalDateToPortChanged(rowIndex, $event) {
    this.thirdPartytoastyService.addToastDefault('wait');
    this.orderProcessService.changearrivaldatetoport({ id: this.lstOrders[rowIndex].id, arrivalDateToPort: this.lstOrders[rowIndex].arrivalDateToPort }).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
    })
    // this.rowChangeDetiction(rowIndex);
  }
  containers;
  incoterms;
  loadingPorts;
  editablePageReady = new Subject();
  isReady = {
    FirstReq: false,
    SecondReq: false,
  };

  dbclickRow(i) {
    this._router.navigate(['./impostorcompany/orders/cu'], {
      queryParams: { t: 'e', i: i }
    });
  }
  AllowToEdit = false;
  constructor(private orderProcessService: OrderProcessService, public datepipe: DatePipe, private permissionsManagerService: PermissionsManagerService, private _router: Router, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.orderProcessService.loadPageReqOrders('shipping').subscribe((z: any) => {
      console.log(z);
      this.suppliers = z.supplier;
      this.inlandShippers = z.inlandShipper;
      this.forwarders = z.forwarder;
      this.incoterms = z.incoterms;
      this.loadingPorts = z.loadingPorts;
      this.containers = z.containers;
      this.isReady.FirstReq = true;
      this.editablePageReady.next(0);
    })
    this.search();
    this.txtSearchFilter.valueChanges.subscribe(z => {
      this.search();
    })
    this.AllowToEdit = this.permissionsManagerService.checkForPermissionInSpecificPage([{ main: 'shippingprocess', subAccess: ['edit'] }])
  }
  ngOnInit() {
    this.editablePageReady.subscribe(z => {
      console.log(this.suppliers);
      if (this.isReady.FirstReq && this.isReady.SecondReq) {
        this.lstOrders.forEach((o: Orders) => {
          var cont = this.containers.find(z => z.originId == Number(o.containerTypeId));
          if (cont)
            o.containerType = { name: cont.name }



          var sup = this.suppliers.find(z => z.value == o.supplierId);
          if (sup)
            o.suplier = { name: sup.label }

          if (o.orderShippings) {
            var forworder = this.forwarders.find(z => z.value == o.orderShippings.forwarderId);
            if (forworder)
              o.orderShippings.forworder = { name: forworder.label }
          }


          var tmpIncoterm = this.incoterms.find(z => z.originId == Number(o.incotermsId));
          console.log('tmpIncoterm', o.incotermsId, tmpIncoterm, this.incoterms);
          if (tmpIncoterm)
            o.incoterms = { name: tmpIncoterm.name };

          var tmploadingPort = this.loadingPorts.find(z => z.originId == Number(o.loadingPortId));
          if (tmploadingPort)
            o.loadingPort = { name: tmploadingPort.name };
        })
      }
    });
  }

  lastStatusUpdate = {
    status: null,
    paging: null
  };
  counters = {}
  OrderDateSettings(lstOrder) {
    let dFormat = 'yyyy-MM-dd';
    let lstPropsDateNames = ['arrivalDateToPort', 'documentApproved', 'documentReceived', 'customsPaymentDate', 'isCleared']
    lstOrder.forEach(ord => {
      lstPropsDateNames.forEach(datePropName => {
        if (typeof ord[datePropName] != 'undefined') {
          ord[datePropName] = this.datepipe.transform(ord[datePropName], dFormat);
        }
        if (typeof ord.orderShippings != 'undefined' && typeof ord.orderShippings[datePropName] != 'undefined') {
          ord.orderCustoms[datePropName] = this.datepipe.transform(ord.orderCustoms[datePropName], dFormat);
        }
      })
    });
    return lstOrder;
  }
  search() {
    // if (this.lastStatusUpdate.status == this.TopSearchObj.ShippingStatus.value && this.paggingManager.currentPage == this.lastStatusUpdate.paging) return;

    this.loadCard = true;
    this.orderProcessService.loadOrders(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.txtSearchFilter.value, 'shipping', "", this.TopSearchObj.ShippingStatus.value).subscribe((z: any) => {
      console.log(z);
      this.isReady.SecondReq = true;
      this.lstOrders = z.data;
      this.paggingManager.itemsPerPage = 10;
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
      this.editablePageReady.next(1);
      this.counters = Object.keys(z.counters).map((key, i) => {
        return z.counters[key];
      });
      this.lstOrders = this.orderProcessService.setColorStatus(this.lstOrders);
      this.lstOrders = this.OrderDateSettings(this.orderProcessService.setColorStatus(this.lstOrders));
    })
    this.lastStatusUpdate.status = this.TopSearchObj.ShippingStatus.value;
    this.lastStatusUpdate.paging = this.paggingManager.currentPage;


  }
  pageChanged($e) {
    console.log($e);
    this.paggingManager.currentPage = $e;
    this.search();
  }

}
