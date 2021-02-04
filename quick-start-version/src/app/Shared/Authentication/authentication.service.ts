import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit {

  UserRole: string;
  constructor(private http: HttpClient, private router: Router) {
  }
  ngOnInit() {
    try {
    } catch (e) { }
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    })
  };
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole;
    if (payLoad.role instanceof Array) {
      userRole = payLoad.role;
    } else {
      userRole = [];
      userRole.push(payLoad.role);
    }
    console.log(allowedRoles, userRole);

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
  redirectUserBasedRole() {
    try {
      console.log("redirectUserBasedRole");

      if (this.roleMatch(['ImpostorCompany', 'AccToCompany']))
        this.router.navigate(['/impostorcompany']);
      else if (this.roleMatch(['TechnicalAdmin']))
        this.router.navigate(['/technicaladmin']);
      else if (this.roleMatch(['CustomAgentCompany']))
        this.router.navigate(['/customAgentCompany']);

      // var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
      // this.UserRole = (<string>payLoad.role).toLowerCase();
      // let url = '/' + this.UserRole;
      // console.log(url);

    } catch (e) { }
  }
}
