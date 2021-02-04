import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss']
})
export class QuickSearchComponent implements OnInit {
  searchModel = {fromAD:'',toAD:'',strSearch:'',isCleared:'',}
  loadCard
  lstOrder
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 100
  }
  dbclickRow(i) {
    console.log();
    
    this._router.navigate(['./impostorcompany/orders/cu'], {
      queryParams: { t: 'e', i: i }
    });
  }
  constructor(private ordersService: OrdersService,private _router: Router) { }
  ngOnInit() {
  }
  search() {
    this.loadCard = true;
    this.ordersService.QuickSearch(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage, this.searchModel).subscribe((z: any) => {
      this.lstOrder = z.data;
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
      console.log(this.lstOrder);
    })
  }
  pageChanged($e) {
    console.log($e);
    this.paggingManager.currentPage = $e;
    this.search();
  }

}
