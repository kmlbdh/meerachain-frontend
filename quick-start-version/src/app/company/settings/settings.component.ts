import { Component, OnInit } from '@angular/core';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  IsImpostorCompany = false;
  constructor(private permissionsManagerService: PermissionsManagerService) {
    this.IsImpostorCompany = this.permissionsManagerService.roleMatch(["ImpostorCompany"]);


  }

  ngOnInit() {
  }

}
