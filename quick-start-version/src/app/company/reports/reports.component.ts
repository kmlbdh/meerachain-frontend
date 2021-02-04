import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  PageFor = 0;
  
  orderIsAutharizated;
  containerIsAutharizated;
  anyItemIsAutharizated;
  item01IsAutharizated;
  item02IsAutharizated;
  item03IsAutharizated;
  constructor(private router: Router,private permissionsManagerService: PermissionsManagerService) {
    if (this.router.url.includes('item-filter-page')) {
      console.log("item-filter-page");
      this.PageFor = 1;
    }
    this.orderIsAutharizated = this.permissionsManagerService.ReportPageAutharizatioonManager('order');
    this.containerIsAutharizated = this.permissionsManagerService.ReportPageAutharizatioonManager('container');
    this.item01IsAutharizated = this.permissionsManagerService.ReportPageAutharizatioonManager('item01');
    this.item02IsAutharizated = this.permissionsManagerService.ReportPageAutharizatioonManager('item02');
    this.item03IsAutharizated = this.permissionsManagerService.ReportPageAutharizatioonManager('item03');
    this.anyItemIsAutharizated = this.item01IsAutharizated || this.item02IsAutharizated || this.item03IsAutharizated
  }

  ngOnInit() {
  }

  moveReport(filterName) {
    if (filterName != 'item-filter-page')
      this.router.navigate(['./impostorcompany/reports/filter/' + filterName])
    else
      this.router.navigate(['./impostorcompany/reports/' + filterName])
  }
}
