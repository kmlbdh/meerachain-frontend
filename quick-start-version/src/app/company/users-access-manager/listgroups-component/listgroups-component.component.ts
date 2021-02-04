import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/Shared/UserManagement/user-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listgroups-component',
  templateUrl: './listgroups-component.component.html',
  styleUrls: ['./listgroups-component.component.scss']
})
export class ListgroupsComponentComponent implements OnInit {
  lstGroups: any = [];
  constructor(private userManagementService: UserManagementService, private route: ActivatedRoute, private _router: Router) {

    this.userManagementService.getUsersGroups().subscribe(z => {
      this.lstGroups = z;
    })
  }
  editGroup(groupId) {
    this._router.navigate([`./impostorcompany/usersaccessmanager/groups/cu`], {
      queryParams: { t: 'e', i: groupId }
    });
  }
  ngOnInit() {
  }
}
