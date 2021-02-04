import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Orders } from 'src/app/Shared/Orders/Orders';
import { OrderCustoms } from 'src/app/Shared/Orders/OrderCustoms';
import { OrderProcessService } from 'src/app/Shared/OrderProcess/order-process.service';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {
  public GeneralOrder;
  public ShippingOrder;
  public CustomOrder: OrderCustoms;
  public ContainersOrder;
  public ItemsOrder;
  public currency;
  public lastContainerInfo;
  public maininlandShipperId;
  public EditableOrderId = null;
  public isChaged = false;
  rest() {
    this.isChaged = false;
    this.GeneralOrder = {};
    this.ShippingOrder = {};
    this.CustomOrder = new OrderCustoms;
    this.ContainersOrder = [];
    this.ItemsOrder = [];
    this.currency = {};
    this.lastContainerInfo = {};
    this.maininlandShipperId = '';
  }
  constructor(private router: Router, private permissionsManagerService: PermissionsManagerService) {


    let z = this.fileds;
    Object.keys(z['main']).forEach(key => {
      z['main'][key]['editable'] = false;
    })



    this.maininlandShipperIdChange.subscribe(newInlandShipperId => {
      this.maininlandShipperId = newInlandShipperId;
    })
    this.changeContainersOrderDetection.subscribe((z: any) => {
      this.ContainersOrder = z;
    })
    this.changeItemsOrderDetection.subscribe(z => {
      this.ItemsOrder = z;

    })
    this.changeItemsOrderDetection.subscribe(z => {
      this.ItemsOrder = z;
      console.log('ItemsOrder', this.ItemsOrder);

    })
    this.changeContainersOrderDetection.subscribe(z => {

      this.ContainersOrder = z;
      console.log("after changeContainersOrderDetection", this.ContainersOrder);
    })
    this.setOrderEditable.subscribe((z: Orders) => {
      this.GeneralOrder = this.EmptyToNulls(z.orderGenerals);
      this.ShippingOrder = this.EmptyToNulls(z.orderShippings);
      if (this.ShippingOrder != null)
        this.ContainerInitForFirstContainer.delayedContainersDays = this.ShippingOrder.delayedContainerDays;
      this.ContainersOrder = this.EmptyToNulls(z.orderContainers);
      this.ItemsOrder = this.EmptyToNulls(z.orderItems);
      this.CustomOrder = this.EmptyToNulls(z.orderCustoms);
      if (this.CustomOrder != null)
        this.maininlandShipperId = this.CustomOrder.inlandShipperId;

    })
  }

  PrepareProp(itm) {
    if (itm != null)
      Object.keys(itm).forEach(propName => {
        itm[propName] = typeof itm[propName] == 'undefined' || itm[propName] == null || itm[propName] == 'null' ? '' : itm[propName];
      });
    return itm;
  }
  stringIds(z) {
    if (z != null)
      Object.keys(z).forEach(prop => {
        z[prop] = Number.isNaN(Number(z[prop])) && z[prop] != null && z[prop] != 'null' ? z[prop] : z[prop] + '';
      })
    return z;
  }
  EmptyToNulls(z) {
    if (z != null)
      Object.keys(z).forEach(prop => {
        z[prop] = z[prop] == "" || z[prop] == "undefined" ? null : z[prop];
      })
    return z;
  }
  public changeContainersOrderDetectionPartial = new Subject();
  public changeContainersOrderDetection = new Subject();
  public changeItemsOrderDetection = new Subject();
  public changeContainersPageInit = new Subject();
  public setOrderEditable = new Subject();
  public maininlandShipperIdChange = new Subject();
  public ContainerInitForFirstContainer = {
    delayedContainersDays: null,
    containerTypeId: null
  };
  public MakeSaveForOrderOutSideTheMainOrderComponent = new Subject();


  fileds = {
    main: {
      'supplierId': { validation: Validators.compose([Validators.required]) },
      'numberOfContainers': { validation: Validators.compose([Validators.required]) },
      'loadingPortId': { validation: Validators.compose([Validators.required]) },
      'orderCreationDate': { validation: Validators.compose([Validators.required]) },
      'containerTypeId': { validation: Validators.compose([Validators.required]) },
      'currencyId': { validation: Validators.compose([Validators.required]) },
      'shippingType': {},
      'orderDescription': { validation: Validators.compose([Validators.required]) },
      'incotermsId': { validation: Validators.compose([Validators.required]) },
      'arrivalDateToPort': { validation: Validators.compose([Validators.required]) },
      'orderGenerals': {},
      'orderShippings': {},
      'orderCustoms': {},
      'orderContainers': {},
      'orderItems': {},
      'orderPriority': { validation: Validators.compose([Validators.required]) },
      'performaId': {},
      'createDate': {},
    },
    orderGenerals: {
      'orderRefrence': {},
      'originOfGoods': {},
      'exportCountryId': {},
      'paymentTerms': {},
      'readyDate': {},
      'orderIsUrgent': {},
      'transshipmentAllowed': {},
      'netWeight': {},
      'totalWeight': {},
      'numberOfPackages': {},
      'cubicVolume': {},
      'destinationPortId': {},
      'dischargePortId': {},
      'warehousesId': {validation: Validators.compose([Validators.required])}
    },
    'orderShippings': {
      'orderShippingsStatus': {},
      'shippingCompanyRefrence': {},
      'openingShippingOrderDate': {},
      'departureDate': {},
      'shippingDate': {},
      'forwarderId': {},
      'shippingLine': {},
      'foreignAgent': {},
      'delayedContainerDays': {},
      'bOLNo': {},
      'vessel': {},
      'isDirectShipping': {},
      'shippingPrice': {},
      'craneFees': {},
      'deliveryCost': {}
    },
    orderCustoms: {
      'customsAgentId': {},
      'documentReceived': {},
      'documentApproved': {},
      'customsFileOpeningDate': {},
      'customsFileNumber': {},
      'agentPaymentDate': {},
      'localCrossingId': {},
      'inlandShipperId': {},
      'customesDeclarationNumber': {},
      'customsPaymentDate': {},
      'isCleared': {},
    },
    orderContainers: {
      containerNumber: {},
      delayedContainersDays: {},
      netWeight: {},
      goodsDescription: {},
      containerTypeId: {},
      inlandShipperId: {},
      sealNumber: {},
      totalWeight: {},
      goodDangerous: {},
      isScanned: {},
      scanningHour: {},
      scanByText: {},
      returnedDateToPort: {},
      arrivalDateToCompany: {},
      arrivalTruckNumber: {},
      arrivalHourToCompany: {},
      supervisorGaurd: {},
      actualArrival: {},
      exitDate: {},
      warehousesId: {},
      actualRate: {},
      truckPaymentId: {}
    },
    orderItems: {
      name: {}, quantity: {}, unitId: {}, price: {}, currencyId: {}, note: {}, totalPrice: {}, dispatchedQuantity: {}
    }
  }
  // validationLayer = {
  //   'main': {
  //     "supplierId": Validators.compose([Validators.required]),
  //     "numberOfContainers": Validators.compose([Validators.required]),
  //     "loadingPortId": Validators.compose([Validators.required]),
  //     "orderCreationDate": Validators.compose([Validators.required]),
  //     "containerTypeId": Validators.compose([Validators.required]),
  //     "currencyId": Validators.compose([Validators.required]),
  //     "orderDescription": Validators.compose([Validators.required]),
  //     "incotermsId": Validators.compose([Validators.required]),
  //     "arrivalDateToPort": Validators.compose([Validators.required]),
  //     "orderPriority": Validators.compose([Validators.required]),
  //   },
  // }
  prepareFieldsSetDefailt(pagePart, obj) {
    Object.keys(this.fileds[pagePart]).forEach(propKey => {
      this.fileds[pagePart][propKey].show = obj.show;
      this.fileds[pagePart][propKey].editable = obj.editable;
    });
  }
  /*
    @param prop  show , editable 
  */
  setFiledsShowEditableValue(pagePart, filedsPart, prop, TF) {
    Object.keys(this.fileds[pagePart]).forEach(propKey => {
      this.fileds[pagePart][propKey][prop] = TF;
    });
  }
  /**
     * @param sequanceString  "all" || "" || "supplierId,...."
     * @param prop => show || editable
     */
  changeShowEditableBasedOnLstString(pagePart, sequanceString: string, prop, val) {
    if (sequanceString == "all") {
      this.setFiledsShowEditableValue(pagePart, this.fileds[pagePart], prop, val);
    } else if (sequanceString != "") {
      Object.keys(this.fileds[pagePart]).forEach(propKey => {
        if (sequanceString.indexOf(propKey) != -1) {
          this.fileds[pagePart][propKey][prop] = val;
        }
      });
    }
  }


  removeValidationLayer(pagePart, sequanceString: string, prop, val) {
    if (sequanceString == "all") {
      this.setFiledsShowEditableValue(pagePart, this.fileds[pagePart], prop, val);
    } else if (sequanceString != "") {
      Object.keys(this.fileds[pagePart]).forEach(propKey => {
        if (sequanceString.indexOf(propKey) == -1) {
          this.fileds[pagePart][propKey][prop] = val;
        }
      });
    }
  }
  /**
     * @param sequanceString  "all" || "" || "supplierId,...."
     * @param prop => show || editable
     */
  removeValidationLayerFromNONEditable(pagePart) {
    Object.keys(this.fileds[pagePart]).forEach(propKey => {
      if (this.fileds[pagePart][propKey]['editable'] == false) {
        this.fileds[pagePart][propKey]['validation'] = Validators.compose([]);
      }
    });
  }


  /*
    @param pageFor  add,edit,show ..
  */
  getOrderPartsFileds(pagePart, pageFor, fullProp = false) {
    let PropsPermissions = {};
    if (this.permissionsManagerService.roleMatch(['ImpostorCompany']) || fullProp) { // For Admin
      this.prepareFieldsSetDefailt(pagePart,
        {
          show: true,
          editable: null
        });
    } else {
      if (pageFor == 'edit') {
        var showViewModel = JSON.parse(this.permissionsManagerService.getViewModel('orders', 'show'))[pagePart];
        var editViewModel = JSON.parse(this.permissionsManagerService.getViewModel('orders', 'edit'))[pagePart];

        //init all is allow to show and editable
        this.prepareFieldsSetDefailt(pagePart, { show: false, editable: 'disabled' });

        this.changeShowEditableBasedOnLstString(pagePart, showViewModel, 'show', true);
        this.changeShowEditableBasedOnLstString(pagePart, editViewModel, 'editable', null);

        this.removeValidationLayerFromNONEditable(pagePart);
      } else if (pageFor == 'add') {
        var showViewModel = JSON.parse(this.permissionsManagerService.getViewModel('orders', 'add'))[pagePart];

        this.changeShowEditableBasedOnLstString(pagePart, showViewModel, 'show', true);
        this.changeShowEditableBasedOnLstString(pagePart, showViewModel, 'editable', null);
        this.removeValidationLayer(pagePart, showViewModel, 'validation', null);
      } else if (pageFor == 'show') {
        var showViewModel = JSON.parse(this.permissionsManagerService.getViewModel('orders', 'show'))[pagePart];
        console.log("REQ showViewModel >> ", showViewModel);

        this.changeShowEditableBasedOnLstString(pagePart, showViewModel, 'show', true);
        this.removeValidationLayer(pagePart, showViewModel, 'validation', null);
      }
    }
    PropsPermissions['showEditable'] = this.fileds[pagePart];
    return PropsPermissions;
  }
}
