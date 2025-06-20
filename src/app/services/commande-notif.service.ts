import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface Notification {
  message: string;
  commandeId: number;
  statutCommande: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommandeNotifService {
  private stompClient: any;
  private notificationSubject = new Subject<{ content: string, timestamp: string }>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor() {}

  connect(userId: string, token: string): void {
    const socket = new SockJS('http://localhost:8764/ws');
    this.stompClient = Stomp.over(socket);

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.stompClient.connect(headers, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: any) => {
        const notification = JSON.parse(message.body);
        this.notificationSubject.next(notification);
      });
    }, (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      console.log('Disconnected from WebSocket');
    }
  }
}