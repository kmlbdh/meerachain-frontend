import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COrdersService } from 'src/app/Shared/CustomAgentCompany/Orders/corders.service';
import { CContactsService } from 'src/app/Shared/CustomAgentCompany/Contacts/ccontacts.service';

@Component({
  selector: 'app-corders',
  templateUrl: './corders.component.html',
  styleUrls: ['./corders.component.scss']
})
export class COrdersComponent implements OnInit {
  lstOrders = [];
  lstContacts = [];
  loadCard = false;
  isCleared = new FormControl('');
  arrivalDateF = new FormControl('');
  arrivalDateT = new FormControl('');
  importorscompanies = new FormControl();
  lstPriorityColors = []
  constructor(private cOrdersService: COrdersService, private cContactsService: CContactsService) {


    this.importorscompanies.valueChanges.subscribe(z => { 
      console.log(z,'importorscompanies');
      
      this.search() })
    this.isCleared.valueChanges.subscribe(z => this.search())
    this.arrivalDateF.valueChanges.subscribe(z => this.search())
    this.arrivalDateT.valueChanges.subscribe(z => this.search())


    this.lstPriorityColors[0] = { cardClass: "card-border-c-blue", due: "label-primary", btn: "btn-primary" };
    this.lstPriorityColors[1] = { cardClass: "card-border-c-green", due: "label-success", btn: "btn-success" };
    this.lstPriorityColors[2] = { cardClass: "card-border-c-red", due: "label-danger", btn: "btn-danger" };


    this.search()
    this.loadRelatedContacts()
  }
  ngOnInit() {
  }

  loadRelatedContacts() {
    this.cContactsService.getContacts().subscribe(z => {
      this.lstContacts = z;
    })
  }

  search() {
    this.loadCard = true;
    this.cOrdersService.load(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.isCleared.value, this.arrivalDateF.value, this.arrivalDateT.value, this.importorscompanies.value ? this.importorscompanies.value.join(',') : '').subscribe(z => {
      console.log(z);
      this.lstOrders = z.data;
      this.paggingManager.itemsPerPage = 10
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
    })
  }
  pageChanged($e) {
    console.log($e);
    this.paggingManager.currentPage = $e;
    this.search();
  }
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
}
