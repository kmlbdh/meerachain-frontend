import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/Shared/Orders/orders.service';

@Component({
  selector: 'app-cu-customs-calculation',
  templateUrl: './cu-customs-calculation.component.html',
  styleUrls: ['./cu-customs-calculation.component.scss']
})
export class CuCustomsCalculationComponent implements OnInit {
  orderId
  model: any
  settings: any
  constructor(private route: ActivatedRoute, private ordersService: OrdersService) {
    this.route.params.subscribe(params => {
      this.orderId = this.route.snapshot.paramMap.get('orderId');
      this.initPage()
    });





  }
  initPage() {
    this.ordersService.loadOrderCustomCalculation(this.orderId).subscribe((z: any) => {
      this.model = z.order;
      this.settings = z.settings;
      console.log(this.model);

    })
  }
  ngOnInit() {
  }

  prepareObjToServer(objToServer) {
    objToServer = {};
    objToServer['orderId'] = this.model.id;
    objToServer['portFees01Value'] = this.model.orderCustoms['portFees01Value'];
    objToServer['frieghtValue'] = this.model.orderCustoms['frieghtValue'];
    objToServer['other01Value'] = this.model.orderCustoms['other01Value'];
    objToServer['commission'] = this.model.orderCustoms['commission'];
    objToServer['other02Value'] = this.model.orderCustoms['other02Value'];
    return objToServer;
  }
  makeCustomCalculation() {
    //Prepare Obj To Server
    let objToServer = this.prepareObjToServer({});
    console.log(objToServer);
    
    this.ordersService.makeCustomCalculation(objToServer).subscribe(z => {
      console.log('makeCustomCalculation',z);
      this.initPage()
    })
  }
  cardLoad
}
