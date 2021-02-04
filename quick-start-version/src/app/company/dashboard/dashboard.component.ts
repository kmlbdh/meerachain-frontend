import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/Shared/Dashboard/dashboard.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/Shared/Notifications/notifications.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService,private router: Router,private notificationsService:NotificationsService) { }
  lstOrder = [];
  lstAssigned = [];
  loadCard01
  loadCard02
  pageChanged($e) {
    this.paggingManager.currentPage = $e;
    this.search();
  }
  pageChanged02($e) {
    this.paggingManager02.currentPage = $e;
    this.search02();
  }

  ngOnInit() {
    this.search()
    this.search02();


  }
  search() {
    this.loadCard01 = true;
    this.dashboardService.orderShortReport(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage).subscribe(z => {
      this.lstOrder = z.data;
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard01 = false;

    })
  }
  openorder(orderId) {
    this.router.navigate(["./impostorcompany/orders/cu"], {
      queryParams: { 't':'e','i':orderId }
    })
  }
  MakeNoteAsDone(id) {
    this.notificationsService.MakeNoteAsDone(id).subscribe(z => {
      this.search02();
    })
  }
  search02() {
    this.loadCard02 = true;
    this.dashboardService.loadUserAssigned(this.paggingManager02.currentPage - 1, this.paggingManager02.itemsPerPage).subscribe((z: any) => {
      this.lstAssigned = z.data;
      this.paggingManager02.totalItems = z.totalElements;
      this.loadCard02 = false;
      this.lstAssigned.forEach(z => {
        let changeOnArr = [];
        z.changeOn = changeOnArr.join(', ');

        if (z.attachments) {
          z.attachments = z.attachments.split(",").map(attach => {
            return {
              name: attach.split("__")[2],
              url: "./attachment/" + attach
            }
          });
        }

      })
    })
  }
  public paggingManager = {
    id: 'ordersPaging',
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 100
  }
  public paggingManager02 = {
    id: 'ordersPaging01',
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 100
  }

}
