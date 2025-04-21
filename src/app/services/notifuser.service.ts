import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotifuserService {
  private stompClient!: Client;
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
            this.addNotification(message.body);
          });
        }
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP :', frame);
      }
    });
    this.stompClient.activate();
  }

  private addNotification(message: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([message, ...currentNotifications]);
  }
}
