import { Component, OnInit } from '@angular/core';
import { UserManagementService } from 'src/app/Shared/UserManagement/user-management.service';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';

@Component({
  selector: 'app-add-edit-user-filters-component',
  templateUrl: './add-edit-user-filters-component.component.html',
  styleUrls: ['./add-edit-user-filters-component.component.scss']
})
export class AddEditUserFiltersComponentComponent implements OnInit {

  autoData: any = {};
  userInfo: any = {};
  filterRow: any = {};
  userDataFilter: any = {};
  constructor(private userManagementService: UserManagementService, private route: ActivatedRoute, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.userManagementService.initaddedituserfilterpage().subscribe(z => {
      this.autoData = z;
      console.log(z);

    })
    let userId = this.route.snapshot.paramMap.get("id");
    this.userDataFilter.userId = userId;
    this.userManagementService.getSingleUserInfo(userId).subscribe((z: any) => {
      this.userInfo = z.user;
      console.log(z);
      if (typeof z.userFilters != 'undefined') {
        this.mainFilterObject = JSON.parse(z.userFilters.jsonValue);
        this.castingUserFilter(this.mainFilterObject)
        this.filterRow = z.userFilters;
        this.filterRow.userGroupId = this.filterRow.userGroupId + '';
      }
    })
  }
  itemsFilter = {};
  ordersFilter = {};
  performasFilter = {};
  shippingprocessFilter = {};
  containerprocessFilter = {};
  customprocessFilter = {};
  reportsorderFilter = {};
  reportsitem01Filter = {};
  reportsitem02Filter = {};
  reportsitem03Filter = {};
  reportscontainerFilter = {};
  splitFilterValue(val: string) {
    let lst = [];
    if (val != 'all') {
      val.split(",").forEach(z => {
        lst.push(z);
      });
    }
    return lst;
  }
  isSubmet = false;
  save() {
    if(this.isSubmet) this.thirdPartytoastyService.addToastDefault('wait')
    this.thirdPartytoastyService.addToastDefault('wait');
    this.userDataFilter.jsonValue = JSON.stringify(this.getFormUserFilter());
    this.userDataFilter.userGroupId = this.filterRow.userGroupId;
    this.isSubmet = true;
    this.userManagementService.updateuserfilter(this.userDataFilter).subscribe(z => {
      this.thirdPartytoastyService.addToastDefault('success', 'Edit');
      this.isSubmet = false;
      console.log(z);
    }, e => { this.thirdPartytoastyService.addToastDefault('error'); this.isSubmet = false; })
  }

  setAllifEmptyArray(arr) {
    return typeof arr != 'undefined' && arr.length != 0 ? arr.join(",") : "all";
  }
  getFormUserFilter() {
    console.log(this.itemsFilter['categoryId']);
    this.mainFilterObject['items']['filters']['categoryId']['filter'] = this.setAllifEmptyArray(this.itemsFilter['categoryId']);
    this.mainFilterObject['items']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.itemsFilter['supplierId']);

