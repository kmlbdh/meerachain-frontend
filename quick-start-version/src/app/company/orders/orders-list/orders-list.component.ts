import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { ShippingType } from 'src/app/Shared/Enums/ShippingType';
import swal from 'sweetalert2';
import { ThirdPartytoastyService } from 'src/app/Shared/third-partytoasty.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  public isCompleteStatus = false;
  public isAssignUsers = false;
  public isRevision = false;
  firstLoad: boolean = true;
  lstOrders = [];
  lstSuppliers = [];
  TopSearchObj = {
    CreatingSearchBy: { label: 'Creating Date', value: -1 },
    ArrivalSearchBy: { label: 'Arrival Date', value: -1 },
    PrioritySearchBy: { label: 'Priority', value: -1 },
  }
  loadCard;
  _CDSS;
  CDS;
  ADS;
  CustomSearch = {};
  lstSupIds = [];
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
  searchObj: any = {}
  is_deleted = false;
  lstShippingTypes = [];
  IsDeletedSwitch() {
    this.is_deleted = !this.is_deleted;
    this.search();
  }
  lstPriorityColors = [];
  constructor(private ordersService: OrdersService, private thirdPartytoastyService: ThirdPartytoastyService) {
    this.search();
    this.lstShippingTypes = Object.keys(ShippingType).filter(key => !isNaN(Number(ShippingType[key]))).map((z, i) => {
      return {
        value: i + '',
        label: z
      }
    });
    this.lstPriorityColors[0] = { cardClass: "card-border-c-blue", due: "label-primary", btn:"btn-primary"  };
    this.lstPriorityColors[1] = { cardClass: "card-border-c-green", due: "label-success",btn:"btn-success" };
    this.lstPriorityColors[2] = { cardClass: "card-border-c-red", due: "label-danger",   btn:"btn-danger" };
  }
  clearTop() {
    this.TopSearchObj = {
      CreatingSearchBy: { label: 'Creating Date', value: -1 },
      ArrivalSearchBy: { label: 'Arrival Date', value: -1 },
      PrioritySearchBy: { label: 'Priority', value: -1 },
    }
    if (this.searchObj != undefined) {
      this.searchObj = undefined
      this.search();
    }
  }

  clearLeft(prop1, prop2 = undefined) {
    if (prop2 != undefined) {
      this.CustomSearch[prop1] = "";
      this.CustomSearch[prop2] = "";
      var z: any = document.getElementById(prop1);
      z.value = "";
      var z1: any = document.getElementById(prop2);
      z1.value = "";
    } else {
      this.lstSupIds = [];
    }
    if (this.searchObj != undefined) {
      this.searchObj = undefined
      this.search();
    }

  }
  searchBased(): any {
    if (this.TopSearchObj.CreatingSearchBy.value != -1) {
      return 'CreatingSearchBy'
    } else if (this.TopSearchObj.ArrivalSearchBy.value != -1) {
      return 'ArrivalSearchBy'
    } else if (this.TopSearchObj.PrioritySearchBy.value != -1) {
      return 'PrioritySearchBy'
    } else {
      return undefined;
    }
  }

  searchTop() {
    this.searchObj = {
      type: 'Top',
      key: this.searchBased(),
      value: this.searchBased() != undefined ? this.TopSearchObj[this.searchBased()]["value"] : -1
    }
    if (this.searchObj.key != undefined) {
      this.search();
    }
  }
  leftSearch(key, prop1 = undefined, prop2 = undefined) {
    this.CustomSearch = {};
    if (typeof prop1 != 'undefined') this.frmDate(prop1);
    if (typeof prop2 != 'undefined') this.frmDate(prop2);
    console.log(this.CustomSearch);
    this.searchObj = {
      type: 'left',
      key: key,
      Fvalue: typeof prop1 != 'undefined' ? this.CustomSearch[Object.keys(this.CustomSearch)[0]] : this.lstSupIds,
      Lvalue: Object.keys(this.CustomSearch).length > 1 ? this.CustomSearch[Object.keys(this.CustomSearch)[1]] : '',
    }
    this.search();

  }
  ngOnInit() {
  }
  frmDate(propName) {
    var z: any = document.getElementById(propName);
    this.CustomSearch[propName] = z.value;
  }
  search() {
    this.loadCard = true;
    this.ordersService.loadOrders(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.searchObj, this.firstLoad, this.is_deleted).subscribe((z: any) => {
      this.lstOrders = z.data;
      this.paggingManager.itemsPerPage = 10
      this.paggingManager.totalItems = z.totalElements;
      this.lstSuppliers = z.suppliers.length > 0 ? z.suppliers : this.lstSuppliers;

      this.lstOrders.forEach(z => z.supName = this.lstSuppliers.find(a => a.value == z.supplierId) ? this.lstSuppliers.find(a => a.value == z.supplierId).label : '')

      this.loadCard = false;
    })
    this.firstLoad = false;
  }
  pageChanged($e) {
    console.log($e);
    this.paggingManager.currentPage = $e;
    this.search();
  }
  ConfirmDelete(id, TF = true) {
    console.log('id', id);
    var txt = TF == true ? `Once deleted, this Order will moved to recycle bin` : "are u sure u won't to restore this order";
    swal({
      title: 'Are you sure?',
      text: txt,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      console.log(willDelete);
      if (willDelete.value == true) {
        this.loadCard = true;
        this.thirdPartytoastyService.addToastDefault('wait');
        this.ordersService.deleteOrder(id, TF).subscribe(z => {
          this.lstOrders = this.lstOrders.filter(a => a.id != id);
          this.thirdPartytoastyService.addToastDefault('success', 'Moved to recycle bin');
          this.loadCard = false;
        });
      }
    });
  }
}
