import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/Shared/UserManagement/user-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-access-manager',
  templateUrl: './users-access-manager.component.html',
  styleUrls: ['./users-access-manager.component.scss']
})
export class UsersAccessManagerComponent implements OnInit {
  topSelected = 1;
  cvmFor = 'add';
  TopSearchObj = { value: 0 };
  lstModels: any = [];
  FfilterOptions = [
    { label: 'Items Views', value: 0 },
    { label: 'Orders Views', value: 1 },
  ]
  groupSections = [
    { label: 'View Groups', value: 0 },
    { label: 'Create New Group', value: 1 },
  ]
  showNavigation = true;
  constructor(private userManagementService: UserManagementService, private _router: Router) {
    console.log('this._router.url.indexOf("editview")', this._router.url.indexOf("editview"));

    if (this._router.url.indexOf("editview") != -1 || this._router.url.indexOf("viewmodel") != -1) {
      this.topSelected = 1;this.showNavigation = true;
    } else if (this._router.url.indexOf("groups") != -1) {
      this.topSelected = 2;this.showNavigation = true;
    }else if (this._router.url.indexOf("userfilters") != -1) {
      this.showNavigation = false;
    }
  }
  changeView() {
    if (this.topSelected == 1) { //Views Models
      this.beforeChange(0);
    }
    else if (this.topSelected == 2) { //Views Models
      this.beforeChangeGroup(0);
    }
  }
  ngOnInit() {
  }
  beforeChange($event) { //Change View model Section
    this.TopSearchObj.value = $event
    this._router.navigate([`./impostorcompany/usersaccessmanager/viewmodel/${$event}`]);
  };
  beforeChangeGroup($event) { //Change View model Section
    this.TopSearchObj.value = $event
    if ($event == 0) { //add
      this._router.navigate([`./impostorcompany/usersaccessmanager/groups`]);
    }
    else if ($event == 1) //edit
    {
      this._router.navigate([`./impostorcompany/usersaccessmanager/groups/cu`], {
        queryParams: { t: 'a' }
      });
    }
  };

}
