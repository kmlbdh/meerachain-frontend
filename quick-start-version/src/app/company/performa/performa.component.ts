import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { Router } from '@angular/router';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-performa',
  templateUrl: './performa.component.html',
  styleUrls: ['./performa.component.scss']
})
export class PerformaComponent implements OnInit {
  loadCard = false;
  lstPerformas = [];
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

  canCreate = false;
  canCreateOrderFromPerforma = false;
  canEditPerforma = false;
  constructor(private _router:Router,private ordersService: OrdersService,private permissionsManagerService:PermissionsManagerService) { 
    this.search()

    this.canCreate = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'performas', //For loop and get any thing is access == true
          subAccess: ['add']
        }
      ]
    );
    this.canCreateOrderFromPerforma = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'performas', //For loop and get any thing is access == true
          subAccess: ['createOrderFromPerforma']
        }
      ]
    );
    this.canEditPerforma = this.permissionsManagerService.checkForPermissionInSpecificPage(
      [
        {
          main: 'performas', //For loop and get any thing is access == true
          subAccess: ['edit']
        }
      ]
    );
  }
  lstPerformasOrders = []
  searchObj: any = {}
  firstLoad = true;
  is_deleted = false;
  search() {
    this.loadCard = true;
    this.ordersService.loadPerformas(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.is_deleted).subscribe((z: any) => {
      console.log(z);
      this.lstPerformas = z.data;
      this.paggingManager.itemsPerPage = 10
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
    })
    this.firstLoad = false;
  }
  createPerforma() {
    this._router.navigate(['./impostorcompany/performas/cu']);
    // this._router.navigate(['./impostorcompany/performas/cu'], {
    //   queryParams: { t: 'a', i: row.id }
    // });
  }
  openPerformaOrder(i) {
    this._router.navigate(['./impostorcompany/orders/cu'], {
      queryParams: { t: 'e', i: i }
    });
  }
  loadSinglePerformaOrders(id){
    if(!this.lstPerformasOrders[id+'']){
      this.lstPerformasOrders[id+''] = {};
      this.lstPerformasOrders[id+'']['expand'] = true;
      this.lstPerformasOrders[id+'']['load'] = true;
      this.ordersService.loadPerformaOrders(id).subscribe(z =>{
        this.lstPerformasOrders[id+'']['orders'] = z;
        this.lstPerformasOrders[id+'']['load'] = false;
        console.log(this.lstPerformasOrders[id+'']);
      })
    }else{
      this.lstPerformasOrders[id+'']['expand'] = !this.lstPerformasOrders[id+'']['expand'];
    }
  }
  ngOnInit() {
  }

}
