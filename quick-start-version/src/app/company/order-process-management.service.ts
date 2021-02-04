import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderProcessManagementService {

  public CustomProcessOrderContainerChange = new Subject();
  constructor() {
    this.CustomProcessOrderContainerChange = new Subject()
  }
}
