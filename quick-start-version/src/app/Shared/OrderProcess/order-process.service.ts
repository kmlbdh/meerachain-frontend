import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalCacheService } from '../local-cache.service';
import { LocalStorageService } from '../local-storage.service';
import { TruckPayment } from '../Orders/TruckPayment';

@Injectable({
  providedIn: 'root'
})
export class OrderProcessService {

  constructor(private http: HttpClient) {
  }
  EmptyToNulls(z) {
    Object.keys(z).forEach(prop => {
      z[prop] = z[prop] == "" || z[prop] == "undefined" ? null : z[prop];
    })
    return z;
  }

  PrepareProp(itm) {
    Object.keys(itm).forEach(propName => {
      itm[propName] = typeof itm[propName] == 'undefined' || itm[propName] == null || itm[propName] == 'null' ? '' : itm[propName];
    });
    return itm;
  }
  setColorStatus(lstOrders: any) {
    lstOrders.forEach(order => {
      if (Number(order.colorOrderProcessStatus) == 0) {
        order.classRow = 'alert-success'
      } else if (Number(order.colorOrderProcessStatus) == 1) {
        order.classRow = 'alert-secondary'
      } else if (Number(order.colorOrderProcessStatus) == 2) {
        order.classRow = 'alert-warning'
      } else if (Number(order.colorOrderProcessStatus) == 3) {
        order.classRow = 'alert-danger'
      }
    });
    return lstOrders;
  }
  loadPageReqOrders(type) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/orderprocess/loadPageReqOrders?type=${type}`);
    return this.http.get(`http://localhost:58991/api/orderprocess/loadPageReqOrders?type=${type}`, this.httpOptions);
  }
  changearrivaldatetoport(order) {
    this.authenticatedHttp();
    console.log(JSON.stringify(order));
    return this.http.post("http://localhost:58991/api/orderprocess/changearrivaldatetoport", order, this.httpOptions);
  }
  updatecustomprocessstate(orderCustoms) {
    this.authenticatedHttp();
    console.log(JSON.stringify(orderCustoms));
    return this.http.post("http://localhost:58991/api/orderprocess/updatecustomprocessstate", orderCustoms, this.httpOptions);
  }
  updatecontainerprocessstate(lstContainers) {
    this.authenticatedHttp();
    console.log(JSON.stringify(lstContainers));
    lstContainers.forEach(cont => {
      cont = this.EmptyToNulls(this.PrepareProp(cont));
    });
    return this.http.post("http://localhost:58991/api/orderprocess/updatecontainerprocessstate", lstContainers, this.httpOptions);
  }
  updateshippingprocessstate(orderShippings) {
    this.authenticatedHttp();
    console.log(JSON.stringify(orderShippings));
    return this.http.post("http://localhost:58991/api/orderprocess/updateshippingprocessstate", orderShippings, this.httpOptions);
  }
  loadOrders(offset, pageSize,txtSearch, type, custPS?, shipPS = 0, containerPs = 0, inlandShipper?) {

    this.authenticatedHttp();
    //console.log("offset,pageSize", offset, pageSize, custPS, shipPS, containerPs);
    //console.log(`http://localhost:58991/api/orderprocess/loadOrders?offset=${offset}&pageSize=${pageSize}&type=${type}&custPS=${custPS}&shipPS=${shipPS}&containerPs=${containerPs}&inlandShipper=${inlandShipper}`);
    if (!inlandShipper)
      return this.http.get(`http://localhost:58991/api/orderprocess/loadOrders?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&type=${type}&custPS=${custPS}&shipPS=${shipPS}&containerPs=${containerPs}&inlandShipper=${inlandShipper}`, this.httpOptions);
     else
       return this.http.get(`http://localhost:58991/api/orderprocess/loadOrders?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&type=${type}&custPS=${custPS}&shipPS=${shipPS}&containerPs=6&inlandShipper=${inlandShipper}`, this.httpOptions);
  }
  loadOrdersForTruckPayments(truckPaymentId) {
    this.authenticatedHttp();
       return this.http.get(`http://localhost:58991/api/orderprocess/loadOrdersForTruckPayments?truckPaymentId=${truckPaymentId}`, this.httpOptions);
  }
  addTruckPayment(payment:TruckPayment) {
    this.authenticatedHttp();
    console.log(JSON.stringify(payment));
    return this.http.post("http://localhost:58991/api/orderprocess/addTruckPayment", payment, this.httpOptions);
  }
  getTruckPayments(offset, pageSize) {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/orderprocess/truckPayments?offset=${offset}&pageSize=${pageSize}`, this.httpOptions);
  }
  getContainersRate(inlandShipperId) {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/orderprocess/containersRate?inlandShipperId=${inlandShipperId}`, this.httpOptions);
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
