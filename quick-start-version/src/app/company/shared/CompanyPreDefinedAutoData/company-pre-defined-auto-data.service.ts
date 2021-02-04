import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CompanyPreDefinedAutoData } from './CompanyPreDefinedAutoData';
import { CacheService } from 'src/app/Shared/Cacheing/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPreDefinedAutoDataService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient, private cacheService: CacheService) {
  }
  //
  addnew(item) {
    this.authenticatedHttp();
    return this.http.post(`http://localhost:58991/api/companypredefinedautodata/addnew`, item, this.httpOptions);
  }//
  loadallcompanypredefined(syskey) {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/companypredefinedautodata/loadallcompanypredefined?syskey=${syskey}`, this.httpOptions);
  }
  getCompanySetupData() {
    this.authenticatedHttp();
    return this.cacheService.observeAPI('getCompanySetupData', this.http.get("http://localhost:58991/api/companypredefinedautodata/getCompanySetupData", this.httpOptions));
    // return this.http.get(`http://localhost:58991/api/companypredefinedautodata/getCompanySetupData`, this.httpOptions);
  }
  getCompanySetupDataFreeTraidContries() {
    this.authenticatedHttp();
    // return this.cacheService.observeAPI('getCompanySetupDataFreeTraidContries', this.http.get("http://localhost:58991/api/companypredefinedautodata/getCompanySetupDataFreeTraidContries", this.httpOptions));
    return this.http.get(`http://localhost:58991/api/companypredefinedautodata/getCompanySetupDataFreeTraidContries`, this.httpOptions);
  }
  addCompanyCurrencyBalance(obj) {
    this.authenticatedHttp();
    return this.http.post(`http://localhost:58991/api/companypredefinedautodata/addCompanyCurrencyBalance`, obj, this.httpOptions);
  }
  deleteCompanyCurrencyBalance(date, currencyId) {
    this.authenticatedHttp();
    return this.http.delete(`http://localhost:58991/api/companypredefinedautodata/deleteCompanyCurrencyBalance?date=${date}&currencyId=${currencyId}`, this.httpOptions);
  }
  getCompanyCurrencyBalance() {
    this.authenticatedHttp();
    // return this.cacheService.observeAPI('getCompanyCurrencyBalance', this.http.get("http://localhost:58991/api/companypredefinedautodata/getCompanyCurrencyBalance", this.httpOptions));
    return this.http.get(`http://localhost:58991/api/companypredefinedautodata/getCompanyCurrencyBalance`, this.httpOptions);
  }
  addeditcompanysetupdata(obj) {
    console.log(JSON.stringify(obj))
    this.authenticatedHttp();
    this.cacheService.removeCacheAPI("getCompanySetupData")
    return this.http.post(`http://localhost:58991/api/companypredefinedautodata/addeditcompanysetupdata`, obj, this.httpOptions);
  }
  delete(type, Itmid) {
    this.authenticatedHttp();
    return this.http.post(`http://localhost:58991/api/companypredefinedautodata/delete`, new CompanyPreDefinedAutoData({ originId: Itmid, tupleType: type }), this.httpOptions);
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
