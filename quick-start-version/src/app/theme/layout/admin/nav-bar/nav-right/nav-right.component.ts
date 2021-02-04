import { Component, DoCheck, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { DattaConfig } from '../../../../../app-config';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/Shared/Notifications/notifications.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class NavRightComponent implements OnInit, DoCheck {
  public visibleUserList: boolean;
  public chatMessage: boolean;
  public friendId: boolean;
  public dattaConfig: any;
  goTo(orderId) {
    console.log('orderId',orderId);
    
    this._router.navigate(["./impostorcompany/ordernotes"], {
      queryParams: { i: orderId }
    })
  }
  viewAll() {
    this._router.navigate(["./impostorcompany/notifications"])
  }
  constructor(config: NgbDropdownConfig, private _router: Router, private notificationsService: NotificationsService) {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
    this.dattaConfig = DattaConfig.config;
  }
  lstNotifications = [];
  myUserPicture
  ngOnInit() {
    this.myUserPicture = localStorage.getItem("userpicture");
    this.notificationsService.gettopusernotification().subscribe((z: any) => {
      console.log('notification', z);
      this.lstNotifications = z;
      this.notificationListiner();
    })
  }
  clearallnotification(){
    this.notificationsService.clearallnotification().subscribe(z =>{
      console.log("Cleared");
      
      this.lstNotifications = undefined;
    })
  }
  makeAsRead(cleaner) {
    let anyOneIsNotRead = this.lstNotifications.filter(z => z.isRead == false);
    if (anyOneIsNotRead.length > 0)
      this.notificationsService.makeNotificationAsRead(this.lstNotifications.map(z => z.baseNotificationId)).subscribe(z => {
        console.log('Done As Raed');
        if (cleaner)
          this.lstNotifications.forEach(z => z.isRead = true)
      })
  }
  notificationListiner() {
    var last = this.lstNotifications[0]
    setInterval(() => {
      console.log("notificationListiner");
      this.notificationsService.gettopusernotification(last ? last['createdAt'] : '').subscribe((z: any) => {
        this.lstNotifications.forEach(el => {
          z.push(el);
        });
        this.lstNotifications = z;
        console.log("newNotification", z);
        last = this.lstNotifications[0]
      })
    }, 60000 * 2); //60000 * 2 == 2 Minute
  }

  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }
  logout() {
    localStorage.clear();
    this._router.navigate(['/auth/signin']);
  }
  ngDoCheck() {
    if (document.querySelector('body').classList.contains('datta-rtl')) {
      this.dattaConfig['rtl-layout'] = true;
    } else {
      this.dattaConfig['rtl-layout'] = false;
    }
  }
}
