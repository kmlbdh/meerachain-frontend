import { Component, OnInit, Input } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { OrderItems } from 'src/app/Shared/Orders/OrderItems';
import { ItemsService } from 'src/app/Shared/Items/items.service';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrderManagementService } from '../order-management.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-create-items-order',
  templateUrl: './create-items-order.component.html',
  styles: []
})
export class CreateItemsOrderComponent implements OnInit {
  editing = {};
  lstOrderItems = [];
  lstItems;
  ColumnMode = ColumnMode;
  rowSaveIcon = [];
  tupleTypes;
  Options = [];
  isReady = {
    _supId: false,
    _options: false,
    _editableOrder: false
  };
  itemsTotalPrice:number = 0;
  editablePageReady = new Subject();
  @Input() set supId(id) {
    console.log('Arrive => supId ', id);
    this.loadOptionsFirst(id);
    this.isReady._supId = true;
    this.editablePageReady.next(0);
  }
  Tf = false;
  testTupleTypes = (itmTT) => itmTT == this.tupleTypes['Currency'] || itmTT == this.tupleTypes['Unit'];
  loadOptionsFirst(supId) {
    this.ordersService.initOrderPage().subscribe((res: any) => {
      let allitems = res.items;
      this.ordersService.getSupItemIds(supId).subscribe((idsBelong: any) => {
        this.lstItems = []
        idsBelong.forEach(itmId => {
          let itm = allitems.find(z => z.id == itmId);
          if (itm) {
            this.lstItems.push({
              value: '' + itm.id,
              label: itm.englishName,
              unitId: itm.unitId
            });
          } else {
            //Undefined thats mean refresh cache required!
          }
        });
      })
      res.autoComplete.forEach(itm => {
        if (this.testTupleTypes(itm.tupleType)) {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
        }
      });
      this.isReady._options = true;
      this.editablePageReady.next(1);
    });
  }
  getItemAutoNames(itemIndex) {
    var unit = this.Options[this.tupleTypes['Unit']].find(z => Number(z.value) == Number(this.lstOrderItems[itemIndex].unitId));
    if (unit) {
      this.lstOrderItems[itemIndex].unit = { name: unit.label }
    }
    var currency = this.Options[this.tupleTypes['Currency']].find(z => Number(z.value) == Number(this.lstOrderItems[itemIndex].currencyId));
    if (currency) {
      this.lstOrderItems[itemIndex].currency = { name: currency.label }
    }
  }

