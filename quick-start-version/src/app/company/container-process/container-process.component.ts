import { Component, OnInit } from '@angular/core';
import { OrderProcessService } from 'src/app/Shared/OrderProcess/order-process.service';
import { Subject, of } from 'rxjs';
import { Orders } from 'src/app/Shared/Orders/Orders';
import { OrderManagementService } from '../orders/order-management.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { Router } from '@angular/router';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';
import { DatePipe, formatDate } from '@angular/common';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { CompanyPreDefinedAutoDataService } from '../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
import { SystemApiKeys } from 'src/app/Shared/Enums/SystemApiKeys';
import { CompanyPreDefinedAutoData } from '../shared/CompanyPreDefinedAutoData/CompanyPreDefinedAutoData';
import { CompanyUsersManagerService } from 'src/app/Shared/CompanyUsersManager/company-users-manager.service';
import { InlandShipperAuth } from 'src/app/Shared/InlandShipperAuth/InlandShipperAuth';
import { TruckPayment } from 'src/app/Shared/Orders/TruckPayment';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-container-process',
  templateUrl: './container-process.component.html',
  styleUrls: ['./container-process.component.scss']
})
export class ContainerProcessComponent implements OnInit {
  constructor(private orderProcessService: OrderProcessService, private companyUsersManagerService: CompanyUsersManagerService, public datepipe: DatePipe, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService, private permissionsManagerService: PermissionsManagerService, private _router: Router, private orderManagementService: OrderManagementService, private thirdPartytoastyService: ThirdPartytoastyService, private ordersService: OrdersService) {
    this.orderProcessService.loadPageReqOrders('container').subscribe((z: any) => {
      this.suppliers = z.supplier;
      this.inlandShippers = z.inlandShipper;
      this.incoterms = z.incoterms;
      this.forwarders = z.forwarder;
      this.containerTypes = z.containers;
      this.isReady.FirstReq = true;
      this.editablePageReady.next(0);
    })
    this.search();
    this.txtSearchFilter.valueChanges.subscribe(z => {
      this.search();
    })
    this.AllowToEdit = this.permissionsManagerService.checkForPermissionInSpecificPage([{ main: 'containerprocess', subAccess: ['edit'] }])
  }
  AllowToEdit = false;
  TopSearchObj = {
    ContainerStatus: { label: 'In Transit', value: 0 },
  }
  FfilterOptions = [
    { label: 'In Transit', value: 0 },
    { label: 'At Port', value: 1 },
    { label: 'In Trucks', value: 2 },
    { label: 'At Company', value: 3 },
    { label: 'Delayed', value: 4 },
    { label: 'truck payment', value: 5 },

  ]
  loadCard;
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
  txtSearchFilter = new FormControl("");
  lstOrders: Orders[] = [];
  suppliers;
  suppliersNames = [];
  inlandShippers;
  inlandShippersNames = [];
  forwarders;
  incoterms;
  containerTypesNames = [];
  portsNames = [];
  currencyNames = [];
  //payments
  payment = new TruckPayment();
  inlandShipperAuth = new InlandShipperAuth()
  paymentActions = 1;
  Options = [];
  totalRate = []
  truckPayments = [];
  truckPaymentDetails = new TruckPayment();
  PayedContainers = [];
  lstWarehouses = [];
  log(v) {
  }
  resetPayment() {
    this.payment = new TruckPayment();
    this.inlandShipperAuth = new InlandShipperAuth()
    this.Options = [];
    this.totalRate = []
    this.truckPayments = [];
    this.truckPaymentDetails = new TruckPayment();
    this.payment.paymentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') + "";
    this.payment.totalRate = 0;
  }
  beforeChange($event) {
    this.paymentActions = 1;
    this.TopSearchObj.ContainerStatus.value = $event;
    if (this.TopSearchObj.ContainerStatus.value == 5 && this.paymentActions == 3) {
      this.paggingManager.itemsPerPage = 100 * 10;
    } else {
      this.paggingManager.itemsPerPage = 10;
    }
    console.log("Change", this.TopSearchObj.ContainerStatus.value);
    this.search();

  };
  getContainersInTheSameOrder(rowIndex) {
    var orderId = this.lstOrders[rowIndex].id;
    var containers = [];
    this.lstOrders.forEach(order => {
      if (order.id == orderId)
        containers.push(...order.orderContainers);
    });
    return containers;
  }
  deleteContainers(lstContainers) {
    var len = this.lstOrders.length;
    for (var i = 0; i < len; i++) {
      var o = [];
      if (typeof this.lstOrders[i] == 'undefined') continue;
      o = this.lstOrders[i].orderContainers;
      var container = lstContainers.find(z => z.id == o[0].id);
      if (container) {
        this.lstOrders.splice(i, 1);
        i--;
        this.upDateCounter(this.TopSearchObj.ContainerStatus.value);
      }
    }
  }
  dbclickRow(i) {
    this._router.navigate(['./impostorcompany/orders/cu'], {
      queryParams: { t: 'e', i: i }
    });
  }

