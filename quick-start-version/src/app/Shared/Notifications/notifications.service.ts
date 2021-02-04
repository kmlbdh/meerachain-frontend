import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  getNoteChanges(noteId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/getNoteChanges?noteId=${noteId}`);
    return this.http.get(`http://localhost:58991/api/BaseNotification/getNoteChanges?noteId=${noteId}`, this.httpOptions);
  }
  loadUserNotification(offset, pageSize) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/loadUserNotification?offset=${offset}&pageSize=${pageSize}`);
    return this.http.get(`http://localhost:58991/api/BaseNotification/loadUserNotification?offset=${offset}&pageSize=${pageSize}`, this.httpOptions);
  }
  loadUserTasks(offset, pageSize, types) {
    this.authenticatedHttp();
    let typetxt = types.map(z => `&types=${z}`).join('');
    console.log(`http://localhost:58991/api/BaseNotification/loadUserTasks?offset=${offset}&pageSize=${pageSize}${typetxt}`);
    return this.http.get(`http://localhost:58991/api/BaseNotification/loadUserTasks?offset=${offset}&pageSize=${pageSize}${typetxt}`, this.httpOptions);
  }
  loadOrderNotes(offset, pageSize, orderId, types) {
    this.authenticatedHttp();
    let typetxt = types.map(z => `&types=${z}`).join('');
    console.log(`http://localhost:58991/api/BaseNotification/loadOrderNotes?offset=${offset}&pageSize=${pageSize}&orderId=${orderId}${typetxt}`);
    return this.http.get(`http://localhost:58991/api/BaseNotification/loadOrderNotes?offset=${offset}&pageSize=${pageSize}&orderId=${orderId}${typetxt}`, this.httpOptions);
  }
  gettopusernotification(lastUpdate = "") {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/gettopusernotification?lastUpdate=${lastUpdate}`);
    return this.http.get(`http://localhost:58991/api/BaseNotification/gettopusernotification?lastUpdate=${lastUpdate}`, this.httpOptions);
  }
  clearallnotification() {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/clearallnotification`);
    return this.http.post(`http://localhost:58991/api/BaseNotification/clearallnotification`, {}, this.httpOptions);
  }
  makeNotificationAsRead(notifyIds) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/makeNotificationAsRead`, JSON.stringify(notifyIds));
    return this.http.post(`http://localhost:58991/api/BaseNotification/makeNotificationAsRead`, notifyIds, this.httpOptions);
  }
  updateBaseNotification(note) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/updateBaseNotification`, JSON.stringify(note));
    return this.http.post(`http://localhost:58991/api/BaseNotification/updateBaseNotification`, note, this.httpOptions);
  }
  MakeNoteAsDone(noteId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/MakeNoteAsDone?noteId=${noteId}`);
    return this.http.post(`http://localhost:58991/api/BaseNotification/MakeNoteAsDone?noteId=${noteId}`, {}, this.httpOptions);
  }
  UndoDone(noteId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/UndoDone?noteId=${noteId}`);
    return this.http.post(`http://localhost:58991/api/BaseNotification/UndoDone?noteId=${noteId}`, {}, this.httpOptions);
  }
  addReplay(note) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/addReplay`, JSON.stringify(note));
    return this.http.post(`http://localhost:58991/api/BaseNotification/addReplay`, note, this.httpOptions);
  }
  add(note) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/add`, JSON.stringify(note));
    return this.http.post(`http://localhost:58991/api/BaseNotification/add`, note, this.httpOptions);
  }
  initAddOrderNote(orderId) {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/BaseNotification/initAddOrderNote?orderId=${orderId}`);
    return this.http.get(`http://localhost:58991/api/BaseNotification/initAddOrderNote?orderId=${orderId}`, this.httpOptions);
  }

  constructor(private http: HttpClient) {
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
