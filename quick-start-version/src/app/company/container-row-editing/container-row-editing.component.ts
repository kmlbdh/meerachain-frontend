import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { OrderManagementService } from '../orders/order-management.service';
import { TupleTypes } from 'src/app/Shared/Enums/TupleTypes';
import { OrderProcessManagementService } from '../order-process-management.service';

@Component({
  selector: 'app-container-row-editing',
  templateUrl: './container-row-editing.component.html',
  styleUrls: ['./container-row-editing.component.scss']
})
export class ContainerRowEditingComponent implements OnInit {
  infoForm: FormGroup;
  isSubmit = false;
  Options = [];
  @Input() set initObj(v){
    this.PrepareForm(v);
  };
  public maskDateSlash = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  constructor(private fbuilder: FormBuilder, private datePipe: DatePipe, private ordersService: OrdersService, private orderManagementService: OrderManagementService,private orderProcessManagementService:OrderProcessManagementService) {
  }
  ngOnInit() {
    this.isSubmit = false;
  }
  editnewcontainer() {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.orderManagementService.changeContainersOrderDetectionPartial.next({ type: 'Edit', value: this.infoForm.value });
    } else {

    }
  }
  PrepareForm(itm) {
    this.isSubmit = false;
    if (typeof itm == 'undefined') itm = {};
    this.infoForm = this.fbuilder.group({
      "id": [itm.id],
      "orderId": [itm.orderId],
      "containerNumber": [itm.containerNumber, Validators.compose([Validators.required, Validators.minLength(11)])],
      "isScanned": [itm.isScanned ? formatDate(itm.isScanned, 'yyyy-MM-dd', 'en') : ''],//Scaning
      "scanningHour": [itm.scanningHour],
      "scanByText": [itm.scanByText],
    });
    this.infoForm.valueChanges.subscribe(z =>{
      this.orderProcessManagementService.CustomProcessOrderContainerChange.next(this.infoForm.value);
    });
  }
  get frmC() {
    return this.infoForm.controls;
  }

}
