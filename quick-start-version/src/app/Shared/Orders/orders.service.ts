import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { LocalCacheService } from '../local-cache.service';
import { LocalStorageService } from '../local-storage.service';
import { Orders } from './Orders';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  initOrderPageObs: Observable<{}>;

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
  // updatecontainers(lstContainers) {
  //   this.authenticatedHttp();
  //   console.log(JSON.stringify(lstContainers));
  //   lstContainers.forEach(cont => {
  //     cont = this.EmptyToNulls(this.PrepareProp(cont));
  //   });
  //   return this.http.post("http://localhost:58991/api/order/updatecontainers", lstContainers, this.httpOptions);
  // }
  constructor(private http: HttpClient, private router: Router, private cache: LocalCacheService, private get: LocalStorageService) {
  }
  loadOrders(offset, pageSize, searchObj, firstLoad, is_deleted) {
    var strSearch = "";
    if (searchObj != undefined)
      Object.keys(searchObj).forEach(propName => {
        strSearch += "&" + propName + "=" + searchObj[propName];
      })
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/loadOrders?offset=${offset}&pageSize=${pageSize}${strSearch}&firstLoad=${firstLoad}&is_deleted=${is_deleted}`);

    return this.http.get(`http://localhost:58991/api/order/loadOrders?offset=${offset}&pageSize=${pageSize}${strSearch}&firstLoad=${firstLoad}&is_deleted=${is_deleted}`, this.httpOptions);
  }
  getSupItemIds(supId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/getSupItemIds?supId=${supId}`);
    return this.http.get(`http://localhost:58991/api/order/getSupItemIds?supId=${supId}`, this.httpOptions);
  }
  loadOrderCustomCalculation(orderId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/loadOrderCustomCalculation?orderId=${orderId}`);
    return this.http.get(`http://localhost:58991/api/order/loadOrderCustomCalculation?orderId=${orderId}`, this.httpOptions);
  }
  loadOrderCustomPaymentTable() {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/loadOrderCustomPaymentTable`);
    return this.http.get(`http://localhost:58991/api/order/loadOrderCustomPaymentTable`, this.httpOptions);
  }
  addNewCustomPayment(obj) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/addNewCustomPayment`, JSON.stringify(obj));
    return this.http.post(`http://localhost:58991/api/order/addNewCustomPayment`, obj, this.httpOptions);
  }
  makeCustomCalculation(obj) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/makeCustomCalculation`, JSON.stringify(obj));
    return this.http.post(`http://localhost:58991/api/order/makeCustomCalculation`, obj, this.httpOptions);
  }
  loadPerformas(offset, pageSize, is_deleted) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/performaspecifications/loadPerformas?offset=${offset}&pageSize=${pageSize}&is_deleted=${is_deleted}`);
    return this.http.get(`http://localhost:58991/api/performaspecifications/loadPerformas?offset=${offset}&pageSize=${pageSize}&is_deleted=${is_deleted}`, this.httpOptions);
  }
  loadPerformaOrders(id) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/performaspecifications/loadPerformaOrders?id=${id}`);
    return this.http.get(`http://localhost:58991/api/performaspecifications/loadPerformaOrders?id=${id}`, this.httpOptions);
  }
  QuickSearch(offset, pageSize, searchObj) {
    var strSearch = "";
    if (searchObj != undefined)
      Object.keys(searchObj).forEach(propName => {
        if (typeof searchObj[propName] != 'undefined')
          strSearch += "&" + propName + "=" + searchObj[propName];
      })
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/QuickSearch?offset=${offset}&pageSize=${pageSize}${strSearch}`);

    return this.http.get(`http://localhost:58991/api/order/QuickSearch?offset=${offset}&pageSize=${pageSize}${strSearch}`, this.httpOptions);
  }
  loadCustomPaymentTable(offset, pageSize) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/loadCustomPaymentTable?offset=${offset}&pageSize=${pageSize}`);
    return this.http.get(`http://localhost:58991/api/order/loadCustomPaymentTable?offset=${offset}&pageSize=${pageSize}`, this.httpOptions);
  }
  deleteCustomPayment(paymentId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/deleteCustomPayment?paymentId=${paymentId}`);
    return this.http.delete(`http://localhost:58991/api/order/deleteCustomPayment?paymentId=${paymentId}`, this.httpOptions);
  }
  initOrderPage() {
    this.authenticatedHttp();
    if (this.router.url.split('/')[2] != 'performas') {
      console.log(`http://localhost:58991/api/order/initOrderPage`);
      return this.http.get(`http://localhost:58991/api/order/initOrderPage`, this.httpOptions);
    } else {
      console.log(`http://localhost:58991/api/performaspecifications/initOrderPage`);
      return this.http.get(`http://localhost:58991/api/performaspecifications/initOrderPage`, this.httpOptions);
    }
  }
  editOrder(id, orderType) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/editOrder?id=${id}&orderType=${orderType}`);
    return this.http.get(`http://localhost:58991/api/order/editOrder?id=${id}&orderType=${orderType}`, this.httpOptions)
  }
  deleteOrder(id, is_deleted) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/deleteOrder?id=${id}&is_deleted=${is_deleted}`);
    return this.http.delete(`http://localhost:58991/api/order/deleteOrder?id=${id}&is_deleted=${is_deleted}`, this.httpOptions)
  }

  // addnew
  addNewPerforma(order: Orders) {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(order)));
    return this.http.post("http://localhost:58991/api/performaspecifications/addNewPerforma", this.filterNulls(order), this.httpOptions);
  }
  prepareOrder(order) {
    // if (order.orderContainers) {
    //   order.orderContainers.forEach(container => {
    //     if (typeof container != 'undefined') {
    //       container['containerType'] = undefined;
    //     }
    //   });
    // }
  }
  addNew(order: Orders) {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(order)));


    return this.http.post("http://localhost:58991/api/order/addnew", this.filterNulls(order), this.httpOptions);
  }
  details(id, orderType) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/order/details?id=${id}&orderType=${orderType}`);
    return this.http.get(`http://localhost:58991/api/order/details?id=${id}&orderType=${orderType}`, this.httpOptions)
  }
  edit(order: Orders) {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(order)));
    return this.http.post("http://localhost:58991/api/order/edit", this.filterNulls(order), this.httpOptions);
  }
  EditPerforma(order: Orders) {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(order)));
    return this.http.post("http://localhost:58991/api/performaspecifications/EditPerforma", this.filterNulls(order), this.httpOptions);
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };

  filterNulls(obj) {
    var tmp = obj;
    Object.keys(tmp).forEach(prop => {
      obj[prop] = tmp[prop] == "null" || tmp[prop] == "undefined" ? null : tmp[prop];
    });
    return obj;
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
