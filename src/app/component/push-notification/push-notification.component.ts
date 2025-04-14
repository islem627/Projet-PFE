import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notifaction.service';
@Component({
  selector: 'app-push-notification',
  template: `
    <button (click)="requestPermission()">Activer les notifications</button>
    <p *ngIf="message">{{ message.notification?.title }} - {{ message.notification?.body }}</p>
  `,
})
export class PushNotificationComponent implements OnInit {
  message: any = null;

  constructor(private pushService: PushNotificationService) {}

  ngOnInit() {
    this.pushService.receiveMessages();
    this.pushService.currentMessage.subscribe((msg) => {
      this.message = msg;
    });
  }

  requestPermission() {
    this.pushService.requestPermission();
  }
}