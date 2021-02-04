import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnicalAdminComponent } from './technical-admin.component';
import { CompaniesComponent } from './companies/tables-show/companies.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CreateCompanyComponent } from './companies/create-company/create-company.component';
import { TablesShowComponent } from './preDefinedAutoData/tables-show/tables-show.component';
import { CreatePreDefinedComponent } from './preDefinedAutoData/create-pre-defined/create-pre-defined.component';

const routes: Routes = [
    {
      path: '',
      component: TechnicalAdminComponent,
      // canActivate: [AuthGuardService],
      // data: { permittedRoles: ['TechnicalAdmin'] },
      children:
        [
        //   { path: 'workers/:id', component: WorkerdetailsComponent },
          { path: 'companies', component: CompaniesComponent },
          { path: 'companies/cu', component: CreateCompanyComponent },//CRUD => Create , Update => CU
          { path: 'predefineddata', component: TablesShowComponent },
          { path: 'predefineddata/cu', component: CreatePreDefinedComponent },
          { path: '', component: MainPageComponent },
          
        ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TechnicalAdminRoutingModule { } 