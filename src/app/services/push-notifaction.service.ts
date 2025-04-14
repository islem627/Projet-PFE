import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  currentMessage = new BehaviorSubject<any>(null);

  constructor(private afMessaging: AngularFireMessaging) {}

  requestPermission() {
    this.afMessaging.requestToken.subscribe(
      (token: string | null) => {
        if (token) {
          console.log('Notification permission granted. Token:', token);
          localStorage.setItem('notificationToken', token);
        } else {
          console.warn('No token received. User may have denied permission.');
        }
      },
      (error: any) => {
        console.error('Error getting permission for notifications', error);
      }
    );
  }

  receiveMessages() {
    this.afMessaging.messages.subscribe((message: any) => {
      console.log('Message received:', message);
      this.currentMessage.next(message);
    });
  }
}
