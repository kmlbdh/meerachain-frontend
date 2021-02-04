import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/Shared/Notifications/notifications.service';

@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.scss']
})
export class AllNotificationComponent implements OnInit {

  loadCard = false;
  pageChanged($e) {
    this.paggingManager.currentPage = $e;
    this.search();
  }
  public paggingManager = {
    id: 'notespaging',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  }
  noteToHistoryId;
  noteHistoryContent;

  lstNotification = [];
  lstNoteChanges = {};
  search() {
    this.loadCard = true;
    this.notificationsService.loadUserNotification(this.paggingManager.currentPage - 1, this.paggingManager.itemsPerPage).subscribe((z: any) => {
      this.lstNotification = z.data;
      this.paggingManager.itemsPerPage = 10
      this.paggingManager.totalItems = z.totalElements;
      this.loadCard = false;
    })
  }
  goTo(orderId) {
    
    this.router.navigate(["./impostorcompany/ordernotes"], {
      queryParams: { i: orderId }
    })
  }
  actionType = {};
  constructor(private notificationsService: NotificationsService, private router: Router) {

  }
  ngOnInit() {
    this.search()
  }

}