    this.mainFilterObject['orders']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.ordersFilter['supplierId']);
    this.mainFilterObject['orders']['filters']['inlandShipperId']['filter'] = this.setAllifEmptyArray(this.ordersFilter['inlandShipperId']);
    this.mainFilterObject['orders']['filters']['customsAgentId']['filter'] = this.setAllifEmptyArray(this.ordersFilter['customsAgentId']);
    this.mainFilterObject['orders']['filters']['forwarderId']['filter'] = this.setAllifEmptyArray(this.ordersFilter['forwarderId']);
    this.mainFilterObject['orders']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.ordersFilter['warehousesId']);

    this.mainFilterObject['performas']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.performasFilter['supplierId']);
    this.mainFilterObject['performas']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.performasFilter['warehousesId']);

    this.mainFilterObject['shippingprocess']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.shippingprocessFilter['supplierId']);
    this.mainFilterObject['shippingprocess']['filters']['inlandShipperId']['filter'] = this.setAllifEmptyArray(this.shippingprocessFilter['inlandShipperId']);
    this.mainFilterObject['shippingprocess']['filters']['customsAgentId']['filter'] = this.setAllifEmptyArray(this.shippingprocessFilter['customsAgentId']);
    this.mainFilterObject['shippingprocess']['filters']['forwarderId']['filter'] = this.setAllifEmptyArray(this.shippingprocessFilter['forwarderId']);
    this.mainFilterObject['shippingprocess']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.shippingprocessFilter['warehousesId']);

    this.mainFilterObject['containerprocess']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.containerprocessFilter['supplierId']);
    this.mainFilterObject['containerprocess']['filters']['inlandShipperId']['filter'] = this.setAllifEmptyArray(this.containerprocessFilter['inlandShipperId']);
    this.mainFilterObject['containerprocess']['filters']['customsAgentId']['filter'] = this.setAllifEmptyArray(this.containerprocessFilter['customsAgentId']);
    this.mainFilterObject['containerprocess']['filters']['forwarderId']['filter'] = this.setAllifEmptyArray(this.containerprocessFilter['forwarderId']);
    this.mainFilterObject['containerprocess']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.containerprocessFilter['warehousesId']);

    this.mainFilterObject['customprocess']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.customprocessFilter['supplierId']);
    this.mainFilterObject['customprocess']['filters']['inlandShipperId']['filter'] = this.setAllifEmptyArray(this.customprocessFilter['inlandShipperId']);
    this.mainFilterObject['customprocess']['filters']['customsAgentId']['filter'] = this.setAllifEmptyArray(this.customprocessFilter['customsAgentId']);
    this.mainFilterObject['customprocess']['filters']['forwarderId']['filter'] = this.setAllifEmptyArray(this.customprocessFilter['forwarderId']);
    this.mainFilterObject['customprocess']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.customprocessFilter['warehousesId']);

    this.mainFilterObject['reportsorder']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.reportsorderFilter['supplierId']);
    this.mainFilterObject['reportsorder']['filters']['inlandShipperId']['filter'] = this.setAllifEmptyArray(this.reportsorderFilter['inlandShipperId']);
    this.mainFilterObject['reportsorder']['filters']['customsAgentId']['filter'] = this.setAllifEmptyArray(this.reportsorderFilter['customsAgentId']);
    this.mainFilterObject['reportsorder']['filters']['forwarderId']['filter'] = this.setAllifEmptyArray(this.reportsorderFilter['forwarderId']);
    this.mainFilterObject['reportsorder']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.reportsorderFilter['warehousesId']);

    this.mainFilterObject['reportsitem01']['filters']['categoryId']['filter'] = this.setAllifEmptyArray(this.reportsitem01Filter['categoryId']);
    this.mainFilterObject['reportsitem01']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.reportsitem01Filter['supplierId']);

    this.mainFilterObject['reportsitem02']['filters']['categoryId']['filter'] = this.setAllifEmptyArray(this.reportsitem02Filter['categoryId']);
    this.mainFilterObject['reportsitem02']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.reportsitem02Filter['supplierId']);

    this.mainFilterObject['reportsitem03']['filters']['categoryId']['filter'] = this.setAllifEmptyArray(this.reportsitem03Filter['categoryId']);
    this.mainFilterObject['reportsitem03']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.reportsitem03Filter['supplierId']);

    this.mainFilterObject['reportscontainer']['filters']['supplierId']['filter'] = this.setAllifEmptyArray(this.reportscontainerFilter['supplierId']);
    this.mainFilterObject['reportscontainer']['filters']['inlandShipperId']['filter'] = this.setAllifEmptyArray(this.reportscontainerFilter['inlandShipperId']);
    this.mainFilterObject['reportscontainer']['filters']['customsAgentId']['filter'] = this.setAllifEmptyArray(this.reportscontainerFilter['customsAgentId']);
    this.mainFilterObject['reportscontainer']['filters']['forwarderId']['filter'] = this.setAllifEmptyArray(this.reportscontainerFilter['forwarderId']);
    this.mainFilterObject['reportscontainer']['filters']['warehousesId']['filter'] = this.setAllifEmptyArray(this.reportscontainerFilter['warehousesId']);
    console.log(this.mainFilterObject);

    return this.mainFilterObject;

  }
  castingUserFilter(serverUserFilter) {
    this.itemsFilter['categoryId'] = this.splitFilterValue(serverUserFilter['items']['filters']['categoryId']['filter']);
    this.itemsFilter['supplierId'] = this.splitFilterValue(serverUserFilter['items']['filters']['supplierId']['filter']);

    this.ordersFilter['supplierId'] = this.splitFilterValue(serverUserFilter['orders']['filters']['supplierId']['filter']);
    console.log("this.ordersFilter['supplierId']", this.ordersFilter['supplierId']);

    this.ordersFilter['inlandShipperId'] = this.splitFilterValue(serverUserFilter['orders']['filters']['inlandShipperId']['filter']);
    this.ordersFilter['customsAgentId'] = this.splitFilterValue(serverUserFilter['orders']['filters']['customsAgentId']['filter']);
    this.ordersFilter['forwarderId'] = this.splitFilterValue(serverUserFilter['orders']['filters']['forwarderId']['filter']);
    this.ordersFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['orders']['filters']['warehousesId']['filter']);

    this.performasFilter['supplierId'] = this.splitFilterValue(serverUserFilter['performas']['filters']['supplierId']['filter']);
    this.performasFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['performas']['filters']['warehousesId']['filter']);


    this.shippingprocessFilter['supplierId'] = this.splitFilterValue(serverUserFilter['shippingprocess']['filters']['supplierId']['filter']);
    this.shippingprocessFilter['inlandShipperId'] = this.splitFilterValue(serverUserFilter['shippingprocess']['filters']['inlandShipperId']['filter']);
    this.shippingprocessFilter['customsAgentId'] = this.splitFilterValue(serverUserFilter['shippingprocess']['filters']['customsAgentId']['filter']);
    this.shippingprocessFilter['forwarderId'] = this.splitFilterValue(serverUserFilter['shippingprocess']['filters']['forwarderId']['filter']);
    this.shippingprocessFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['shippingprocess']['filters']['warehousesId']['filter']);


    this.containerprocessFilter['supplierId'] = this.splitFilterValue(serverUserFilter['containerprocess']['filters']['supplierId']['filter']);
    this.containerprocessFilter['inlandShipperId'] = this.splitFilterValue(serverUserFilter['containerprocess']['filters']['inlandShipperId']['filter']);
    this.containerprocessFilter['customsAgentId'] = this.splitFilterValue(serverUserFilter['containerprocess']['filters']['customsAgentId']['filter']);
    this.containerprocessFilter['forwarderId'] = this.splitFilterValue(serverUserFilter['containerprocess']['filters']['forwarderId']['filter']);
    this.containerprocessFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['containerprocess']['filters']['warehousesId']['filter']);


    this.customprocessFilter['supplierId'] = this.splitFilterValue(serverUserFilter['customprocess']['filters']['supplierId']['filter']);
    this.customprocessFilter['inlandShipperId'] = this.splitFilterValue(serverUserFilter['customprocess']['filters']['inlandShipperId']['filter']);
    this.customprocessFilter['customsAgentId'] = this.splitFilterValue(serverUserFilter['customprocess']['filters']['customsAgentId']['filter']);
    this.customprocessFilter['forwarderId'] = this.splitFilterValue(serverUserFilter['customprocess']['filters']['forwarderId']['filter']);
    this.customprocessFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['customprocess']['filters']['warehousesId']['filter']);

    this.reportsorderFilter['supplierId'] = this.splitFilterValue(serverUserFilter['reportsorder']['filters']['supplierId']['filter']);
    this.reportsorderFilter['inlandShipperId'] = this.splitFilterValue(serverUserFilter['reportsorder']['filters']['inlandShipperId']['filter']);
    this.reportsorderFilter['customsAgentId'] = this.splitFilterValue(serverUserFilter['reportsorder']['filters']['customsAgentId']['filter']);
    this.reportsorderFilter['forwarderId'] = this.splitFilterValue(serverUserFilter['reportsorder']['filters']['forwarderId']['filter']);
    this.reportsorderFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['reportsorder']['filters']['warehousesId']['filter']);


    this.reportsitem01Filter['categoryId'] = this.splitFilterValue(serverUserFilter['reportsitem01']['filters']['categoryId']['filter']);
    this.reportsitem01Filter['supplierId'] = this.splitFilterValue(serverUserFilter['reportsitem01']['filters']['supplierId']['filter']);



    this.reportsitem02Filter['categoryId'] = this.splitFilterValue(serverUserFilter['reportsitem02']['filters']['categoryId']['filter']);
    this.reportsitem02Filter['supplierId'] = this.splitFilterValue(serverUserFilter['reportsitem02']['filters']['supplierId']['filter']);



    this.reportsitem03Filter['categoryId'] = this.splitFilterValue(serverUserFilter['reportsitem03']['filters']['categoryId']['filter']);
    this.reportsitem03Filter['supplierId'] = this.splitFilterValue(serverUserFilter['reportsitem03']['filters']['supplierId']['filter']);


    this.reportscontainerFilter['supplierId'] = this.splitFilterValue(serverUserFilter['reportscontainer']['filters']['supplierId']['filter']);
    this.reportscontainerFilter['inlandShipperId'] = this.splitFilterValue(serverUserFilter['reportscontainer']['filters']['inlandShipperId']['filter']);
    this.reportscontainerFilter['customsAgentId'] = this.splitFilterValue(serverUserFilter['reportscontainer']['filters']['customsAgentId']['filter']);
    this.reportscontainerFilter['forwarderId'] = this.splitFilterValue(serverUserFilter['reportscontainer']['filters']['forwarderId']['filter']);
    this.reportscontainerFilter['warehousesId'] = this.splitFilterValue(serverUserFilter['reportscontainer']['filters']['warehousesId']['filter']);

  }
  ngOnInit() {
  }

  mainFilterObject = {
    "items": {
      "filters": {
        "categoryId": {
          "filter": "all"
        },
        "supplierId": {
          "filter": "all"
        }
      }
    },
    "orders": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "inlandShipperId": {
          "filter": "all"
        },
        "customsAgentId": {
          "filter": "all"
        },
        "forwarderId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    },
    "performas": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    },
    "shippingprocess": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "inlandShipperId": {
          "filter": "all"
        },
        "customsAgentId": {
          "filter": "all"
        },
        "forwarderId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    },
    "containerprocess": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "inlandShipperId": {
          "filter": "all"
        },
        "customsAgentId": {
          "filter": "all"
        },
        "forwarderId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    },
    "customprocess": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "inlandShipperId": {
          "filter": "all"
        },
        "customsAgentId": {
          "filter": "all"
        },
        "forwarderId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    },
    "reportsorder": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "inlandShipperId": {
          "filter": "all"
        },
        "customsAgentId": {
          "filter": "all"
        },
        "forwarderId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    },
    "reportsitem01": {
      "filters": {
        "categoryId": {
          "filter": "all"
        },
        "supplierId": {
          "filter": "all"
        }
      }
    },
    "reportsitem02": {
      "filters": {
        "categoryId": {
          "filter": "all"
        },
        "supplierId": {
          "filter": "all"
        }
      }
    },
    "reportsitem03": {
      "filters": {
        "categoryId": {
          "filter": "all"
        },
        "supplierId": {
          "filter": "all"
        }
      }
    },
    "reportscontainer": {
      "filters": {
        "supplierId": {
          "filter": "all"
        },
        "inlandShipperId": {
          "filter": "all"
        },
        "customsAgentId": {
          "filter": "all"
        },
        "forwarderId": {
          "filter": "all"
        },
        "warehousesId": {
          "filter": "all"
        }
      }
    }
  };
}
