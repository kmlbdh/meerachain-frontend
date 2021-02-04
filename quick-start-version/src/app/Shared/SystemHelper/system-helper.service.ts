import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemHelperService {



  getSysHelper(pageRoute, inputId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/SystemHelper/getSysHelper?pageRoute=${pageRoute}&inputId=${inputId}`);
    return this.http.get(`http://localhost:58991/api/SystemHelper/getSysHelper?pageRoute=${pageRoute}&inputId=${inputId}`, this.httpOptions);
  }
  addEditSysHelper(obj) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/SystemHelper/addEditSysHelper`, JSON.stringify(obj));
    return this.http.post(`http://localhost:58991/api/SystemHelper/addEditSysHelper`, obj, this.httpOptions);
  }

  constructor(private http: HttpClient) {
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
