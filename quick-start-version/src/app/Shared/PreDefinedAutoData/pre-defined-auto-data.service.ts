import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreDefinedAutoDataModel } from './PreDefinedAutoDataModel';

@Injectable({
  providedIn: 'root'
})
export class PreDefinedAutoDataService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }
  //
  loadpredefinedautodata(offset, pageSize, txtSearch,Type) {
    this.authenticatedHttp();
    console.log("offset,pageSize", offset, pageSize,txtSearch);
    // if(Type != -1){ // rest offset
    //   offset = 0;
    // }
    console.log(`http://localhost:58991/api/predefinedautoData/loadpredefinedautodata?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&type=${Type == -1 ? '' : Type}`);
    
    return this.http.get(`http://localhost:58991/api/predefinedautoData/loadpredefinedautodata?offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}&type=${Type == -1 ? '' : Type}`, this.httpOptions);
  }
  loadallpredefinedbasedtype(Type) {
    this.authenticatedHttp();
    console.log("Type",Type);
    if(Type == 7 || Type == 8) Type = 4; //this is port mapping
    return this.http.get<PreDefinedAutoDataModel[]>(`http://localhost:58991/api/predefinedautoData/loadallpredefinedbasedtype?type=${Type}`, this.httpOptions);
  }
  addNew(PDAD: PreDefinedAutoDataModel) {
    this.authenticatedHttp();
    console.log(JSON.stringify(PDAD));
    return this.http.post("http://localhost:58991/api/predefinedautoData/addnew", PDAD, this.httpOptions);
  }
  edit(PDAD: PreDefinedAutoDataModel) {
    this.authenticatedHttp();
    console.log(JSON.stringify(PDAD));
    return this.http.post("http://localhost:58991/api/predefinedautoData/edit", PDAD, this.httpOptions);
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
