import { Injectable } from '@angular/core';
import { CacheService } from '../Cacheing/cache.service';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class PermissionsManagerService implements CanActivate {
  Permission_Key = "permissions";
  AllPropNavigation = [];
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  payLoad = undefined;
  constructor(private cacheService: CacheService, private navigationItem: NavigationItem) {
    this.AllPropNavigation = this.navigationItem.allNavigationMenu;


  }
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    // if(payLoad == undefined){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    // }
    var userRole;
    if (payLoad.role instanceof Array) {
      userRole = payLoad.role;
    } else {
      userRole = [];
      userRole.push(payLoad.role);
    }
    allowedRoles.forEach(UrlRole => {
      userRole.forEach(UserRole => {
        if (UserRole == UrlRole) {
          isMatch = true;
          return false;
        }
      });
    });
    return isMatch;
  }
  addAllNavigationPermissionAccess(lstAllowedNavigation){
    // showAll
    this.AllPropNavigation.filter(z => typeof z.showAll != 'undefined' && z.showAll == true).forEach(z => lstAllowedNavigation.push(z))
    return lstAllowedNavigation;
  }
  getNavigation() {
    let permissions = this.cacheService.getCacheAPI(this.Permission_Key);
    let allowedNavigation = [];

    if (permissions != undefined) {
      Object.keys(permissions.group.policiesObject).forEach(link => {
        console.log('link', link);
        permissions.group.policiesObject[link].forEach(permission => {
          console.log(permission);
          if (permission['prop'] == "show" && permission['access'] == true) {
            allowedNavigation.push(this.AllPropNavigation.find(z => z.id == link));
          }
        });
      });
      console.log("allowedNavigation", allowedNavigation);
      allowedNavigation = this.addAllNavigationPermissionAccess(allowedNavigation);
      allowedNavigation.sort((a, b) => a.first == true ? -1 : 1);
      return allowedNavigation;
    } else if (this.roleMatch(["TechnicalAdmin"])) {
      allowedNavigation = [
        {
          id: 'companies',
          title: 'Companies',
          type: 'item',
          url: `/technicaladmin/companies`,
          classes: 'nav-item',
          icon: 'fas fa-id-card'
        },
        {
          id: 'predefineddata',
          title: 'Auto Data Manager',
          type: 'item',
          url: `/technicaladmin/predefineddata`,
          classes: 'nav-item',
          icon: 'fas fa-key'
        }
      ];
      return allowedNavigation;
    } else if (this.roleMatch(["ImpostorCompany"])) {
      return this.AllPropNavigation;
    }else if(this.roleMatch(["CustomAgentCompany"])) {
      return [
        {
          id: 'orders',
          title: 'Orders',
          type: 'item',
          url: `/customAgentCompany/orders`,
          classes: 'nav-item',
          icon: 'fas fa-key'
        }
      ];
    }
  }
  /**
     * @param access  main: 'orders,items...', subAccess: ['propNameSpecification']
     * @param mainPageName => 
     * @param subPoliciesObject  Ex: items || orders || ...
     */
  checkAccessObject(accessArr, mainPageName, subPoliciesObject) {
    let canAccess = false;
    for (var k = 0; k < accessArr.length; k++) {
      let access = accessArr[k];
      if (access['main'] == mainPageName) {
        if (typeof access['subAccess'] == 'undefined') {
          canAccess = true;
        } else {
          for (var i = 0; i < subPoliciesObject.length; i++) {
            for (var j = 0; j < access.subAccess.length; j++) {
              console.log(subPoliciesObject[i].prop, access.subAccess[j], subPoliciesObject[i].access, subPoliciesObject[i].prop == access.subAccess[j] && subPoliciesObject[i].access == true);
              if (subPoliciesObject[i].prop == access.subAccess[j] && subPoliciesObject[i].access == true) {
                canAccess = true;
                console.log("ACCESS ALLOWED");
                return true;
              }
            }
          }
        }
      }
    };
    return canAccess;
  }


  /*
    access = [{
      main: 'orders,items...', //For loop and get any thing is access == true
      subAccess: ['propNameSpecification']
    }]
    */
  checkForPermissionInSpecificPage(access) {
    if (this.roleMatch(['ImpostorCompany'])) { // For Admin
      return true;
    }
    let canAccess = false;
    let permissions = this.cacheService.getCacheAPI(this.Permission_Key);
    Object.keys(permissions.group.policiesObject).forEach(permissionKey => {
      if (this.checkAccessObject(access, permissionKey, permissions.group.policiesObject[permissionKey])) {
        canAccess = true;
        return false;
      }
    });
    if (canAccess == false) {
      //redirect Page Forbid
    }
    return canAccess;
  }

  /*
    access = [{
      main: 'orders,items...', //For loop and get any thing is access == true
      subAccess: ['propNameSpecification']
    }]
    */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("ARRIVE");
    let canAccess = false;
    let access = next.data['access'] as Array<object>;
    if (this.roleMatch(['ImpostorCompany'])) { // For Admin
      return true;
    }
    console.log('this acc is employee => access', access);
    return this.checkForPermissionInSpecificPage(access);
  }
  accessRoute(key, ...actions) { //add edit show
    let permissions = this.cacheService.getCacheAPI(this.Permission_Key);
    if (permissions != undefined) {
      Object.keys(permissions.group.policiesObject).forEach(link => {
        if (link == key) {
          return true;
        }
      });
      return false;
    } else {
      return true; //by Default
    }
  }
  getViewModel(pageName, actionName) {
    let viewmodelId: any = false;
    let permissions = this.cacheService.getCacheAPI(this.Permission_Key);
    Object.keys(permissions.group.policiesObject).forEach(permissionKey => {
      for (var i = 0; i < permissions.group.policiesObject[permissionKey].length; i++) {
        let action = permissions.group.policiesObject[permissionKey][i];
        if (permissionKey == pageName && action['prop'] == actionName) {
          viewmodelId = Number(action['viewModelId']);
        }
      }
    });
    if (viewmodelId && !isNaN(viewmodelId)) {
      let viewfilter = undefined;
      permissions.views.forEach(view => {
        if (view.id == viewmodelId) {
          viewfilter = view.filterObject;
        }
      });
      return viewfilter;
    }
    return "all";
  }



  fileds = {
    items: {
      englishName: { validation: Validators.compose([Validators.required, Validators.minLength(3)]) },
      arabicName: {},
      hebrewName: {},
      unitId: { validation: Validators.compose([Validators.required]) },
      hScode: { validation: Validators.compose([Validators.required, Validators.minLength(3)]) },
      customsRate: { validation: Validators.compose([Validators.required, Validators.max(100)]) },
      categoryId: { validation: Validators.compose([Validators.required]) },
      description: {},
      lstSuppliers: {}
    }
  }
  prepareFieldsSetDefailt(pagePart, obj) {
    Object.keys(this.fileds[pagePart]).forEach(propKey => {
      this.fileds[pagePart][propKey].show = obj.show;
      this.fileds[pagePart][propKey].editable = obj.editable;
    });
  }
  /*
    @param prop  show , editable 
  */
  setFiledsShowEditableValue(pagePart, filedsPart, prop, TF) {
    Object.keys(this.fileds[pagePart]).forEach(propKey => {
      this.fileds[pagePart][propKey][prop] = TF;
    });
  }
  /**
     * @param sequanceString  "all" || "" || "supplierId,...."
     * @param prop => show || editable
     */
  changeShowEditableBasedOnLstString(pagePart, sequanceString: string, prop, val) {
    if (sequanceString == "all") {
      this.setFiledsShowEditableValue(pagePart, this.fileds[pagePart], prop, val);
    } else if (sequanceString != "") {
      Object.keys(this.fileds[pagePart]).forEach(propKey => {
        if (sequanceString.indexOf(propKey) != -1) {
          this.fileds[pagePart][propKey][prop] = val;
        }
      });
    }
  }


  removeValidationLayer(pagePart, sequanceString: string, prop, val) {
    if (sequanceString == "all") {
      this.setFiledsShowEditableValue(pagePart, this.fileds[pagePart], prop, val);
    } else if (sequanceString != "") {
      Object.keys(this.fileds[pagePart]).forEach(propKey => {
        if (sequanceString.indexOf(propKey) == -1) {
          this.fileds[pagePart][propKey][prop] = val;
        }
      });
    }
    console.log("this.fileds[pagePart]items", this.fileds[pagePart]);

  }
  /**
     * @param sequanceString  "all" || "" || "supplierId,...."
     * @param prop => show || editable
     */
  removeValidationLayerFromNONEditable(pagePart) {
    Object.keys(this.fileds[pagePart]).forEach(propKey => {
      if (this.fileds[pagePart][propKey]['editable'] != null) { //Check FOR ORDERS this.fileds[pagePart][propKey]['editable'] != null
        this.fileds[pagePart][propKey]['validation'] = null;
      }
    });

    console.log("this.fileds[pagePasdart]", this.fileds[pagePart]);

  }

  ReportPageAutharizatioonManager(filterKey) {
    let key = 'reports' + filterKey;
    return this.checkForPermissionInSpecificPage([{
      main: 'reports',
      subAccess: [key]
    }])
  }
  /*
    @param pageFor  add,edit,show ..
  */
  getOrderPartsFileds(page, pageFor) {
    let PropsPermissions = {};
    if (this.roleMatch(['ImpostorCompany'])) { // For Admin
      this.prepareFieldsSetDefailt(page,
        {
          show: true,
          editable: null
        });
    } else {
      if (pageFor == 'edit') {
        /*
          * if simple not use JSON PARSE
        */
        var showViewModel = this.getViewModel(page, 'show');
        var editViewModel = this.getViewModel(page, 'edit');
        console.log(showViewModel, editViewModel);

        //init all is allow to show and editable
        this.prepareFieldsSetDefailt(page, { show: false, editable: 'disabled' });

        this.changeShowEditableBasedOnLstString(page, showViewModel, 'show', true);
        this.changeShowEditableBasedOnLstString(page, editViewModel, 'editable', null);

        this.removeValidationLayerFromNONEditable(page);
        console.log(this.fileds[page]);
      } else if (pageFor == 'add') {
        /*
          * if simple not use JSON PARSE
        */
        var addViewModel = this.getViewModel(page, 'add');;
        console.log("REQ addViewModel >> ", addViewModel);

        this.changeShowEditableBasedOnLstString(page, addViewModel, 'show', true);
        this.changeShowEditableBasedOnLstString(page, addViewModel, 'editable', null);
        this.removeValidationLayer(page, addViewModel, 'validation', null);
      } else if (pageFor == 'show') {
        var showViewModel = this.getViewModel(page, 'show');
        //init all is allow to show and editable
        this.prepareFieldsSetDefailt(page, { show: false });

        this.changeShowEditableBasedOnLstString(page, showViewModel, 'show', true);
      }
    }
    PropsPermissions['showEditable'] = this.fileds[page];
    return PropsPermissions;
  }
}
