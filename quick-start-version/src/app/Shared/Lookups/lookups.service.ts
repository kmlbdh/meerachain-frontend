import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  constructor(private http: HttpClient) {
  }
  companycontactbasedtype(type) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/lookups/companycontactbasedtype?type=${type}`);
    return this.http.get(`http://localhost:58991/api/lookups/companycontactbasedtype?type=${type}`, this.httpOptions);
  }
  companypredefineddata(type) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/lookups/companypredefineddata?type=${type}`);
    return this.http.get(`http://localhost:58991/api/lookups/companypredefineddata?type=${type}`, this.httpOptions);
  }
  companywarehouse() {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/lookups/companywarehouse`);
    return this.http.get(`http://localhost:58991/api/lookups/companywarehouse`, this.httpOptions);
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };

  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    };
  }
}
