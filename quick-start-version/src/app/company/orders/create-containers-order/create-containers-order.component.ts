import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { OrderManagementService } from '../order-management.service';
import { OrderContainers } from 'src/app/Shared/Orders/OrderContainers';
import { OrderProcessService } from 'src/app/Shared/OrderProcess/order-process.service';
import { Subscription } from 'rxjs';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-containers-order',
  templateUrl: './create-containers-order.component.html',
  styles: []
})
export class CreateContainersOrderComponent implements OnInit {
  infoForm: FormGroup;
  Options = [];
  tupleTypes;
  editMode = 'false';
  lstContainer: any = [];
  @Output() formContainerValues = new EventEmitter();
  counter = 0;
  canAddContainer = true;
  canDeleteContainer = true;
  testTupleTypes = (itmTT) => itmTT == this.tupleTypes['Container Type'];
  getContainersName() {

    if (typeof this.Options[this.tupleTypes['Container Type']] != 'undefined')
      this.Options[this.tupleTypes['Container Type']].forEach(containers => {
        for (var i = 0; i < this.lstContainer.length; i++) {
          if (this.lstContainer[i].containerTypeId == Number(containers.value)) {
            this.lstContainer[i].containerType = { name: containers.label }
          }
        }
      });

  }
  changeContainersOrderDetectionPartial: Subscription;
  loadOptionsFirst() {
    this.ordersService.initOrderPage().subscribe((z: any) => {
      z.autoComplete.forEach(itm => {
        if (this.testTupleTypes(itm.tupleType)) {
          if (typeof this.Options[itm.tupleType] == 'undefined') this.Options[itm.tupleType] = [];
          this.Options[itm.tupleType].push({
            value: '' + itm.originId,
            label: itm.name
          });
        }
      });
      this.getContainersName();
    });
  }
  fileds;
  getAutharizationLevel(mode) {
    if (!this.fileds) {
      this.fileds = this.orderManagementService.getOrderPartsFileds('orderContainers', mode)['showEditable'];
    }
  }
  constructor(private orderProcessService: OrderProcessService, private router: Router, private permissionsManagerService: PermissionsManagerService, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.tupleTypes = TupleTypes;

    if (this.router.url.indexOf("t=e") != -1) {
      this.getAutharizationLevel('edit')
    } else {
      this.getAutharizationLevel('add')
    }


    this.canAddContainer = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'orders', //For loop and get any thing is access == true
          subAccess: ['addContainer']
        }
      ]
    );
    this.canDeleteContainer = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'orders', //For loop and get any thing is access == true
          subAccess: ['deleteContainer']
        }
      ]
    );
  }

  ngOnInit() {
    this.loadOptionsFirst();

    if (typeof this.orderManagementService.ContainersOrder == 'undefined')
      this.lstContainer = [];
    else {
      this.lstContainer = this.orderManagementService.ContainersOrder.map(z => this.orderManagementService.PrepareProp(this.orderManagementService.stringIds(z)));
      this.initLast();
    }
    this.getContainersName();
    if (typeof this.changeContainersOrderDetectionPartial == 'undefined')
      this.changeContainersOrderDetectionPartial = this.orderManagementService.changeContainersOrderDetectionPartial.subscribe((z: any) => {
        document.querySelector('#modal-8').classList.remove('md-show');
        if (z.type == "Add" && typeof this.lstContainer.find(a => a.containerNumber == z.value.containerNumber) == 'undefined') {
          let cont = z.value;
          cont.id = null;
          cont.isScanned = null;
          cont.scanningHour = null;
          cont.scanByText = null;
          cont.returnedDateToPort = null;
          cont.arrivalDateToCompany = null;
          cont.arrivalTruckNumber = null;
          cont.arrivalHourToCompany = null;
          cont.supervisorGaurd = null;
          cont.actualArrival = null;
          cont.exitDate = null;
          cont.warehousesId = null;
          this.lstContainer.push(cont);
          this.initLast();
          this.getContainersName();

        } else if (z.type == "Edit") {
          var lastContainer = this.lstContainer.find(a => Number(a.id) == Number(z.value.id));
          if (typeof lastContainer == 'undefined') {/* error happen */ return; }
          var IndexOfLastContainer = this.lstContainer.indexOf(lastContainer);
          this.lstContainer[IndexOfLastContainer] = z.value;
          this.getContainersName();
        }
        else {
          //already exists
        }
        if (this.orderManagementService.EditableOrderId != null) {
          var lstContainers = this.getValidRows();
          lstContainers.forEach(container => {
            container.orderId = this.orderManagementService.EditableOrderId;
          });

          lstContainers.forEach(z => {
            z.containerType = null;
          })
          lstContainers.forEach(z => {
            z = this.orderManagementService.EmptyToNulls(z);
          })
        }
        this.orderManagementService.changeContainersOrderDetection.next(this.getValidRows());
        this.orderManagementService.isChaged = true;
        this.getContainersName();
      })


  }
  validRowProp = ['containerNumber'];
  notEmptyValue(v: string) {
    return typeof v != 'undefined' && v != null && v.trim() != "";
  }
  isValidRow(row: OrderContainers) {
    let IsValid = true;
    this.validRowProp.forEach(prop => {
      IsValid = this.notEmptyValue(row[prop])
    });
    return IsValid;
  }
  getValidRows() {
    var validRows = [];
    this.lstContainer.forEach(row => {
      if (this.isValidRow(row)) {
        validRows.push(row)
      }
    })
    return validRows;
  }
  initObj
  initLast() {
    //Init the -- NOT -- First Container Info
    this.orderManagementService.lastContainerInfo = this.lstContainer[this.lstContainer.length - 1];
  }
  openmodel(index, editMode) {
    /**/
    var row: any = {};
    if (index == -1) {
      if (this.orderManagementService.ContainerInitForFirstContainer != null && typeof this.orderManagementService.lastContainerInfo == 'undefined') {
        row = this.orderManagementService.ContainerInitForFirstContainer;
        this.orderManagementService.lastContainerInfo = {};
        this.orderManagementService.lastContainerInfo.containerTypeId = row.containerTypeId + '';
        this.orderManagementService.lastContainerInfo.delayedContainersDays = row.delayedContainersDays;
      }
    } else {
      row = this.lstContainer[index];
    }
    this.orderManagementService.changeContainersPageInit.next({ initObj: row, editMode: editMode })
    document.querySelector('#modal-8').classList.add('md-show');
    document.querySelector('#modal-8').classList.add('largeModel');
    var model: any = document.querySelector('#modal-8');
    var content: any = document.querySelector('.md-content');
    content.style.width = "1000px";
    model.style.left = "40%";
  }
  ngOnDestroy() {
    this.changeContainersOrderDetectionPartial.unsubscribe();
  }
  deleterow(rowIndex) {
    this.lstContainer.splice(rowIndex, 1);
    this.orderManagementService.changeContainersOrderDetection.next(this.getValidRows());
  }

}
