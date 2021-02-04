import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { SettingsComponent } from './settings/settings.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CreateComponent } from './contacts/create/create.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { CreateItemComponent } from './items/create-item/create-item.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateMainOrderComponent } from './orders/create-main-order/create-main-order.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { CustomProcessComponent } from './custom-process/custom-process.component';
import { ShippingProcessComponent } from './shipping-process/shipping-process.component';
import { ContainerProcessComponent } from './container-process/container-process.component';
import { CanDeactivateGuard } from '../Shared/CanDeactivateGuard';
import { PerformaComponent } from './performa/performa.component';
import { ReportsComponent } from './reports/reports.component';
import { FiltersComponent } from './reports/filters/filters.component';
import { ShowOrderDetailsComponent } from './orders/show-order-details/show-order-details.component';
import { PermissionsManagerService } from '../Shared/Permissions/permissions-manager.service';
import { AuthGuardService } from '../Shared/Authentication/AuthGuardService';
import { GeneralTokenPermissionService } from '../Shared/Permissions/general-token-permission.service';
import { OrderNotesComponent } from './OrderNotes/order-notes/order-notes.component';
import { CuNotesComponent } from './OrderNotes/cu-notes/cu-notes.component';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { CuCustomsCalculationComponent } from './orders/cu-customs-calculation/cu-customs-calculation.component';


const routes: Routes = [
  {
    // AuthGuardService,
    path: '',
    component: CompanyComponent,
    children:
      [
        { path: 'settings', component: SettingsComponent },
        { path: 'contacts', component: ContactsComponent },
        { path: 'contacts/cu', component: CreateComponent },
        { path: 'warehouses', component: WarehousesComponent },
        { path: 'categories', component: CategoriesComponent },
        { path: 'notifications', component: AllNotificationComponent },
        { path: 'mytasks', component: UserTasksComponent },
        { path: 'ordernotes', component: OrderNotesComponent },
        { path: 'ordernotes/cu', component: CuNotesComponent },
        { path: 'ordercustomcalculation/:orderId', component: CuCustomsCalculationComponent },
        {
          path: 'items', component: ItemsComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'items',
              subAccess: ['show']
            }]
          }
        },
        {
          path: 'items/cu', component: CreateItemComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'items',
              subAccess: ['show', 'edit', 'add']
            }]
          }
        },
        {
          path: 'orders', component: OrdersListComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'orders',
              subAccess: ['show']
            }]
          }
        },
        {
          path: 'orders/details', component: ShowOrderDetailsComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'orders',
              subAccess: ['show']
            }]
          },
        },
        {
          path: 'performas', component: PerformaComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'performas',
              subAccess: ['show']
            }]
          }
        },
        {
          path: 'orders/cu', component: CreateMainOrderComponent, canDeactivate: [CanDeactivateGuard],
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'orders',
              subAccess: ['add', 'edit']
            }]
          },
        },
        {
          path: 'performas/cu', component: CreateMainOrderComponent, canDeactivate: [CanDeactivateGuard],
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'performas',
              subAccess: ['edit', 'add']
            }]
          }
        },
        {
          path: 'customprocess', component: CustomProcessComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'customprocess',
              subAccess: ['show']
            }]
          }
        },
        {
          path: 'shippingprocess', component: ShippingProcessComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'shippingprocess',
              subAccess: ['show']
            }]
          }
        },
        {
          path: 'containerprocess', component: ContainerProcessComponent,
          canActivate: [PermissionsManagerService],
          data: {
            access: [{
              main: 'containerprocess',
              subAccess: ['show']
            }]
          }
        },
        { path: 'reports/filter/:name', component: FiltersComponent },
        { path: 'reports/item-filter-page', component: ReportsComponent },
        { path: 'reports', component: ReportsComponent },
        {
          path: 'usersaccessmanager',
          loadChildren: './users-access-manager/users-access-manager.module#UserAccessManagerModule'
        },
        { path: '', component: DashboardComponent },
        { path: 'quicksearch', component: QuickSearchComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { } 