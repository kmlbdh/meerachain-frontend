import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalAdminRoutingModule } from './technical-admin-routing.module';
import { TechnicalAdminComponent } from './technical-admin.component';
import { SharedModule } from '../theme/shared/shared.module';
import { CompaniesComponent } from './companies/tables-show/companies.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CreateCompanyComponent } from './companies/create-company/create-company.component';
import {ArchwizardModule} from 'ng2-archwizard/dist';
import {CustomFormsModule} from 'ng2-validation';
import { ToastyModule } from 'ng2-toasty';

import {DataTablesModule} from 'angular-datatables';
import { TablesShowComponent } from './preDefinedAutoData/tables-show/tables-show.component';
import { CreatePreDefinedComponent } from './preDefinedAutoData/create-pre-defined/create-pre-defined.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [TechnicalAdminComponent, CompaniesComponent, MainPageComponent, CreateCompanyComponent, TablesShowComponent, CreatePreDefinedComponent],
  imports: [
    CommonModule,
    TechnicalAdminRoutingModule,
    SharedModule,
    ArchwizardModule,
    CustomFormsModule,
    DataTablesModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
        totalMessage: 'total', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    })
  ],
  exports:[ ]
})
export class AdminModule { }
