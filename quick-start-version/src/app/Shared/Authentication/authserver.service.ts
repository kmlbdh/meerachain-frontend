import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoginModel } from './LoginModel';
import { Observable } from 'rxjs';
import { RegisterModule } from './RegisterModule';

@Injectable({
  providedIn: 'root'
})
export class AuthserverService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }
  Login(userLoginInfo: LoginModel): Observable<Object> {
    console.log(JSON.stringify(userLoginInfo));
    return this.http.post("http://localhost:58991/api/usersmanager/login", userLoginInfo, this.httpOptions);
  }
  RegisterUser(register: RegisterModule): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(register));
    return this.http.post("http://localhost:58991/api/usersmanager/newuser", register, this.httpOptions);
  }
  updateuserinfo(register: RegisterModule): Observable<Object> {
    this.authenticatedHttp();
    console.log(JSON.stringify(register));
    return this.http.post("http://localhost:58991/api/usersmanager/updateuserinfo", register, this.httpOptions);
  }
  loadAllAccBasedUserType(ut,offset, pageSize, txtSearch) {
    // this.authenticatedHttp();
    console.log("offset,pageSize", offset, pageSize,txtSearch);

    return this.http.get(`http://localhost:58991/api/usersmanager/loadallaccbasedusertype?ut=${ut}&offset=${offset}&pageSize=${pageSize}&txtSearch=${txtSearch}`);
  }
  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    };
  }
  // loadCurrentLogedUser(): Observable<RegisterModule> {
  //   this.authenticatedHttp();
  //   return this.http.get<RegisterModule>("http://localhost:1296..http://localhost:58991/api//usersmanager/loadcurrentlogeduser", this.httpOptions);
  // }
  // loadallaccounts(): Observable<RegisterModule[]> {
  //   this.authenticatedHttp();
  //   return this.http.get<RegisterModule[]>("http://localhost:1296..http://localhost:58991/api//usersmanager/loadallaccounts", this.httpOptions);
  // }
  getsingleuserbyid(id,systemApiKeys): Observable<RegisterModule> {
    this.authenticatedHttp();
    return this.http.get<RegisterModule>(`http://localhost:58991/api/usersmanager/getsingleuserbyid?id=${id}&systemApiKeys=${systemApiKeys}`, this.httpOptions);
  }   
  // getsingleuserprofilebyid(id): Observable<Object> {
  //   this.authenticatedHttp();
  //   return this.http.get(`http://localhost:1296..http://localhost:58991/api//usersmanager/getsingleuserprofilebyid?id=${id}`, this.httpOptions);
  // } 
  // getalluserbasedusertype(userType): Observable<RegisterModule[]> {
  //   this.authenticatedHttp();
  //   return this.http.get<RegisterModule[]>(`http://localhost:1296..http://localhost:58991/api//usersmanager/getalluserbasedusertype?userType=${userType}`, this.httpOptions);
  // }
}
