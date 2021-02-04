import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomAgentCompanyComponent } from './custom-agent-company.component';
import { COrdersComponent } from './corders/corders.component';
import { CCuOrdersComponent } from './c-cu-orders/c-cu-orders.component';


const routes: Routes = [
  {
    // AuthGuardService,
    path: '',
    component: CustomAgentCompanyComponent,
    children:
      [
        { path: 'orders/cu/:id', component: CCuOrdersComponent },
        { path: 'orders', component: COrdersComponent },
        // { path: 'quicksearch', component: QuickSearchComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomAgentCompanyRoutingModule { } 