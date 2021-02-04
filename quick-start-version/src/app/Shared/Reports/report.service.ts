import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }

  init(filterKey) {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/reports/init?filterKey=${filterKey}`, this.httpOptions);
  }
  loadResport(filterForm,filterKey) {
    this.authenticatedHttp();
    var func = (z) => { return z.value ? z.value : z };
    Object.keys(filterForm).forEach(prop => {
      if (typeof filterForm[prop] != 'undefined' && filterForm[prop] instanceof Array) {
        filterForm[prop] = filterForm[prop].map(func)
      }
    })
    console.log(JSON.stringify(filterForm));
    return this.http.post(`http://localhost:58991/api/reports/load${filterKey}report`, filterForm, this.httpOptions);
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
