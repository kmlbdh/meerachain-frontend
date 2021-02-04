import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  canAddItem;
  constructor(private permissionsManagerService:PermissionsManagerService) {
    
    this.canAddItem = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'items', //For loop and get any thing is access == true
          subAccess: ['add']
        }
      ]
    );
   }

  ngOnInit() {
  }

}
