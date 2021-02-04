import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { GeneralTokenPermissionService } from './Shared/Permissions/general-token-permission.service';
import { AuthGuardService } from './Shared/Authentication/AuthGuardService';

const routes: Routes = [
  
  {
    path: '',
    component: AdminComponent,
    canActivate: [GeneralTokenPermissionService],
    children: [
      {
        path: '',
        redirectTo: 'sample-page',
        pathMatch: 'full'
      },
      {
        path: 'sample-page',
        loadChildren: './demo/extra/sample-page/sample-page.module#SamplePageModule'
      },
      {
        path: 'technicaladmin',
        loadChildren: './technical-admin/admin.module#AdminModule',
        canActivate: [AuthGuardService],
        data: { permittedRoles: ['TechnicalAdmin'] },
      },
      {
        path: 'impostorcompany',
        loadChildren: './company/company.module#CompanyModule',
        canActivate: [AuthGuardService],
        data: { permittedRoles: ['ImpostorCompany','AccToCompany'] },
      },
      {
        path: 'customAgentCompany',
        loadChildren: './custom-agent-company/custom-agent-company.module#CustomAgentCompanyModule',
        canActivate: [AuthGuardService],
        data: { permittedRoles: ['CustomAgentCompany'] },
      },
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
