import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Category } from './Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }
  addNew(cat: Category) {
    this.authenticatedHttp();
    console.log(JSON.stringify(cat));
    return this.http.post("http://localhost:58991/api/category/addnew", cat, this.httpOptions);
  }
  edit(cat: Category) {
    this.authenticatedHttp();
    console.log(JSON.stringify(cat));
    return this.http.post("http://localhost:58991/api/category/update", cat, this.httpOptions);
  }
  getAll(txtSearch) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/category/getall?txtSearch=${txtSearch}`);
    return this.http.get(`http://localhost:58991/api/category/getall?txtSearch=${txtSearch}`, this.httpOptions);
  }
  
  delete(id) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/category/getall?id=${id}`);
    return this.http.get(`http://localhost:58991/api/category/getall?id=${id}`, this.httpOptions);
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
