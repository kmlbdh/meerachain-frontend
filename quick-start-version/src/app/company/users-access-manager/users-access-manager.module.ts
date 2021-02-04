import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UsersAccessManagerRoutingModule } from './users-access-manager-routing.module';
import { UsersAccessManagerComponent } from './users-access-manager.component';
import { AddEditUserFiltersComponentComponent } from './add-edit-user-filters-component/add-edit-user-filters-component.component';
import { CreateViewModelComponentComponent } from './create-view-model-component/create-view-model-component.component';
import { ViewmodelsbysectionComponentComponent } from './viewmodelsbysection-component/viewmodelsbysection-component.component';
import { ListgroupsComponentComponent } from './listgroups-component/listgroups-component.component';
import { AddEditGroupComponentComponent } from './add-edit-group-component/add-edit-group-component.component';

@NgModule({
  declarations: [UsersAccessManagerComponent, AddEditUserFiltersComponentComponent, CreateViewModelComponentComponent, ViewmodelsbysectionComponentComponent, ListgroupsComponentComponent, AddEditGroupComponentComponent],
  imports: [
    CommonModule,
    SharedModule,
    UsersAccessManagerRoutingModule
  ]
})
export class UserAccessManagerModule { }
