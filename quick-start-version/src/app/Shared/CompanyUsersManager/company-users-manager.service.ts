import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RegisterModule } from '../Authentication/RegisterModule';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CompanyUsersManagerService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };

  filterNulls(obj) {
    if (typeof obj.supplierAuth != 'undefined') {
      var tmp = obj.supplierAuth;
      Object.keys(tmp).forEach(prop => {
        obj.supplierAuth[prop] = tmp[prop] == "null" || tmp[prop] == "undefined" ? null : tmp[prop];
      });
    }
    return obj;
  }
  constructor(private http: HttpClient) {
  }
  RegisterUser(register: RegisterModule): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(register)));
    return this.http.post("http://localhost:58991/api/companyusersmanager/newuser", this.filterNulls(register), this.httpOptions);
  }

  updateuser(id): Observable<Object> { /*Get User To Edit*/
    this.authenticatedHttp();
    console.log(JSON.stringify(`http://localhost:58991/api/companyusersmanager/edituser?id=${id}`));
    return this.http.get(`http://localhost:58991/api/companyusersmanager/edituser?id=${id}`, this.httpOptions);
  }
  deleteuser(userid): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(`http://localhost:58991/api/companyusersmanager/deleteuser?userid=${userid}`));
    return this.http.get(`http://localhost:58991/api/companyusersmanager/deleteuser?userid=${userid}`, this.httpOptions);
  }
  deleteuseracc(userid): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(`http://localhost:58991/api/companyusersmanager/deleteuseracc?userid=${userid}`));
    return this.http.get(`http://localhost:58991/api/companyusersmanager/deleteuseracc?userid=${userid}`, this.httpOptions);
  }
  creatingAcc(register): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(register));
    return this.http.post(`http://localhost:58991/api/companyusersmanager/creatingAcc`, register, this.httpOptions);
  }
  mappingContact(mappingContact): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(mappingContact));
    return this.http.post(`http://localhost:58991/api/companyusersmanager/mappingContact`, mappingContact, this.httpOptions);
  }
  updateuserPost(register: RegisterModule): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(register)));
    return this.http.post(`http://localhost:58991/api/companyusersmanager/edituser`, this.filterNulls(register), this.httpOptions);
  }
  getLstCompaniesBasedType(userType): Observable<any> {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/companyusersmanager/getLstCompaniesBasedType?userType=${userType}`, this.httpOptions);
  }
  updateprofile(register: RegisterModule): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(register)));
    return this.http.post(`http://localhost:58991/api/companyusersmanager/updateprofile`, this.filterNulls(register), this.httpOptions);
  }
  contactsImportExcel(data): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(data)));
    return this.http.post(`http://localhost:58991/api/companyusersmanager/contactsImportExcel`, this.filterNulls(data), this.httpOptions);
  }
  loadcompnaycontacts(offset, pageSize, txtSearch, Type) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/companyusersmanager/loadcompnaycontacts?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&type=${Type == -1 ? '' : Type}`);
    return this.http.get(`http://localhost:58991/api/companyusersmanager/loadcompnaycontacts?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&type=${Type == -1 ? '' : Type}`, this.httpOptions);
  }
  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    };
  }
}
