import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersAccessManagerComponent } from './users-access-manager.component';
import { AddEditUserFiltersComponentComponent } from './add-edit-user-filters-component/add-edit-user-filters-component.component';
import { AddEditGroupComponentComponent } from './add-edit-group-component/add-edit-group-component.component';
import { ListgroupsComponentComponent } from './listgroups-component/listgroups-component.component';
import { ViewmodelsbysectionComponentComponent } from './viewmodelsbysection-component/viewmodelsbysection-component.component';
import { CreateViewModelComponentComponent } from './create-view-model-component/create-view-model-component.component';

const routes: Routes = [
    {
        path: '',
        component: UsersAccessManagerComponent,
        children: [
            { path: 'userfilters/:id', component: AddEditUserFiltersComponentComponent },
            { path: 'editview/:viewmodelid', component: CreateViewModelComponentComponent },
            { path: 'viewmodel/:modelsectionid', component: ViewmodelsbysectionComponentComponent },
            { path: 'groups', component: ListgroupsComponentComponent },
            { path: 'groups/cu', component: AddEditGroupComponentComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersAccessManagerRoutingModule { } 