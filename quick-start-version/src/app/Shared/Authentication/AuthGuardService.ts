import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _router: Router, private authenticatedServiceService: AuthenticationService) {
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem("token") != null) { //User Auth
      let roles = next.data['permittedRoles'] as Array<string>; //Get Url Role Require
      console.log("localStorage.getItem(toke) true",roles);

      if (roles) {
        if (this.authenticatedServiceService.roleMatch(roles)) return true; //Test Our Role
        else {
          this._router.navigate(['/forbidden']);
          return false;
        }
      }
      return true;
    }
    console.log("localStorage.getItem(toke) false");

    // navigate to login page
      this._router.navigate(['/auth/signin']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
