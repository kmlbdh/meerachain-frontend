import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class COrdersService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }
  load(offset,pageSize,isCleared,arrivalDateF,arrivalDateT,importorscompanies):Observable<any> {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/customAgent/CustomAgentOrder/loadOrders?offset=${offset}&pageSize=${pageSize}&isCleared=${isCleared}&arrivalDateF=${arrivalDateF}&arrivalDateT=${arrivalDateT}&importorscompanies=${importorscompanies}`);
    return this.http.get(`http://localhost:58991/api/customAgent/CustomAgentOrder/loadOrders?offset=${offset}&pageSize=${pageSize}&isCleared=${isCleared}&arrivalDateF=${arrivalDateF}&arrivalDateT=${arrivalDateT}&importorscompanies=${importorscompanies}`, this.httpOptions);
  }
  singleOrder(id):Observable<any> {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/customAgent/CustomAgentOrder/singleOrder?orderId=${id}`);
    return this.http.get(`http://localhost:58991/api/customAgent/CustomAgentOrder/singleOrder?orderId=${id}`, this.httpOptions);
  }
  
  editOrder(obj):Observable<any> {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/customAgent/CustomAgentOrder/editOrder`,JSON.stringify(obj));
    return this.http.post(`http://localhost:58991/api/customAgent/CustomAgentOrder/editOrder`,obj, this.httpOptions);
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
