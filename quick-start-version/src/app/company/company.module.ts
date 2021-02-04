import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { SharedModule } from '../theme/shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { NgbTabsetModule, NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsSystemComponent } from './settings/settings-system/settings-system.component';
import {SelectModule} from 'ng-select';
// import { NgSelectModule } from 'node_modules/@ng-select/ng-select';
import {DataTablesModule} from 'angular-datatables';
import {ArchwizardModule} from 'ng2-archwizard/dist';
import {TagInputModule} from 'ngx-chips';
import { ContactsComponent } from './contacts/contacts.component';
import { CreateComponent } from './contacts/create/create.component';
import { CreateContactsComponent } from './shared/create-contacts/create-contacts.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { CreateItemComponent } from './items/create-item/create-item.component';
import { TableItemsComponent } from './items/table-items/table-items.component';
import {AngularDualListBoxModule} from 'angular-dual-listbox';
import { SelectionTableItemsComponent } from './items/selection-table-items/selection-table-items.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateMainOrderComponent } from './orders/create-main-order/create-main-order.component';
import { CreateGeneralOrderComponent } from './orders/create-general-order/create-general-order.component';
import { CreateShippingOrderComponent } from './orders/create-shipping-order/create-shipping-order.component';
import { CreateCustomsOrderComponent } from './orders/create-customs-order/create-customs-order.component';
import { CreateContainersOrderComponent } from './orders/create-containers-order/create-containers-order.component';
import { CreateItemsOrderComponent } from './orders/create-items-order/create-items-order.component';
import {IcDatepickerModule, IcDatepickerService} from 'ic-datepicker';
import {TextMaskModule} from 'angular2-text-mask';
import { ContainerComponent } from './orders/container/container.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { PaginationComponent } from './pagination/pagination.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { CustomDatePickerComponent } from './orders/custom-date-picker/custom-date-picker.component';
import { CustomProcessComponent } from './custom-process/custom-process.component';
import { ShippingProcessComponent } from './shipping-process/shipping-process.component';
import { ContainerProcessComponent } from './container-process/container-process.component';
import { ContainerRowEditingComponent } from './container-row-editing/container-row-editing.component';
import { PerformaComponent } from './performa/performa.component';
import { ReportsComponent } from './reports/reports.component';
import { FiltersComponent } from './reports/filters/filters.component';
import { ShowOrderDetailsComponent } from './orders/show-order-details/show-order-details.component';
import { UsersAccessManagerComponent } from './users-access-manager/users-access-manager.component';
import { UserAccessManagerModule } from './users-access-manager/users-access-manager.module';
import { OrderNotesComponent } from './OrderNotes/order-notes/order-notes.component';
import { CuNotesComponent } from './OrderNotes/cu-notes/cu-notes.component';
import {TinymceModule} from 'angular2-tinymce';
import { DateAgoPipe } from '../Shared/pipes/date-ago.pipe';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { SettingsAccountComponent } from './settings/settings-account/settings-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { SettingsCompanySetupDataComponent } from './settings/settings-company-setup-data/settings-company-setup-data.component';
import { CuOrderComponent } from './orders/cu-order/cu-order.component';
import { CurrencyBalanceComponent } from './settings/currency-balance/currency-balance.component';
import { CuCustomsCalculationComponent } from './orders/cu-customs-calculation/cu-customs-calculation.component';

@NgModule({
  declarations: [CompanyComponent, 
    SettingsComponent, 
    SettingsSystemComponent, 
    ContactsComponent, 
    CreateComponent, 
    CreateContactsComponent, 
    WarehousesComponent, 
    CategoriesComponent,
    ItemsComponent, 
    CreateItemComponent, 
    TableItemsComponent, 
    SelectionTableItemsComponent,
    OrdersComponent, 
    CreateMainOrderComponent, 
    CreateGeneralOrderComponent, 
    CreateShippingOrderComponent, 
    CreateCustomsOrderComponent, 
    CreateContainersOrderComponent, 
    CreateItemsOrderComponent, 
    ContainerComponent, 
    OrdersListComponent, PaginationComponent, CustomDatePickerComponent, CustomProcessComponent, ShippingProcessComponent, 
    ContainerProcessComponent, ContainerRowEditingComponent, PerformaComponent, ReportsComponent, FiltersComponent, ShowOrderDetailsComponent, OrderNotesComponent, 
    CuNotesComponent, AllNotificationComponent, UserTasksComponent, SettingsAccountComponent, DashboardComponent, 
    QuickSearchComponent, SettingsCompanySetupDataComponent, CuOrderComponent,CurrencyBalanceComponent, CuCustomsCalculationComponent],
  imports: [
    CommonModule,
    SharedModule,
    CompanyRoutingModule,
    DataTablesModule,
    AngularDualListBoxModule,
    IcDatepickerModule,
    TextMaskModule,
    NgxPaginationModule,
    UserAccessManagerModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
        totalMessage: 'total', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    NgbCollapseModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TinymceModule,
    FileUploadModule
  ],
  exports:[IcDatepickerModule],
  providers:[IcDatepickerService,DatePipe],
  
})
export class CompanyModule { }
