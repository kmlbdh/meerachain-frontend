import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from 'src/app/Shared/UserManagement/user-management.service';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';

@Component({
  selector: 'app-add-edit-group-component',
  templateUrl: './add-edit-group-component.component.html',
  styleUrls: ['./add-edit-group-component.component.scss']
})
export class AddEditGroupComponentComponent implements OnInit {
  lstStringsNeedsViewModel = "items.add,items.edit,items.show,orders.add,orders.edit,orders.show"
  lstViews = {};
  groupInfo: any;
  errorvalue;
  generalGroupInfo: any = {
    name: '',
    description: '',
    policiesObject: {
      "items": [
        {
          "prop": "add",
          "access": false,
          "needmodel": true
        },
        {
          "prop": "edit",
          "access": false,
          "viewModelId": null,
          "needmodel": true
        },
        {
          "prop": "show",
          "access": false,
          "viewModelId": null,
          "needmodel": true
        }
      ],
      "orders": [
        {
          "prop": "add",
          "access": false,
          "needmodel": true
        },
        {
          "prop": "edit",
          "access": false,
          "viewModelId": null,
          "needmodel": true
        },
        {
          "prop": "show",
          "access": false,
          "viewModelId": null,
          "needmodel": true
        },
        {
          "prop": "addContainer",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "deleteContainer",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "addItem",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "deleteItem",
          "access": false,
          "needmodel": false
        }
      ],
      "customprocess": [
        {
          "prop": "show",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "edit",
          "access": false,
          "needmodel": false
        }
      ],
      "shippingprocess": [
        {
          "prop": "show",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "edit",
          "access": false,
          "needmodel": false
        }
      ],
      "containerprocess": [
        {
          "prop": "show",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "edit",
          "access": false,
          "needmodel": false
        }
      ],
      "reports": [
        {
          "prop": "show",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "reportsorder",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "reportscontainer",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "reportsitem01",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "reportsitem02",
          "access": false,
          "needmodel": false
        },
        {
          "prop": "reportsitem03",
          "access": false,
          "needmodel": false
        },
      ],
      "performas": [
        {
          "prop": "add",
          "access": false,
          "viewModelId": ""
        },
        {
          "prop": "edit",
          "access": false,
          "viewModelId": ""
        },
        {
          "prop": "createOrderFromPerforma",
          "access": false,
          "viewModelId": ""
        },
        {
          "prop": "show",
          "access": false,
          "viewModelId": ""
        },
        {
          "prop": "addItem",
          "access": false,
          "viewModelId": ""
        },
        {
          "prop": "deleteItem",
          "access": false,
          "viewModelId": ""
        }
      ],
    }
  };
  lstRoleKeys = [];
  PH = "create new group";
  pageFor = 'add';
  loaderSubject = new Subject();
  loaderProp = {
    loadinit: false,
    loadGroup: false
  }
  constructor(private route: ActivatedRoute, private router: Router, private userManagementService: UserManagementService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.groupInfo = this.generalGroupInfo;
    this.lstRoleKeys = Object.keys(this.groupInfo.policiesObject);
    this.route.queryParams
      .subscribe((params: any) => {
        if (params.t == 'e') {
          this.pageFor = 'edit'
          this.PH = "Edit Group";
          this.userManagementService.getUserGroup(params.i).subscribe(z => {
            this.lstRoleKeys = Object.keys(this.groupInfo.policiesObject);
            this.groupInfo = z;
            this.groupInfo.policiesObject = JSON.parse(this.groupInfo.policiesObject);
            this.lstRoleKeys.forEach(key => {
              if (this.groupInfo.policiesObject[key]) {
                this.groupInfo.policiesObject[key].forEach((prop, i) => {
                  if (this.lstStringsNeedsViewModel.indexOf(`${key}.${this.groupInfo.policiesObject[key][i]['prop']}`) >= 0) {
                    this.groupInfo.policiesObject[key][i]['needmodel'] = true;
                    this.groupInfo.policiesObject[key][i]['viewModelId'] += '';
                  }
                });
              }
            });
            console.log("editable", z);
          })
        } else {
          this.groupInfo = this.generalGroupInfo;
          this.pageFor = 'add'
          this.PH = "create new group";
        }
      })

    this.userManagementService.getAllViewModel().subscribe((z: any) => {
      z.forEach(view => {
        if (typeof this.lstViews[view.viewModelType] == 'undefined') {
          this.lstViews[view.viewModelType] = [];
        }
        this.lstViews[view.viewModelType].push(view);
      });
    })


    this.loaderSubject.subscribe(Z => {
      if (this.loaderProp.loadGroup == true && this.loaderProp.loadinit) {

      }
    })
  }

  ngOnInit() {
  }
  disabledView = false;
  addupdateUsersGroup() {
    console.log(this.groupInfo);
    var temp = this.groupInfo;
    this.disabledView = true;
    this.groupInfo['viewModels'] = [];
    let tmp = this.groupInfo.policiesObject;
    this.lstRoleKeys.forEach(key => {
      this.groupInfo.policiesObject[key].forEach((z, i) => {
        delete this.groupInfo.policiesObject[key][i]['needmodel'];
      })
      console.log('this.groupInfo.policiesObject[key]', this.groupInfo.policiesObject[key]);
      this.groupInfo.policiesObject[key].forEach(z => {
        if (z != null && typeof z != 'undefined' && (z.viewModelId == 'undefined' || z.viewModelId == null)) {
          z.viewModelId = "";
        }
      });
      this.groupInfo.policiesObject[key]
        .filter(z => typeof z != 'undefined' && z != null && z.viewModelId != '')
        .map(z => z.viewModelId)
        .forEach(vmId => {
          console.log("vmId", vmId);
          if (vmId != null && vmId != 'undefined' && typeof this.groupInfo['viewModels'].find(last => last.customViewModelId == vmId) == 'undefined') {
            this.groupInfo['viewModels'].push({ customViewModelId: vmId });
          }
        });
    });
    this.groupInfo.policiesObject = JSON.stringify(this.groupInfo.policiesObject);
    this.thirdPartytoastyService.addToastDefault('wait');
    this.userManagementService.addUpdateUserGroup(this.groupInfo).subscribe(z => {
      this.router.navigate(["../impostorcompany/usersaccessmanager/groups"])
      this.thirdPartytoastyService.addToastDefault('success', 'Add');
      this.errorvalue = null;
    }, e => {
      this.thirdPartytoastyService.addToastDefault('error');
      this.errorvalue = e.error;
    })
    this.groupInfo.policiesObject = tmp;
    this.disabledView = false;
    this.groupInfo = temp;
  }
}