  updatecontainerprocessstate(lstContainers) {
    this.thirdPartytoastyService.addToastDefault('wait');
    this.orderProcessService.updatecontainerprocessstate(lstContainers).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
    })
  }
  upDateCounter(index) {
    this.counters[index]--;
    this.counters[++index]++;
  }
  TestCaseStatus(rowIndex) {
    var lstContainers = [];
    lstContainers.push(...this.lstOrders[rowIndex].orderContainers);
    if (this.TopSearchObj.ContainerStatus.value == 0) { // Pending Status
      var lstContainers = [];
      let numContainersInTheSameOrder = this.getContainersInTheSameOrder(rowIndex)
      if (numContainersInTheSameOrder.length > 1) {
        var isAll = confirm(`This Order Contains ${numContainersInTheSameOrder.length} container \n Do you won't update them all?`);
        if (isAll) {
          lstContainers = numContainersInTheSameOrder;
        } else {
          lstContainers.push(...this.lstOrders[rowIndex].orderContainers);
        }
      } else {
        lstContainers.push(...this.lstOrders[rowIndex].orderContainers);
      }
      var o = [];
      o = this.lstOrders[rowIndex].orderContainers;
      if (lstContainers && lstContainers.length > 0 && o[0].actualArrival) {
        lstContainers.forEach(z => { //init status value for all
          z.actualArrival = o[0].actualArrival;
          z.inlandShipper = null;
        })
        this.updatecontainerprocessstate(lstContainers);
        this.deleteContainers(lstContainers);
      }
    }
    else if (this.TopSearchObj.ContainerStatus.value == 1) { // Pending Status
      var o = [];
      o = this.lstOrders[rowIndex].orderContainers;
      if (lstContainers && lstContainers.length > 0 && o[0].exitDate) {
        lstContainers.forEach(z => { //init status value for all
          z.exitDate = o[0].exitDate;
          z.inlandShipper = null;
        })

        this.updatecontainerprocessstate(lstContainers);
        this.deleteContainers(lstContainers);
      }
    }
    else if (this.TopSearchObj.ContainerStatus.value == 2) { // Pending Status
      var o = [];
      o = this.lstOrders[rowIndex].orderContainers;
      if (lstContainers && lstContainers.length > 0 && o[0].arrivalDateToCompany) {
        lstContainers.forEach(z => { //init status value for all
          z.arrivalDateToCompany = o[0].arrivalDateToCompany;
          z.inlandShipper = null;
        })
        this.updatecontainerprocessstate(lstContainers);
        this.setIdsText();
        // this.deleteContainers(lstContainers);
      }
      if (lstContainers && lstContainers.length > 0 && o[0].warehousesId) {
        lstContainers.forEach(z => { //init status value for all
          z.warehousesId = o[0].warehousesId;
          z.inlandShipper = null;
        })
        this.updatecontainerprocessstate(lstContainers);
      }
      if (o[0].arrivalDateToCompany && o[0].warehousesId) {
        this.deleteContainers(lstContainers);
      }
    }
    else if (this.TopSearchObj.ContainerStatus.value == 3 || this.TopSearchObj.ContainerStatus.value == 4) { // Pending Status
      var o = [];
      o = this.lstOrders[rowIndex].orderContainers;
      if (lstContainers && lstContainers.length > 0 && o[0].returnedDateToPort) {
        lstContainers.forEach(z => { //init status value for all
          z.returnedDateToPort = o[0].returnedDateToPort;
          z.inlandShipper = null;
        })

        this.updatecontainerprocessstate(lstContainers);
        if (this.TopSearchObj.ContainerStatus.value == 3) {
          this.deleteContainers(lstContainers);
        }
      }
    }

  }

  rowChangeDetiction(rowIndex) {
    setTimeout(() => {
      var lstContainers = [];
      lstContainers.push(...this.lstOrders[rowIndex].orderContainers);
      lstContainers.forEach(z => {
        z.inlandShipper = null;
      })
      this.updatecontainerprocessstate(lstContainers);
      this.TestCaseStatus(rowIndex)
    }, 100)
  }
  onActualArrivalChanged(rowIndex, $event) {
    var o = [];
    o = this.lstOrders[rowIndex].orderContainers;
    if (typeof this.lstOrders[rowIndex].orderContainers != 'undefined')
      o[0].actualArrival = $event;
    this.TestCaseStatus(rowIndex);
  }
  onExitDateChanged(rowIndex, $event) {
    var o = [];
    o = this.lstOrders[rowIndex].orderContainers;
    if (typeof this.lstOrders[rowIndex].orderContainers != 'undefined')
      o[0].exitDate = $event;
    this.TestCaseStatus(rowIndex);
  }
  onArrivalDateToCompanyChanged(rowIndex, $event) {
    var o = [];
    o = this.lstOrders[rowIndex].orderContainers;
    if (typeof this.lstOrders[rowIndex].orderContainers != 'undefined')
      o[0].arrivalDateToCompany = $event;
    this.TestCaseStatus(rowIndex);
  }
  onReturnedDateToPortChanged(rowIndex, $event) {
    var o = [];
    o = this.lstOrders[rowIndex].orderContainers;
    if (typeof this.lstOrders[rowIndex].orderContainers != 'undefined')
      o[0].returnedDateToPort = $event;
    this.TestCaseStatus(rowIndex);
  }
  InlandShipperChangeDetiction(rowIndex) {
    this.TestCaseStatus(rowIndex);
  }
  onArrivalDateToPortChanged(rowIndex, $event) {
    this.lstOrders[rowIndex].arrivalDateToPort = $event;
    var orderArrivalDateToPort = this.lstOrders[rowIndex].arrivalDateToPort;
    this.thirdPartytoastyService.addToastDefault('wait');
    this.orderProcessService.changearrivaldatetoport({ id: this.lstOrders[rowIndex].id, arrivalDateToPort: this.lstOrders[rowIndex].arrivalDateToPort }).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
      this.lstOrders.forEach(z => {
        if (z.id == this.lstOrders[rowIndex].id) {
          z.arrivalDateToPort = orderArrivalDateToPort;
        }
      })
    })
  }
  customAgents;
  localCrossing;
  containers;
  containerTypes;
  tupleTypes;
  editablePageReady = new Subject();
  isReady = {
    FirstReq: false,
    SecondReq: false,
  };
  setIdsText() {
    if (this.isReady.FirstReq && this.isReady.SecondReq) {
      for (var i = 0; i < this.lstOrders.length; i++) {
        var o = this.lstOrders[i];
        var sup = this.suppliers.find(z => z.value == o.supplierId);
        if (sup)
          o.suplier = { name: sup.label }

        var cont = this.containerTypes.find(z => z.originId == Number(o.containerTypeId));
        if (cont)
          o.containerType = { name: cont.name }

        var tmpIncoterm = this.incoterms.find(z => z.originId == Number(o.incotermsId));
        if (tmpIncoterm)
          o.incoterms = { name: tmpIncoterm.name };


        if (o.orderShippings && o.orderShippings.forwarderId) {
          var forw = this.forwarders.find(z => z.value == o.orderShippings.forwarderId);
          if (forw)
            o.orderShippings.forwarder = { name: forw.label }
        }

        if (this.TopSearchObj.ContainerStatus.value != 0) {
          if (o.orderContainers && o.orderContainers.length > 0) {
            var d = [];
            d = o.orderContainers;
            var inlan = this.inlandShippers.find(z => z.value == d[0].inlandShipperId);
            if (inlan) {
              var d1: any = [];
              d1 = o.orderContainers;
              d1[0].inlandShipper = { name: inlan.label }
              o.orderContainers = d1;
            }
          }
        }
        this.lstOrders[i] = o;
      }
    }
  }
  editContainerName = "";
  ngOnInit() {
    this.editablePageReady.subscribe(z => {
      this.setIdsText();
    });
    this.orderManagementService.changeContainersOrderDetectionPartial.subscribe((z: any) => {
      var rowIndex = z.rowIndex;
      var o = [];
      o = this.lstOrders[rowIndex].orderContainers;
      document.querySelector('#modal-8').classList.remove('md-show');
      if (z.type == "Edit") {
        o = this.lstOrders[rowIndex].orderContainers;
        o[0] = z.value;
        this.rowChangeDetiction(rowIndex);
      }
    })
    this.loadOptionsFirst();
    this.refreshOptions();
    this.ordersService.initOrderPage().subscribe((z: any) => {
      z.warehouses.forEach(element => {
        this.lstWarehouses[element.id] = element.name;
      });
    });

    this.payment.paymentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') + "";
    this.payment.totalRate = 0;
    this.tupleTypes = TupleTypes;


  }
  openmodel(rowIndex) {
    var o = [];
    o = this.lstOrders[rowIndex].orderContainers;
    if (typeof this.lstOrders[rowIndex].orderContainers == 'undefined') return;
    var row = o[0];

    this.orderManagementService.changeContainersPageInit.next({
      initObj: row, editMode: {
        value: 'true',
        comeFrom: 'container-process',
        rowIndex: rowIndex
      }
    })
    this.editContainerName = row.containerNumber;
    document.querySelector('#modal-8').classList.add('md-show');
    document.querySelector('#modal-8').classList.add('largeModel');
    var model: any = document.querySelector('#modal-8');
    var content: any = document.querySelector('.md-content');
    content.style.width = "1000px";
    model.style.left = "40%";
  }
  containersForPayment = [];
  openmodelPayments(rowIndex) {

    if (typeof this.truckPayments == 'undefined') return;
    this.truckPaymentDetails = this.truckPayments[rowIndex];
    this.truckPaymentDetails.paymentDate = formatDate(this.truckPaymentDetails.paymentDate, 'yyyy-MM-dd', 'en') + "";
    this.orderProcessService.loadOrdersForTruckPayments(this.truckPayments[rowIndex].truckPaymentId).subscribe((z: any) => {
      this.containersForPayment = z.data;
    })
    document.querySelector('#modal-9').classList.add('md-show');
    document.querySelector('#modal-9').classList.add('largeModel');
    var model: any = document.querySelector('#modal-9');
    var content: any = document.querySelector('.md-content');
    content.style.width = "1000px";
    model.style.left = "40%";
  }

  lastStatusUpdate = {
    status: null,
    paging: null
  };
  counters = {};
  OrderDateSettings(lstOrder) {
    let dFormat = 'yyyy-MM-dd';
    let lstPropsDateNames = ['arrivalDateToPort', 'returnedDateToPort', 'actualArrival', 'exitDate']
    lstOrder.forEach(ord => {
      lstPropsDateNames.forEach(datePropName => {
        if (typeof ord[datePropName] != 'undefined') {
          ord[datePropName] = this.datepipe.transform(ord[datePropName], dFormat);
        }
        if (typeof ord.orderContainers[0] != 'undefined' && typeof ord.orderContainers[0][datePropName] != 'undefined') {
          ord.orderContainers[0][datePropName] = this.datepipe.transform(ord.orderContainers[0][datePropName], dFormat);
        }
      })
    });
    return lstOrder;
  }
  search(inlandShipper?) {
    // if (this.lastStatusUpdate.status == this.TopSearchObj.ContainerStatus.value && this.paggingManager.currentPage == this.lastStatusUpdate.paging) return;

    this.loadCard = true;
    this.orderProcessService.loadOrders(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage,this.txtSearchFilter.value, 'container', 0, 0, this.TopSearchObj.ContainerStatus.value, inlandShipper).subscribe((z: any) => {
      this.isReady.SecondReq = true;
      this.lstOrders = z.data.map(z => {
        let order = z.order;
        order.orderContainers = [];
        order.orderContainers.push(z);
        return order;
      });
      this.lstOrders.forEach(element => {
        element.orderContainers.forEach((element1: any) => {
          element1.order = null;

        });
      });

      this.lstOrders = this.OrderDateSettings(this.lstOrders);
      this.counters = Object.keys(z.counters).map((key, i) => {
        return z.counters[key];
      });

      // this.paggingManager.itemsPerPage = 10;
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
      this.editablePageReady.next(1);
    })

    this.lastStatusUpdate.status = this.TopSearchObj.ContainerStatus.value;
    this.lastStatusUpdate.paging = this.paggingManager.currentPage;
  }
  pageChanged($e) {
    this.paggingManager.currentPage = $e;
    this.search();
  }



  //payments 
  changePaymentAction(action) {
    this.paymentActions = action;
    this.resetPayment();
    if (action == 3) { this.paggingManager.itemsPerPage = 1000; }
    else { this.paggingManager.itemsPerPage = 10; }
    this.search();


  }
  addTruckPayment() {
    this.payment.currencyId = this.inlandShipperAuth.currencyId;
    this.orderProcessService.addTruckPayment(this.payment).subscribe((z: any) => {
      let i = 0;
      this.PayedContainers.forEach(element => {
        element.truckPaymentId = z.truckPaymentId
        element.actualRate = this.totalRate[i];
        i++;
        element.inlandShipper = null;
      })

      this.PayedContainers.forEach((element) => {
        let c = [element];
        if (element.actualRate)
          this.orderProcessService.updatecontainerprocessstate(c).subscribe((z: any) => {
          })
      })
      this.getTruckPayments();
      this.resetPayment();
      this.changePaymentAction(2);
    })
  }
  getTruckPayments() {
    this.loadCard = true;

    this.orderProcessService.getTruckPayments(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage).subscribe((z: any) => {
      this.truckPayments = z.data;
      this.paggingManager.totalItems = z.totalElements;
      this.editablePageReady.next(1);

    })
    this.lastStatusUpdate.status = this.TopSearchObj.ContainerStatus.value;
    this.lastStatusUpdate.paging = this.paggingManager.currentPage;
    this.loadCard = false;

  }
  getInlandShipperContract() {
    if (this.payment.inlandShipperId != undefined) {
      this.loadCard = true;
      this.totalRate = []
      this.updateInlanshipperContainer(this.payment.inlandShipperId)
      this.companyUsersManagerService.updateuser(this.payment.inlandShipperId).subscribe((z: any) => {
        this.inlandShipperAuth.scanningRate = z.inlandShipperAuth.scanningRate;
        this.inlandShipperAuth.dangerousRate = z.inlandShipperAuth.dangerousRate;
        this.inlandShipperAuth.currencyId = z.inlandShipperAuth.currencyId + "";
        this.loadOptions(this.tupleTypes['Currency']);
      })
    }
  }
  updateInlanshipperContainer(inlanshipperId) {
    this.loadCard = true;

    //i had to rewrite the search fun cuz its not working when i call it !
    this.orderProcessService.loadOrders(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, 'container', 0, 0, this.TopSearchObj.ContainerStatus.value, inlanshipperId).subscribe((z: any) => {
      this.isReady.SecondReq = true;
      this.lstOrders = z.data.map(z => {
        let order = z.order;
        order.orderContainers = [];
        order.orderContainers.push(z);
        return order;
      });
      this.lstOrders.forEach(element => {
        element.orderContainers.forEach((element1: any) => {
          element1.order = null;
        });
      });


      this.lstOrders = this.OrderDateSettings(this.lstOrders);
      this.counters = Object.keys(z.counters).map((key, i) => {
        return z.counters[key];
      });
      this.PayedContainers = [];
      this.lstOrders.forEach(element => {
        element.orderContainers.forEach((element1: any) => {
          this.PayedContainers.push(element1);
        });
      });
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
      this.editablePageReady.next(1);
    })

    this.lastStatusUpdate.status = this.TopSearchObj.ContainerStatus.value;
    this.lastStatusUpdate.paging = this.paggingManager.currentPage;

    this.loadCard = false;

  }
  getContainersRate(inlandShipperId) {
    this.orderProcessService.getContainersRate(inlandShipperId).subscribe((z: any) => {
      var index = 0;
      this.lstOrders.forEach(element => {
        element.orderContainers.forEach((element1: any) => {
          z.forEach(element2 => {

            if (element2.containerTypeId == element1.containerTypeId && element2.dischargePortId == element.orderGenerals.dischargePortId
              && element2.warehouseId == element1.warehousesId) {

              element1.actualRate = element2.rate;
              this.calculateTotalRate(element2.rate, index, element1.goodDangerous, element1.isScanned);
            }
          });
          index = index + 1;
        });
      });
    })

  }
  calculateTotalRate(rate, index, isDangerous, isScanned) {
    this.totalRate[index] = rate;
    if (isDangerous)
      this.totalRate[index] = this.totalRate[index] + this.inlandShipperAuth.dangerousRate;
    if (isScanned)
      this.totalRate[index] = this.totalRate[index] + this.inlandShipperAuth.scanningRate;
    let total = 0;
    this.totalRate.forEach((rateValue) => {
      total = total + rateValue;
    })
    this.payment.totalRate = total;
  }

  lstInlandShippers;
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      z.autoComplete.forEach(itm => {
        this.lstInlandShippers = z.inlandShippers;
      });
      this.lstInlandShippers.forEach(element => {
        this.inlandShippersNames[element.value] = element.label;
      });
      z.suppliers.forEach(element => {
        this.suppliersNames[element.value] = element.label;
      });

    });
  }
  loadOptions(tupleTypes: TupleTypes, lsts?) {
    if (typeof this.Options[tupleTypes] == 'undefined') {
      this.loadCard = true;
      this.refreshOptions(lsts);
    } else {
      this.loadCard = false;
    }
  }
  refreshOptions(lsts?) {
    this.Options = [];
    if (typeof lsts == 'undefined' || lsts == null) {
      this.companyPreDefinedAutoDataService.loadallcompanypredefined(SystemApiKeys.Nothing).subscribe((z: CompanyPreDefinedAutoData[]) => {
        z.forEach(itm => {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
          this.loadCard = false;
          if (itm.tupleType == this.tupleTypes['Container Type']) {
            this.containerTypesNames[itm.originId] = itm.name;
          }
          if (itm.tupleType == this.tupleTypes['Discharge Destination Port'] || itm.tupleType == this.tupleTypes['Loading Port']) {
            this.portsNames[itm.originId] = itm.name;
          }
          if (itm.tupleType == this.tupleTypes['Currency']) {
            this.currencyNames[itm.originId] = itm.name;
          }

        });
      });
    } else {
      lsts.forEach(itm => {
        if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
        this.Options[itm.tupleType].push({
          value: '' + itm.originId,
          label: itm.name
        });
        this.loadCard = false;
      });
      this.Options[0] = [];
    }
  }
}
