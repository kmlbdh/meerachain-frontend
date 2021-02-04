import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PermissionsManagerService } from './Shared/Permissions/permissions-manager.service';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { HostListener } from '@angular/core';
import { SystemHelperService } from './Shared/SystemHelper/system-helper.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'datta-able';
  currentRoute;
  constructor(private router: Router, private navigationItem: NavigationItem, private systemHelperService: SystemHelperService, private fbuilder: FormBuilder) {
    router.events.subscribe((val: any) => {
      if (val.urlAfterRedirects) {
        if (val.urlAfterRedirects.indexOf('?') != -1) {
          this.currentRoute = val.urlAfterRedirects.split('?')[0];
        } else {
          this.currentRoute = val.urlAfterRedirects;
        }
      }
    });


  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  infoForm
  PrepareForm(row) {
    this.infoForm = this.fbuilder.group({
      "pageRoute": [row.pageRoute, Validators.compose([Validators.required])],
      "inputId": [row.inputId, Validators.compose([Validators.required])],
      "helpHeader": [row.helpHeader, Validators.compose([Validators.required])],
      "helpDescription": [row.helpDescription, Validators.compose([Validators.required])],
    });
  }
  isSubmit
  closeCreateModel(event) {
    (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
  }
  canEdit = false;
  editWH(event) {
    this.isSubmit = true;
    if (this.infoForm.valid) {
      this.systemHelperService.addEditSysHelper(this.infoForm.value).subscribe(z => {
        (((event.target.parentElement.parentElement).parentElement).parentElement).classList.remove('md-show');
        this.infoForm.reset();
        this.isSubmit = false;
      }, e => {
        
      })
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    if (event.key === 'F2' && this.currentRoute && event.target.id) {
      this.systemHelperService.getSysHelper(this.currentRoute, event.target.id).subscribe((z: any) => {
        if (z.obj) {
          //Edit 
          this.PrepareForm(z.obj);
        } else {
          this.PrepareForm({ pageRoute: this.currentRoute, inputId: event.target.id })
        }
        this.canEdit = z.canEdit;
        document.querySelector('#addEditSysHelper').classList.add('md-show');
      })
      console.log('F2 pressed', this.currentRoute, event.target.id);
      // Call Function
    }
  }


}
