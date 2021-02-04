import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Warehouses } from './Warehouses';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }
  addNew(WH: Warehouses) {
    this.authenticatedHttp();
    console.log(JSON.stringify(WH));
    return this.http.post("http://localhost:58991/api/warehouses/addnew", WH, this.httpOptions);
  }
  edit(WH: Warehouses) {
    this.authenticatedHttp();
    console.log(JSON.stringify(WH));
    return this.http.post("http://localhost:58991/api/warehouses/update", WH, this.httpOptions);
  }
  getAll() {
    this.authenticatedHttp();
    console.log('http://localhost:58991/api/warehouses/getall');
    return this.http.get("http://localhost:58991/api/warehouses/getall", this.httpOptions);
  }
  
  delete(id) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/warehouses/getall?id=${id}`);
    return this.http.get(`http://localhost:58991/api/warehouses/getall?id=${id}`, this.httpOptions);
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
