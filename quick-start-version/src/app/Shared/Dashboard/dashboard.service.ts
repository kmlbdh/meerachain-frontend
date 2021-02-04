import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  httpOptions;
  constructor(private http: HttpClient) {
  }
  orderShortReport(offset, pageSize): any {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/dashboard/orderShortReport?offset=${offset}&pageSize=${pageSize}`);
    return this.http.get(`http://localhost:58991/api/dashboard/orderShortReport?offset=${offset}&pageSize=${pageSize}`, this.httpOptions);
  }
  loadUserAssigned(offset, pageSize) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/dashboard/loadUserAssigned?offset=${offset}&pageSize=${pageSize}`);
    return this.http.get(`http://localhost:58991/api/dashboard/loadUserAssigned?offset=${offset}&pageSize=${pageSize}`, this.httpOptions);
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
