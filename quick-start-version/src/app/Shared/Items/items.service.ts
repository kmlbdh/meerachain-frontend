import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Item } from './item';
import { CacheService } from '../Cacheing/cache.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { Validators } from '@angular/forms';
import { PermissionsManagerService } from '../Permissions/permissions-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
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
  constructor(private http: HttpClient, private cacheService: CacheService) {
  }
  addNew(itm: Item) {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(itm)));
    return this.http.post("http://localhost:58991/api/items/addnew", this.filterNulls(itm), this.httpOptions);
  }
  edit(itm: Item) {
    this.authenticatedHttp();
    console.log(JSON.stringify(this.filterNulls(itm)));
    return this.http.post("http://localhost:58991/api/items/update", this.filterNulls(itm), this.httpOptions);
  }
  loadcompanyitems(offset, pageSize, txtSearch, CatId, loadAllCat, ) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/items/loadcompanyitems?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&CatId=${CatId == -1 ? '' : CatId}&loadAllCat=${loadAllCat}`);
    return this.http.get(`http://localhost:58991/api/items/loadcompanyitems?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&CatId=${CatId == -1 ? '' : CatId}&loadAllCat=${loadAllCat}`, this.httpOptions);
  }
  loadallcompanyitems(supid, systemApiKeys) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/items/loadallcompanyitems?supid=${supid}&s=${systemApiKeys}`);
    return this.http.get(`http://localhost:58991/api/items/loadallcompanyitems?supid=${supid}&s=${systemApiKeys}`, this.httpOptions);
  }
  oncraetepageinit() {
    this.authenticatedHttp();
    console.log('http://localhost:58991/api/items/oncraetepageinit');
    // return this.cacheService.observeAPI('oncraetepageinit', this.http.get("http://localhost:58991/api/items/oncraetepageinit", this.httpOptions));
    return this.http.get("http://localhost:58991/api/items/oncraetepageinit", this.httpOptions);
  }
  oneditpageinit(id) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/items/oneditpageinit?id=${id}`);
    return this.http.get(`http://localhost:58991/api/items/oneditpageinit?id=${id}`, this.httpOptions);
  }
  showitemdetails(id) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/items/showitemdetails?id=${id}`);
    return this.http.get(`http://localhost:58991/api/items/showitemdetails?id=${id}`, this.httpOptions);
  }
  delete(id) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/items/getall?id=${id}`);
    return this.http.get(`http://localhost:58991/api/items/getall?id=${id}`, this.httpOptions);
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
