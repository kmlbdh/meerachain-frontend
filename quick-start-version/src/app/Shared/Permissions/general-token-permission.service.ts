import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralTokenPermissionService implements CanActivate {

  constructor(private _route: Router) { }
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
      console.log('payLoad++', payLoad);
      if (typeof payLoad == 'undefined') {
        this._route.navigate(["auth/signin"])
      } else return true
    } catch (ex) {
      this._route.navigate(["auth/signin"])
    }
  }
}
