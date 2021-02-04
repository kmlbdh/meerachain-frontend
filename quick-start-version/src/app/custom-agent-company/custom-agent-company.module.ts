import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAgentCompanyRoutingModule } from './custom-agent-company-routing.module';
import { SharedModule } from '../theme/shared/shared.module';
import {CustomAgentCompanyComponent} from './custom-agent-company.component';
import { COrdersComponent } from './corders/corders.component'
import {NgxPaginationModule} from 'ngx-pagination';
import { CCuOrdersComponent } from './c-cu-orders/c-cu-orders.component';

@NgModule({
  declarations: [CustomAgentCompanyComponent,  COrdersComponent, CCuOrdersComponent],
  imports: [
    CommonModule,
    CustomAgentCompanyRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class CustomAgentCompanyModule { }
