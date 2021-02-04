import { Component, OnInit } from '@angular/core';
import { OrderProcessService } from 'src/app/Shared/OrderProcess/order-process.service';
import { Subject, of } from 'rxjs';
import { Orders } from 'src/app/Shared/Orders/Orders';
import { OrderProcessManagementService } from '../order-process-management.service';
import { OrderContainers } from 'src/app/Shared/Orders/OrderContainers';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { Router } from '@angular/router';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';
import { DatePipe, formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';

@Component({
  selector: 'app-custom-process',
  templateUrl: './custom-process.component.html',
  styleUrls: ['./custom-process.component.scss']
})
export class CustomProcessComponent implements OnInit {
  lstContainers;
  TopSearchObj = {
    CustomStatus: { label: 'Pending', value: '0' },
  }
  txtSearchFilter = new FormControl("");
  FfilterOptions = [
    { label: 'Pending', value: '0' },
    { label: 'Ready', value: '1' },
    { label: 'Paid', value: '2' },
    { label: 'Recent Cleared', value: '3' },
    { label: 'Custom Payment', value: '4', needCounters: false },
  ]
  loadCard;
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
  public paggingManagerCustomPayment = {
    id: 'CustomPaymentTablePaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }

  lstOrders: Orders[] = [];
  suppliers;
  inlandShippers;
  forwarders;
  log(v) {
  }
  beforeChange($event) {
    this.TopSearchObj.CustomStatus.value = $event + '';
    if ($event != '4') {
      this.search();
    } else if ($event == '4') {
      this.intialCustomPaymentPage();
    }
  };
  updatecustomprocessstate(rowIndex) {
    var z = this.lstOrders[rowIndex].orderCustoms;
    z.inlandShipper = null;
    z.containerType = null;
    z.suplier = null;
    this.thirdPartytoastyService.addToastDefault('wait');
    this.orderProcessService.updatecustomprocessstate(z).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
    })
  }
  upDateCounter(index) {
    this.counters[index]--;
    this.counters[++index]++;
  }
  TestCaseStatus(rowIndex) {
    if (this.TopSearchObj.CustomStatus.value == '0') { // Pending Status
      if (this.lstOrders[rowIndex].orderCustoms && this.lstOrders[rowIndex].orderCustoms.documentReceived && this.lstOrders[rowIndex].orderCustoms.documentApproved && this.lstOrders[rowIndex].orderCustoms.customsFileNumber) {
        this.lstOrders.splice(rowIndex, 1);
        this.upDateCounter(this.TopSearchObj.CustomStatus.value);
      }
    }
    else if (this.TopSearchObj.CustomStatus.value == '1') { // Raedy Status
      if (this.lstOrders[rowIndex].orderCustoms, this.lstOrders[rowIndex].orderCustoms.customsPaymentDate) {
        this.lstOrders.splice(rowIndex, 1);
        this.upDateCounter(this.TopSearchObj.CustomStatus.value);
      }
    }
    else if (this.TopSearchObj.CustomStatus.value == '2') { // Paid Status
      if (this.lstOrders[rowIndex].orderCustoms, this.lstOrders[rowIndex].orderCustoms.customsPaymentDate) {
        this.lstOrders.splice(rowIndex, 1);
        this.upDateCounter(this.TopSearchObj.CustomStatus.value);
      }
    }
  }
  rowChangeDetiction(rowIndex) {
    setTimeout(() => {
      this.updatecustomprocessstate(rowIndex)
      this.TestCaseStatus(rowIndex)
    }, 100)
  }

  onIsClearedCshanged(rowIndex, $event) {
    this.lstOrders[rowIndex].orderCustoms.isCleared = $event;
    this.rowChangeDetiction(rowIndex);
  }
  onCustomsPaymentDateCshanged(rowIndex, $event) {
    this.lstOrders[rowIndex].orderCustoms.customsPaymentDate = $event;
    this.rowChangeDetiction(rowIndex);
  }
  onDocumentReceivedChanged(rowIndex, $event) {

    this.lstOrders[rowIndex].orderCustoms.documentReceived = $event;
    this.rowChangeDetiction(rowIndex);
  }
  onDocumentApprovedChanged(rowIndex, $event) {
    setTimeout(() => {
    }, 500)
    this.lstOrders[rowIndex].orderCustoms.documentApproved = $event;
    this.rowChangeDetiction(rowIndex);
  }
  onArrivalDateToPortChanged(rowIndex, $event) {
    this.lstOrders[rowIndex].arrivalDateToPort = $event;
    this.thirdPartytoastyService.addToastDefault('wait');
    this.orderProcessService.changearrivaldatetoport({ id: this.lstOrders[rowIndex].id, arrivalDateToPort: this.lstOrders[rowIndex].arrivalDateToPort }).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
    })
    // this.rowChangeDetiction(rowIndex);
  }
  customAgents;
  localCrossing;
  containers;
  isScannedOptions;
  editablePageReady = new Subject();
  isReady = {
    FirstReq: false,
    SecondReq: false,
  };
  lstIncoterms;
  AllowToEdit = false;
  constructor(private orderProcessService: OrderProcessService, private ordersService: OrdersService, public datepipe: DatePipe, private permissionsManagerService: PermissionsManagerService, private _router: Router, private orderProcessManagementService: OrderProcessManagementService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.orderProcessService.loadPageReqOrders('custom').subscribe((z: any) => {
      this.suppliers = z.supplier;
      this.lstIncoterms = z.incoterms;
      this.forwarders = z.forwarder;
      this.inlandShippers = z.inlandShipper;
      this.intialCustomPaymentPage();
      this.TopSearchObj = {
        CustomStatus: { label: 'Pending', value: '4' },
      }

      this.customAgents = z.customAgents;
      this.localCrossing = z.localCrossing.map(a => {
        return {
          value: a.originId + '',
          label: a.name
        }
      });
      this.isScannedOptions = [
        { value: '0', label: 'No' },
        { value: '1', label: 'Yes' },
      ]
      this.containers = z.containers;
      this.isReady.FirstReq = true;
      this.editablePageReady.next(0);

      this.AllowToEdit = this.permissionsManagerService.checkForPermissionInSpecificPage([{ main: 'customprocess', subAccess: ['edit'] }])

    })
    this.search();


    this.txtSearchFilter.valueChanges.subscribe(z => {
      this.search();
    })
  }
  upDateContainers(ContainerChanged) {
    this.lstOrders.forEach(order => {
      if (order.id == ContainerChanged.orderId) {
        order.orderContainers.forEach((container: OrderContainers) => {
          if (container.id == ContainerChanged.id) {
            container.isScanned = ContainerChanged.isScanned;
            container.scanningHour = ContainerChanged.scanningHour;
            container.scanByText = ContainerChanged.scanByText;

          }
        })
      }
    })
  }

  dbclickRow(i) {
    this._router.navigate(['./impostorcompany/orders/cu'], {
      queryParams: { t: 'e', i: i }
    });
  }
  ngOnInit() {
    this.editablePageReady.subscribe(z => {
      if (this.isReady.FirstReq && this.isReady.SecondReq) {
        this.lstOrders.forEach(o => {
          if (o.orderCustoms && o.orderCustoms.localCrossingId) o.orderCustoms.localCrossingId = o.orderCustoms.localCrossingId + '';
          var cont = this.containers.find(z => z.originId == Number(o.containerTypeId));
          if (cont)
            o.containerType = { name: cont.name }


          var sup = this.suppliers.find(z => z.value == o.supplierId);
          if (sup)
            o.suplier = { name: sup.label }


          var inc = this.lstIncoterms.find(z => z.originId == o.incotermsId);
          if (inc)
            o.incoterms = { name: inc.name }

          // o.orderShippings
          if (this.TopSearchObj.CustomStatus.value == '1') { //Ready Status

            if (o.orderShippings && o.orderShippings.forwarderId) {
              var forworder = this.forwarders.find(z => z.value == o.orderShippings.forwarderId);
              if (forworder)
                o.orderShippings.forwarder = { name: forworder.label }
            }

            if (o.orderCustoms && o.orderCustoms.inlandShipperId) {
              var inlandShipper = this.inlandShippers.find(z => z.value == o.orderCustoms.inlandShipperId);
              if (inlandShipper)
                o.orderCustoms.inlandShipper = { name: inlandShipper.label }
            }
          }
          if (this.TopSearchObj.CustomStatus.value == '3') {
            if (o.orderCustoms && o.orderCustoms.inlandShipperId) {
              var inlandShipper = this.inlandShippers.find(z => z.value == o.orderCustoms.inlandShipperId);
              if (inlandShipper)
                o.orderCustoms.inlandShipper = { name: inlandShipper.label }
            }
          }
        })
      }
    });


    this.orderProcessManagementService.CustomProcessOrderContainerChange.subscribe((ContainerChanged: OrderContainers) => {
      this.upDateContainers(ContainerChanged);
    })
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
        if (typeof ord.orderCustoms != 'undefined' && typeof ord.orderCustoms[datePropName] != 'undefined') {
          ord.orderCustoms[datePropName] = this.datepipe.transform(ord.orderCustoms[datePropName], dFormat);
        }
      })
    });
    return lstOrder;
  }
  search() {
    // if (this.lastStatusUpdate.status == this.TopSearchObj.CustomStatus.value && this.paggingManager.currentPage == this.lastStatusUpdate.paging || this.lastSearch == this.txtSearchFilter.value ) return;
    this.loadCard = true;
    this.orderProcessService.loadOrders(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.txtSearchFilter.value, 'custom', this.TopSearchObj.CustomStatus.value).subscribe((z: any) => {
      this.isReady.SecondReq = true;
      this.lstOrders = z.data;
      this.paggingManager.itemsPerPage = 10;
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
      this.editablePageReady.next(1);
      if (this.TopSearchObj.CustomStatus.value == '2') {
        this.lstOrders.forEach(cp => {
          if (cp.orderCustoms != null)
            cp.orderCustoms.isScanned = cp.orderCustoms.isScanned + '';
        })
        if (this.lstOrders && this.lstOrders[0] && this.lstOrders[0].orderContainers)
          this.lstContainers = this.lstOrders[0].orderContainers;
      }
      this.counters = Object.keys(z.counters).map((key, i) => {
        return z.counters[key];
      });
      this.lstOrders = this.orderProcessService.setColorStatus(this.lstOrders);
      this.lstOrders = this.OrderDateSettings(this.lstOrders);
    })
    this.lastStatusUpdate.status = this.TopSearchObj.CustomStatus.value;
    this.lastStatusUpdate.paging = this.paggingManager.currentPage;
  }
  openmodel(modalName) {
    document.querySelector(modalName).classList.add('md-show');
    document.querySelector(modalName).classList.add('largeModel');
    var model: any = document.querySelector(modalName);
    var content: any = document.querySelector('.md-content');
    content.style.width = "800px";
    // content.style.padding = "5px 0px 5px 10px";
    var _content: any = document.querySelector('.md-content div');
    _content.style.padding = "0";
    // content.style = "800px";
    // model.style.left = "40%";
  }
  pageChanged($e) {
    this.paggingManager.currentPage = $e;
    this.search();
  }
  SaveContainerEdit(lstContainers) {
    this.thirdPartytoastyService.addToastDefault('wait');
    this.orderProcessService.updatecontainerprocessstate(lstContainers).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
      lstContainers.forEach(container => {
        this.upDateContainers(container);
      })
    }, e =>
      this.thirdPartytoastyService.addToastDefault('error'))
  }
  intialCustomPaymentPage() {
    this.loadOrderCustomPaymentTable();
    this.prepareAddNewCustomPaymentModel();

    this.searchCustomPaymentTable();
  }
  lstOrdersPayments = []
  loadOrderCustomPaymentTable() {
    this.loadCard = true;
    this.ordersService.loadOrderCustomPaymentTable().subscribe((z: any) => {
      this.lstOrdersPayments = z.lstOrders;
      let TotalBalance = 0;
      this.lstOrdersPayments.forEach(z => {
        TotalBalance += z['grossTax'] ? z['grossTax'] : 0;
        z['total'] = TotalBalance;
      })
      console.log('TotalBalance', this.lstOrdersPayments);
      this.loadCard = false;

    })
  }
  addNewCustomPaymentModel;
  prepareAddNewCustomPaymentObjToServer() {
    let objToServer = this.addNewCustomPaymentModel;
    return objToServer;
  }
  lstAddNewCustomPaymentRequestErrors = [];
  checkListOrdersSelectedCustomPayment() {
    let isValid = true;
    this.lstOrdersPayments.filter(z => z.isSelected == true).forEach(z => {
      if (!z.isDoneCustomCalculation) {
        isValid = false
        this.lstAddNewCustomPaymentRequestErrors.push("Please Select Just Orders Has Been Calculated!");
      }
    })
    return isValid;
  }
  ValidateAddNewCustomPaymentRequest() {
    this.lstAddNewCustomPaymentRequestErrors = [];
    this.checkListOrdersSelectedCustomPayment();

    if (!this.addNewCustomPaymentModel.payment) {
      this.lstAddNewCustomPaymentRequestErrors.push("Please Add Payment Value!");
    }
    return this.lstAddNewCustomPaymentRequestErrors.length == 0;
  }
  addNewCustomPayment() {
    if (confirm("Are you sure!")) {
      let validSelected = this.ValidateAddNewCustomPaymentRequest();
      if (validSelected) {
        this.loadCard = true;
        let objToServer = this.prepareAddNewCustomPaymentObjToServer();
        this.ordersService.addNewCustomPayment(objToServer).subscribe(z => {
          this.loadCard = false;
          this.intialCustomPaymentPage()

        })
      }
    }
  }
  prepareAddNewCustomPaymentModel() {
    this.addNewCustomPaymentModel = {}
    this.addNewCustomPaymentModel.date = this.dateFormater(new Date());
  }
  customPaymentListCheckedChanged() {
    this.addNewCustomPaymentModel.lstOrdersCustomsBelongsIds = this.lstOrdersPayments.filter(z => z.isSelected == true).map(z => z.orderId);
    if (!this.checkListOrdersSelectedCustomPayment()) {
      alert("Please Select Just Orders Has Been Calculated!")
    } else {
      this.addNewCustomPaymentModel.totalValueSelected = this.lstOrdersPayments.filter(z => z.isSelected == true).map(z => z['grossTax'] ? Math.round(z['grossTax']) : 0).reduce((a, b) => a + b, 0);
      let str = String(Math.round(this.addNewCustomPaymentModel.totalValueSelected));
      this.addNewCustomPaymentModel.payment = Number(str.substr(0, str.length - 3)) * 1000
    }
  }
  dateFormater(date) {
    if (date) return formatDate(date, 'yyyy-MM-dd', 'en')
    else return ''
  }
  clickOnCustomsCalculation(orderId) {
    this._router.navigate([`../impostorcompany/ordercustomcalculation/${orderId}`])
  }




  prepareMakeCustomCalculationObjToServer(orderId) {
    let objToServer = {};
    objToServer['orderId'] = orderId;
    objToServer['portFees01Value'] = 0;
    objToServer['frieghtValue'] = 0;
    objToServer['other01Value'] = 0;
    objToServer['commission'] = 0;
    objToServer['other02Value'] = 0;
    return objToServer;
  }
  makeCustomCalculation(orderId) {
    //Prepare Obj To Server
    let objToServer = this.prepareMakeCustomCalculationObjToServer(orderId);
    console.log(objToServer);

    this.thirdPartytoastyService.addToastDefault('wait');
    this.ordersService.makeCustomCalculation(objToServer).subscribe(z => {
      this.loadOrderCustomPaymentTable();
      this.thirdPartytoastyService.addToastDefault('success','Edit');

    })
  }
  openOrder(i) {
    this._router.navigate(['./impostorcompany/orders/cu'], {
      queryParams: { t: 'e', i: i }
    });
  }
  lstCustomPaymentHistoryTable: any = [];
  CustomPaymentTablePagingChanged($e) {
    this.paggingManagerCustomPayment.currentPage = $e;
    this.searchCustomPaymentTable();
  }
  searchCustomPaymentTable() {
    this.ordersService.loadCustomPaymentTable(this.paggingManagerCustomPayment.currentPage - 1, this.paggingManagerCustomPayment.itemsPerPage).subscribe((z: any) => {
      this.lstCustomPaymentHistoryTable = z.data;
      console.log('lstCustomPaymentHistoryTable', this.lstCustomPaymentHistoryTable);
      this.paggingManagerCustomPayment.itemsPerPage = 10;
      this.paggingManagerCustomPayment.totalItems = z.totalElements;
    })
  }
  deletePayment(id) {
    if (confirm("Are you sure you wont to delete this payment?")) {
      this.thirdPartytoastyService.addToastDefault('wait');
      this.ordersService.deleteCustomPayment(id).subscribe(z => {
        console.log(z);
        
        this.thirdPartytoastyService.addToastDefault('success','delete');
        this.searchCustomPaymentTable();
      })
    }
  }
}
