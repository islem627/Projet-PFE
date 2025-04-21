import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  addNotification(notification: Notification) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current]);
    console.log('Notification ajoutée:', notification);
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
    console.log('Notifications effacées');
  }
}