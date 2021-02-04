import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';
import { OrderManagementService } from '../order-management.service';

@Component({
  selector: 'app-show-order-details',
  templateUrl: './show-order-details.component.html',
  styleUrls: ['./show-order-details.component.scss']
})
export class ShowOrderDetailsComponent implements OnInit {

  PGHead = 'Order Details';
  detailsObject = {};
  pageLoad = false;
  constructor(private route: ActivatedRoute, private ordersService: OrdersService, private orderManagementService: OrderManagementService) {
    this.getAutharizationLevel('show');
    
    this.route.queryParams
      .subscribe(params => {
        this.pageLoad = true;
        this.ordersService.details(params.i, 0).subscribe(z => {
          this.detailsObject = z;
          console.log(z);
          this.pageLoad = false;
        })
      });

  }
  pageLoaded = false;
  fileds = {
    'main': undefined,
    'orderGenerals': undefined,
    'orderShippings': undefined,
    'orderCustoms': undefined,
    'orderContainers': undefined,
    'orderItems': undefined
  };
  getAutharizationLevel(mode) {
    if (!this.fileds['main']) {
      this.fileds['main'] = this.orderManagementService.getOrderPartsFileds('main', mode)['showEditable'];
      this.fileds['orderGenerals'] = this.orderManagementService.getOrderPartsFileds('orderGenerals', mode)['showEditable'];
      this.fileds['orderShippings'] = this.orderManagementService.getOrderPartsFileds('orderShippings', mode)['showEditable'];
      this.fileds['orderCustoms'] = this.orderManagementService.getOrderPartsFileds('orderCustoms', mode)['showEditable'];
      this.fileds['orderContainers'] = this.orderManagementService.getOrderPartsFileds('orderContainers', mode)['showEditable'];
      this.fileds['orderItems'] = this.orderManagementService.getOrderPartsFileds('orderItems', mode)['showEditable'];
      this.pageLoaded = true;
      console.log("FIELD", this.fileds);
    }
  }
  ngOnInit() {
  }

}
