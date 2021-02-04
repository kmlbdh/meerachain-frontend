import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertModule, BreadcrumbModule, CardModule, ModalModule } from './components';
import { DataFilterPipe } from './components/data-table/data-filter.pipe';
import { TodoListRemoveDirective } from './components/todo/todo-list-remove.directive';
import { TodoCardCompleteDirective } from './components/todo/todo-card-complete.directive';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { WizardNavbarLgIconComponentComponent } from './components/wizard-navbar-lg-icon-component/wizard-navbar-lg-icon-component.component';
import { ToastyModule } from 'ng2-toasty';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectModule } from 'ng-select';
import { TagInputModule } from 'ngx-chips';
import { ArchwizardModule } from 'ng2-archwizard/dist';
import { DateAgoPipe } from 'src/app/Shared/pipes/date-ago.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    NgbTabsetModule,
    SelectModule,
    GalleryModule.forRoot(),
    ClickOutsideModule,
    TagInputModule,
    ArchwizardModule,
    FormsModule, 
    ToastyModule.forRoot()
  ],
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    TagInputModule,
    ArchwizardModule,
    ReactiveFormsModule,
    AlertModule,
    NgbTabsetModule,
    SelectModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    GalleryModule,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ClickOutsideModule,
    SpinnerComponent,
    ToastyModule, 
    DateAgoPipe
  ],
  declarations: [
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    SpinnerComponent,
    WizardNavbarLgIconComponentComponent,
    DateAgoPipe
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
