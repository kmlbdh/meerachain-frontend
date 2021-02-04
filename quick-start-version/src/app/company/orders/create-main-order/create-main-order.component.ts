import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/Shared/Items/item';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CompanyPreDefinedAutoDataService } from '../../shared/CompanyPreDefinedAutoData/company-pre-defined-auto-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from 'src/app/Shared/Items/items.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { Orders } from 'src/app/Shared/Orders/Orders';
import { OrderManagementService } from '../order-management.service';
import { ShippingType } from 'src/app/Shared/Enums/ShippingType';
import { Subject, Subscription } from 'rxjs';
import { IcDatepickerOptionsInterface } from 'ic-datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { Priority } from 'src/app/Shared/Enums/Priority';
import { OrderType } from 'src/app/Shared/Enums/OrderType';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-main-order',
  templateUrl: './create-main-order.component.html',
  styleUrls: ['./create-main-order.component.scss']
})
export class CreateMainOrderComponent implements OnInit {
  datepickerOptions: IcDatepickerOptionsInterface = {
    position: 'top',
    inputClasses: ['form-control'],
    attrs: {
      placeholder: 'asdasds'
    }
  };
  public editOrderEvent = new Subject();
  Options = [];
  tupleTypes;
  lstOrderPriority;
  infoForm: FormGroup;
  PGHead = 'Add New Order';
  form: any;
  cardLoad = false;
  public isSubmit: boolean;
  frmType; idEdit;
  lstSuppliers = [];
  formGeneralValues;
  formShuppingValues;
  formCustomValues;
  reqCached = false;
  lstShippingTypes = [];
  _editOrder;
  _autoDataLoaded = false;
  performaId;
  containerCounter = 0;
  itemCounter = 0;
  MakeSaveForOrderOutSideTheMainOrderComponent: Subscription;
  lightButton = 'btn btn-outline-primary';
  PageFor = 0;
  testTupleTypes = (itmTT) => itmTT == this.tupleTypes['Container Type'] || itmTT == this.tupleTypes['Incoterm'] || itmTT == this.tupleTypes['Loading Port'] || itmTT == this.tupleTypes['Currency'];
  loadInitPage(z) {
    this.cardLoad = true;
    this.reqCached = true;
    this.lstSuppliers = z.suppliers;
    z.autoComplete.forEach(itm => {
      if (this.testTupleTypes(itm.tupleType)) {
        if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
        this.Options[itm.tupleType].push({
          value: '' + itm.originId,
          label: itm.name
        });
        this.cardLoad = false;
      }
    });
  }
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      this.loadInitPage(z);
      this._autoDataLoaded = true;
      this.editOrderEvent.next(2);
    });
  }
  stringIds(z: Orders) {
    Object.keys(z).forEach(prop => {
      z[prop] = Number.isNaN(Number(z[prop])) && z[prop] != null && z[prop] != 'null' ? z[prop] : z[prop] + '';
    })
    return z;
  }
  preparePerformaHeaders() {
    if (this.frmType == 'e')
      this.PGHead = 'Edit Performa'
    else
      this.PGHead = 'Create New Performa'
  }
  preparePerformaLogic() {
    this.PageFor = OrderType.PerformaOrder; //1 Mean Performa
  }
  constructor(private fbuilder: FormBuilder, private datePipe: DatePipe, private permissionsManagerService: PermissionsManagerService, private orderManagementService: OrderManagementService, private ordersService: OrdersService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService, private _router: Router, private route: ActivatedRoute, private itemsService: ItemsService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.orderManagementService.rest();
    this.tupleTypes = TupleTypes;
    this.PageFor = 0;
    if (this._router.url.split('/')[2] == 'performas') {
      this.preparePerformaLogic()
    }
    this.lstShippingTypes = Object.keys(ShippingType).filter(key => !isNaN(Number(ShippingType[key]))).map((z, i) => {
      return {
        value: i + '',
        label: z
      }
    });
    this.lstOrderPriority = Object.keys(Priority).filter(key => !isNaN(Number(Priority[key]))).map((z, i) => {
      return {
        value: i + '',
        label: z
      }
    });
    this.orderManagementService.changeItemsOrderDetection.subscribe((z: any) => {
      this.itemCounter = z.length;
    })
    this.orderManagementService.changeContainersOrderDetection.subscribe((z: any) => {
      this.containerCounter = z.length;
    })
    this.route.queryParams
      .subscribe(params => {
        this.frmType = params.t
        this.performaId = params.pid;
        this.idEdit = null;
        if (this.frmType == 'e' && !Number(this.performaId)) {
          this.getAutharizationLevel('edit');
          this.orderManagementService.EditableOrderId = params.i
          this.PrepareForm({});
          this.idEdit = params.i;
          if (Number.isNaN(Number(params.i))) { alert("Id Error"); return; }
          this.isSubmit = false;
          this.cardLoad = true;
          this.PGHead = "Edit Order";
          this.ordersService.editOrder(params.i, this.PageFor).subscribe((editableOrder: any) => {
            this._editOrder = editableOrder;
            this.editOrderEvent.next(1);
          })
        }
        else if (this.frmType == 'a' && Number(this.performaId))//Add from Performa
        {
          this.getAutharizationLevel('add');
          this.ordersService.editOrder(params.pid, OrderType.PerformaOrder).subscribe((editableOrder: any) => {
            this._editOrder = this.orderManagementService.PrepareProp(editableOrder);
            this._editOrder.orderItems = editableOrder.orderItems.map(z => this.orderManagementService.PrepareProp(z));
            this.editOrderEvent.next(1);
          })
        }
        else {
          this.getAutharizationLevel('add');
          this.orderManagementService.EditableOrderId = null
          this.PrepareForm({});
          this.isSubmit = false;
          this.PGHead = "Create New Order"
        }
      });
    this.editOrderEvent.subscribe(z => {
      if (this._autoDataLoaded && this._editOrder) {
        this.PrepareForm(this.stringIds(this._editOrder));
        this.orderManagementService.rest();

        if (this._editOrder.dispatchedContainers && this.PageFor != 1)
          this.infoForm.controls.numberOfContainers.setValue(this.infoForm.controls.numberOfContainers.value - this._editOrder.dispatchedContainers)

        if (typeof this._editOrder.orderContainers != 'undefined') {
          this.containerCounter = this._editOrder.orderContainers.length;
        }
        if (typeof this._editOrder.orderItems != 'undefined') {
          this.itemCounter = this._editOrder.orderItems.length;
        }
        this.orderManagementService.setOrderEditable.next(this.infoForm.value);
        if (typeof this.infoForm.controls.currencyId.value != 'undefined' && this.infoForm.controls.currencyId.value != "") {
          this.orderManagementService.currency = this.Options[this.tupleTypes['Currency']].find(z => z.value == this.infoForm.controls.currencyId.value);
        }
      }
    })
    this.loadOptionsFirst();
    if (this._router.url.split('/')[2] == 'performas') {
      this.preparePerformaHeaders()
    }
  }
  ngOnInit() {
    this.datepickerOptions = {
      position: 'top',
      inputClasses: ['form-control']
    };
  }
  
  PrepareProp(itm) {
    Object.keys(itm).forEach(propName => {
      itm[propName] = typeof itm[propName] == 'undefined' || itm[propName] == null || itm[propName] == 'null' ? '' : itm[propName];
    });
    return itm;
  }
  fileds;
  getAutharizationLevel(mode) {
    if (this._router.url.split('/')[2] == 'performas') {
      this.fileds = this.orderManagementService.getOrderPartsFileds('main', mode, true)['showEditable'];
    } else if (!this.fileds) {
      this.fileds = this.orderManagementService.getOrderPartsFileds('main', mode)['showEditable'];
    }
  }
  PrepareForm(itm) {
    if (typeof itm != 'undefined' && typeof itm.containerTypeId != 'undefined')
      this.orderManagementService.ContainerInitForFirstContainer.containerTypeId = itm.containerTypeId;
    itm = this.PrepareProp(itm);
    console.log(this.fileds);

    // if (typeof this.fileds == 'undefined') return;
    this.infoForm = this.fbuilder.group({
      "id": [itm.id, Validators.compose([])],
      "supplierId": [itm.supplierId, this.fileds ? this.fileds['supplierId'].validation : []],
      "numberOfContainers": [itm.numberOfContainers, this.fileds ? this.fileds['numberOfContainers'].validation : []],
      "loadingPortId": [itm.loadingPortId, this.fileds ? this.fileds['loadingPortId'].validation : Validators.compose([])],
      "orderCreationDate": [itm.orderCreationDate ? formatDate(itm.orderCreationDate, 'yyyy-MM-dd', 'en') : formatDate(new Date(), 'yyyy-MM-dd', 'en'), this.fileds ? this.fileds['orderCreationDate'].validation : []],
      "containerTypeId": [itm.containerTypeId, this.fileds ? this.fileds['containerTypeId'].validation : []],
      "currencyId": [itm.currencyId, this.fileds ? this.fileds['currencyId'].validation : []],
      "shippingType": [itm.shippingType],
      "orderDescription": [itm.orderDescription, this.fileds ? this.fileds['orderDescription'].validation : []],
      "incotermsId": [itm.incotermsId, this.fileds ? this.fileds['incotermsId'].validation : []],
      "arrivalDateToPort": [itm.arrivalDateToPort ? formatDate(itm.arrivalDateToPort, 'yyyy-MM-dd', 'en') : '', this.fileds ? this.fileds['arrivalDateToPort'].validation : []],
      "orderGenerals": [itm.orderGenerals],
      "orderShippings": [itm.orderShippings],
      "orderCustoms": [itm.orderCustoms],
      "orderContainers": [typeof itm.orderContainers == 'undefined' || itm.orderContainers == null || itm.orderContainers == "" ? [] : itm.orderContainers],
      "orderItems": [typeof itm.orderItems == 'undefined' || itm.orderItems == null || itm.orderItems == "" ? [] : itm.orderItems],
      "orderPriority": [itm.orderPriority ? itm.orderPriority : '0', this.fileds ? this.fileds['orderPriority'].validation : []],
      "performaId": [itm.performaId ? itm.performaId : null],
      "createDate": [itm.createDate],
    });

    if (this.PageFor == OrderType.PerformaOrder) {
      this.infoForm.addControl('suspendingContainers', new FormControl(this.frmC.numberOfContainers.value - (itm.dispatchedContainers ? itm.dispatchedContainers : 0)))
      this.infoForm.addControl('dispatchedContainers', new FormControl(itm.dispatchedContainers ? itm.dispatchedContainers : 0))
    }
    // this.orderManagementService.currency = this.Options[this.tupleTypes['Currency']].find(z => z.value == this.infoForm.controls.currencyId.value);
    this.infoForm.controls.currencyId.valueChanges.subscribe(z => {
      if (typeof this.Options[this.tupleTypes['Currency']] != 'undefined')
        this.orderManagementService.currency = this.Options[this.tupleTypes['Currency']].find(z => z.value == this.infoForm.controls.currencyId.value);
    })
    this.infoForm.controls.supplierId.valueChanges.subscribe(z => {
      var sup = this.lstSuppliers.find(a => a.value == z);
      if (sup) {
        this.initSupAutoData(sup.supplierAuth)
        this.orderManagementService.ContainerInitForFirstContainer.containerTypeId = sup.supplierAuth.containerTypeId;
      }
    });
    this.infoForm.controls.containerTypeId.valueChanges.subscribe(z => {
      this.orderManagementService.ContainerInitForFirstContainer.containerTypeId = z;
    })
    this.infoForm.valueChanges.subscribe(z => {
      this.orderManagementService.isChaged = true;
    })
  }
  initSupAutoData(supInfo) {
    this.infoForm.controls.loadingPortId.setValue(supInfo.portId ? supInfo.portId + '' : '');
    this.infoForm.controls.containerTypeId.setValue(supInfo.containerTypeId ? supInfo.containerTypeId + '' : '');
    this.infoForm.controls.currencyId.setValue(supInfo.currencyId ? supInfo.currencyId + '' : '');
    this.infoForm.controls.shippingType.setValue(String(supInfo.shippingType));

    this.infoForm.controls.incotermsId.setValue(supInfo.incotermsId ? supInfo.incotermsId + '' : '');
    this.infoForm.controls.orderDescription.setValue(supInfo.goodsDescription ? supInfo.goodsDescription + '' : '');
  }
  get frmC() {
    return this.infoForm.controls;
  }
  saveEdit() {
    if (this.infoForm.valid) {
      this.cardLoad = true;
      this.thirdPartytoastyService.addToastDefault('wait');
      var order = new Orders({ ...this.infoForm.value });
      order = this.loadRelated(order);
      order['orderType'] = this.PageFor
      if (this.PageFor == OrderType.PerformaOrder) {
        order['performaId'] = this.performaId
      }
      var submit;
      if (this.PageFor == OrderType.NormalOrder) {
        submit = this.ordersService.edit(order);
      } else if (this.PageFor == OrderType.PerformaOrder) {
        submit = this.ordersService.EditPerforma(order);
      }
      submit.subscribe(z => {
        this.thirdPartytoastyService.addToastDefault('success', 'Edit');
        this.cardLoad = false;
        this.orderManagementService.isChaged = false;
      }, e => {
        this.thirdPartytoastyService.addToastDefault('error')
        this.cardLoad = false;
      })
    } else {
      this.isSubmit = true;
      this.thirdPartytoastyService.addToastDefault('error validation')
    }
  }
  loadRelated(order: Orders) {
    if (typeof this.orderManagementService.GeneralOrder != 'undefined') {
      order.orderGenerals = this.orderManagementService.EmptyToNulls(this.orderManagementService.GeneralOrder);
    }
    if (typeof this.orderManagementService.ShippingOrder != 'undefined') {
      order.orderShippings = this.orderManagementService.EmptyToNulls(this.orderManagementService.ShippingOrder);
    }
    if (typeof this.orderManagementService.CustomOrder != 'undefined') {
      let Containers = this.orderManagementService.EmptyToNulls(this.orderManagementService.CustomOrder);
      if (Containers) {
        order.isCleared = Containers.isCleared;
        order.orderCustoms = Containers;
      }
    }
    if (typeof this.orderManagementService.ContainersOrder != 'undefined') {
      order.orderContainers = this.orderManagementService.ContainersOrder.map(z => this.orderManagementService.EmptyToNulls(z));
    }
    if (typeof this.orderManagementService.ItemsOrder != 'undefined' && this.orderManagementService.ItemsOrder != "") {
      order.orderItems = this.orderManagementService.ItemsOrder.map(z => this.orderManagementService.EmptyToNulls(this.orderManagementService.PrepareProp(z)));
    }
    return order;
  }

  prepareOrderBelongstoPerformaToAdd(order) {
    order.performaId = this.performaId
    order.id = null
    if (typeof order.orderItems != 'undefined' && order.orderItems.length > 0) {
      order.orderItems.forEach((itm, i) => {
        order.orderItems[i].id = null;
      });
    }

    return order;
  }
  addnew() {
    if (this.infoForm.valid) {
      var order = new Orders({ ...this.infoForm.value });
      order = this.loadRelated(order);
      this.cardLoad = true;
      this.thirdPartytoastyService.addToastDefault('wait');
      order['orderType'] = this.PageFor
      order = this.prepareOrderBelongstoPerformaToAdd(order)
      var submit;
      if (this.PageFor == OrderType.NormalOrder) {
        submit = this.ordersService.addNew(order);
      } else if (this.PageFor == OrderType.PerformaOrder) {
        submit = this.ordersService.addNewPerforma(order);
      }
      submit.subscribe(z => {
        this._router.navigate(['/impostorcompany/orders']);
        this.thirdPartytoastyService.addToastDefault('success', 'Add');
        this.cardLoad = false;
        this.orderManagementService.isChaged = false;
      }, e => {
        this.thirdPartytoastyService.addToastDefault('error')
        this.cardLoad = false;
      })
    } else {
      this.isSubmit = true;
      this.thirdPartytoastyService.addToastDefault('error')
    }
  }
  hasUnsavedData() {
    if (this.orderManagementService.isChaged) {
      this.lightButton = 'btn btn-outline-primary animated';
    }
    return (this.orderManagementService.isChaged && this.isSubmit == false) || (this.orderManagementService.isChaged);
  }
}