  PageFor;
  canAddItem = true;
  canDeleteItem = true;
  constructor(private itemService: ItemsService, private permissionsManagerService: PermissionsManagerService, private _router: Router, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.tupleTypes = TupleTypes;
    this.lstOrderItems = Array<OrderItems>();
    this.PageFor = 0;

    let pageOrderVsPerformaAutharization = this._router.url.split('/')[2];
    this.canAddItem = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: pageOrderVsPerformaAutharization, //For loop and get any thing is access == true
          subAccess: ['addItem']
        }
      ]
    );
    this.canDeleteItem = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: pageOrderVsPerformaAutharization, //For loop and get any thing is access == true
          subAccess: ['deleteItem']
        }
      ]
    );
  }
  calculateItemsTotalPrice(){
    this.itemsTotalPrice = 0;
    this.getValidRows().forEach(z =>{
      if(z.totalPrice){
        this.itemsTotalPrice += Number(z.totalPrice);
      }
    })
  }
  ngOnInit() {
    this.editablePageReady.subscribe(z => {
      if (this.isReady._supId && this.isReady._editableOrder && this.isReady._options) {
        while (i) { this.getItemAutoNames(--i); this.lstOrderItems[i] = this.stringIds(this.lstOrderItems[i]); }
        this.calculateItemsTotalPrice();
      }
    })
    console.log(this.orderManagementService.ItemsOrder);

    if (typeof this.orderManagementService.ItemsOrder == 'undefined' || this.orderManagementService.ItemsOrder.length == 0) {
      this.getAutharizationLevel('add');
      this.lstOrderItems = [];
      if (typeof this.lstOrderItems == 'undefined' || this.lstOrderItems == null || this.lstOrderItems.length == 0) {
        for (let i = 0; i < 5; i++) {
          this.addnewrow(i);
        }
      }
    }
    else {
      this.getAutharizationLevel('edit');
      this.lstOrderItems = this.orderManagementService.ItemsOrder;
      var i = this.lstOrderItems.length;
      this.isReady._editableOrder = true;
      this.editablePageReady.next(3);

      if (this._router.url.split('/')[3].includes('t=a&pid')) {
        this.lstOrderItems.forEach(itm => {
          if (typeof itm.dispatchedQuantity == 'undefined') itm.dispatchedQuantity = 0
          if (!itm['updatedQuantity']) {
            itm.quantity = itm.quantity - itm.dispatchedQuantity
          }
          itm['updatedQuantity'] = true;
        });
        this.lstOrderItems = this.lstOrderItems.filter(z => Number(z.quantity) != 0)
      }
      if (this._router.url.split('/')[2] == 'performas') {
        this.PageFor = 1
      }
      this.calculateItemsTotalPrice();
    }

  }
  stringIds(z: OrderItems) {
    Object.keys(z).forEach(prop => {
      z[prop] = Number.isNaN(Number(z[prop])) && z[prop] != null && z[prop] != 'null' ? z[prop] : z[prop] + '';
    })
    return z;
  }
  saverowedit(rowIndex) {
    this.rowSaveIcon[rowIndex] = false;
    Object.keys(this.editing).forEach((el: string) => {
      if (el.indexOf(rowIndex) != -1) {
        this.editing[el] = false;
      }
    });
    this.getItemAutoNames(rowIndex);
    this.orderManagementService.changeItemsOrderDetection.next(this.getValidRows());
    this.orderManagementService.isChaged = true;
    this.calculateItemsTotalPrice();
  }
  validRowProp = ['name', 'quantity', 'unitId', 'price', 'currencyId', 'totalPrice'];
  notEmptyValue(v: string) {
    return typeof v != 'undefined' && v != null && v.trim() != "";
  }
  isValidRow(row: OrderItems) {
    let IsValid = true;
    this.validRowProp.forEach(prop => {
      IsValid = this.notEmptyValue(row[prop])
    });
    return IsValid;
  }
  getValidRows() {
    var validRows = [];
    this.lstOrderItems.forEach(row => {
      if (this.isValidRow(row)) {
        validRows.push(row)
      }
    })
    return validRows;
  }
  addnewrow(rowIndex, TF = false) {
    if (this.canAddItem) {
      this.lstOrderItems.splice(rowIndex + 1, 0, { currencyId: this.orderManagementService.currency.value, currency: { name: this.orderManagementService.currency.label } });
      if (!TF) this.openrowedit(rowIndex);
      else this.openrowedit(rowIndex + 1);
      this.orderManagementService.isChaged = true;
    }
    this.calculateItemsTotalPrice();
  }
  deleterow(rowIndex) {
    this.lstOrderItems.splice(rowIndex, 1);
    this.calculateItemsTotalPrice();
  }
  fileds;
  getAutharizationLevel(mode) {
    if (this._router.url.split('/')[2] == 'performas') {
      this.fileds = this.orderManagementService.getOrderPartsFileds('orderItems', mode, true)['showEditable'];
      console.log("FIELD ITEMS", this.fileds);
    } else
      if (!this.fileds) {
        this.fileds = this.orderManagementService.getOrderPartsFileds('orderItems', mode)['showEditable'];
      }
  }
  openrowedit(rowIndex) {
    this.rowSaveIcon[rowIndex] = true;
    this.editing[rowIndex + '-' + 'name'] = true;
    this.editing[rowIndex + '-' + 'unitId'] = true;
    this.editing[rowIndex + '-' + 'currencyId'] = true;
    this.editing[rowIndex + '-' + 'quantity'] = true;
    this.editing[rowIndex + '-' + 'price'] = true;
    this.editing[rowIndex + '-' + 'note'] = true;
    this.editing[rowIndex + '-' + 'totalPrice'] = true;
  }
  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.lstOrderItems[rowIndex][cell] = event.target.value;
    this.lstOrderItems = this.lstOrderItems;
    this.getItemAutoNames(rowIndex);
    this.orderManagementService.isChaged = true;
    this.calculateItemsTotalPrice();
  }
  modelchange(rowIndex, propName, lst, id) {
    this.lstOrderItems[rowIndex][propName] = lst.find(z => z.value == id).label;
    if (propName == 'name') {
      this.lstOrderItems[rowIndex]['unitId'] = lst.find(z => z.value == id).unitId + '';
      if (this.lstOrderItems[rowIndex]['unitId']) {
        var unitFromOptions = this.Options[this.tupleTypes['Unit']].find(u => Number(u.value) == this.lstOrderItems[rowIndex]['unitId']);
        this.lstOrderItems[rowIndex]['unit'] = {
          name: unitFromOptions.label
        }
      }
    }
  }
  onKeydown(event, colName, rowIndex) {
    if (event.key === "Enter") {
      this.updateValue(event, colName, rowIndex);
    }
  }
  totPriceChange(rowIndex) {
    this.lstOrderItems[rowIndex].totalPrice = String(this.lstOrderItems[rowIndex].price * this.lstOrderItems[rowIndex].quantity);
  }
}
