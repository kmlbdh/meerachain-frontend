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
@Component({
  selector: 'app-cu-order',
  templateUrl: './cu-order.component.html',
  styleUrls: ['./cu-order.component.scss']
})
export class CuOrderComponent implements OnInit {

  constructor(private fbuilder: FormBuilder, private datePipe: DatePipe, private permissionsManagerService: PermissionsManagerService, private orderManagementService: OrderManagementService, private ordersService: OrdersService, private companyPreDefinedAutoDataService: CompanyPreDefinedAutoDataService, private _router: Router, private route: ActivatedRoute, private itemsService: ItemsService, private thirdPartytoastyService: ThirdPartytoastyService) { }

  ngOnInit() {
  }




  buildForm(row){
    
  }

}
