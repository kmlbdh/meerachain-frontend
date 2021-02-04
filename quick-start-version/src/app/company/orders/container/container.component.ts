import { Component, OnInit, Input } from '@angular/core';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrderManagementService } from '../order-management.service';
import { DatePipe, formatDate } from '@angular/common';
import { isEmpty, defaultIfEmpty } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { OrderProcessService } from 'src/app/Shared/OrderProcess/order-process.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  infoForm: FormGroup;
  isSubmit = false;
  Options = [];
  tupleTypes;
  lstContainer;
  @Input() editMode;
  showEditProp;
  @Input() initObj;
  lstWarehouses;
  lstEmployees;
  lstInlandShippers;
  testTupleTypes = (itmTT) => itmTT == this.tupleTypes['Container Type'];
  processMode = false;
  public maskDateSlash = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  constructor(private fbuilder: FormBuilder, private orderProcessService: OrderProcessService, private datePipe: DatePipe, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.tupleTypes = TupleTypes;
  }
  addnewcontainer() {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.orderManagementService.changeContainersOrderDetectionPartial.next({ type: 'Add', value: this.infoForm.value });
    }
  }
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      z.autoComplete.forEach(itm => {
        this.lstInlandShippers = z.inlandShippers;
        if (this.testTupleTypes(itm.tupleType)) {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
        }
      });
      this.lstWarehouses = z.warehouses.map(itm => {
        return {
          value: '' + itm.id,
          label: itm.name
        }
      });
      this.lstEmployees = z.employees;
    });
  }
  rowIndex = null;
  ngOnInit() {
    this.isSubmit = false;
    this.loadOptionsFirst();
    if (this.editMode != 'true') {
      this.initLast();
      this.showEditProp = false;
    }
    this.orderManagementService.changeContainersPageInit.subscribe((z: any) => {
      if (typeof z.editMode.value != 'undefined') {
        this.editMode = String(z.editMode.value);
        this.processMode = z.editMode.comeFrom == 'container-process' ? true : false;
        if (this.processMode) {
          this.rowIndex = z.editMode.rowIndex
        }
      } else {
        this.editMode = String(z.editMode);
      }
      if (this.editMode != 'true') {
        this.getAutharizationLevel('add');
        this.initLast();
        this.showEditProp = false;
      } else {
        this.getAutharizationLevel('edit');
        this.showEditProp = true;
        this.PrepareForm(z.initObj);
      }
    })
  }
  initLast() {
    if (String(this.editMode) == 'true') return;
    this.PrepareForm(this.orderManagementService.lastContainerInfo);
  }
  refreshModelabels() {

  }
  editnewcontainer() {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.orderManagementService.changeContainersOrderDetectionPartial.next({ type: 'Edit', value: this.infoForm.value, rowIndex: this.rowIndex });
    } else {

    }
  }
  fileds;
  getAutharizationLevel(mode) {
    if (!this.fileds) {
      this.fileds = this.orderManagementService.getOrderPartsFileds('orderContainers', mode)['showEditable'];
    }
  }
  PrepareForm(itm) {
    this.isSubmit = false;
    if (typeof itm == 'undefined') itm = {};
    this.infoForm = this.fbuilder.group({
      "id": [itm.id],
      "orderId": [itm.orderId],
      "containerNumber": [itm.containerNumber, Validators.compose([Validators.required, Validators.minLength(11)])],
      "delayedContainersDays": [itm.delayedContainersDays],
      "netWeight": [itm.netWeight],
      "goodsDescription": [itm.goodsDescription],
      "containerTypeId": [String(itm.containerTypeId), Validators.compose([Validators.required])],
      "inlandShipperId": [itm.inlandShipperId ? itm.inlandShipperId : this.orderManagementService.maininlandShipperId],
      "sealNumber": [itm.sealNumber],
      "totalWeight": [itm.totalWeight],
      "goodDangerous": [itm.goodDangerous],
      "isScanned": [itm.isScanned ? formatDate(itm.isScanned, 'yyyy-MM-dd', 'en') : ''],//Scaning
      "scanningHour": [itm.scanningHour],
      "scanByText": [itm.scanByText],
      "returnedDateToPort": [itm.returnedDateToPort ? formatDate(itm.returnedDateToPort, 'yyyy-MM-dd', 'en') : ''],//Process Returned to Port
      "arrivalDateToCompany": [itm.arrivalDateToCompany ? formatDate(itm.arrivalDateToCompany, 'yyyy-MM-dd', 'en') : ''], //Arrival Date To Company
      "arrivalTruckNumber": [itm.arrivalTruckNumber],//Arrival Hour To Company
      "arrivalHourToCompany": [itm.arrivalHourToCompany],//Arrival Truck Number
      "supervisorGaurd": [itm.supervisorGaurd],//Supervisor Gaurd
      "actualArrival": [itm.actualArrival ? formatDate(itm.actualArrival, 'yyyy-MM-dd', 'en') : ''],//Arrival Date To Port
      "exitDate": [itm.exitDate ? formatDate(itm.exitDate, 'yyyy-MM-dd', 'en') : ''],//Exit Date from Port
      "warehousesId": [String(itm.warehousesId)],//Warehouse
    });
    this.infoForm.valueChanges.subscribe(z => {
      // this.formContainerValues.emit(this.infoForm.value);
    })
  }

  get frmC() {
    return this.infoForm.controls;
  }
}
