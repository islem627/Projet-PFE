import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { OrderUpdate } from '../models/OrderUpdate';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class Websocket30Service {
  private stompClient: Client;
  private notificationsSubject = new Subject<OrderUpdate>();
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8090/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });
  }

  connect(userId: number): void {
    this.stompClient.activate();
    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket connecté pour userId:', userId, frame);
      this.stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        console.log('Message brut reçu :', message.body);
        const orderUpdate: OrderUpdate = JSON.parse(message.body);
        console.log('Notification parsée :', orderUpdate);
        this.notificationsSubject.next(orderUpdate);
      });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('Erreur STOMP :', frame);
    };
  }

  disconnect(): void {
    this.stompClient.deactivate();
    console.log('WebSocket déconnecté');
  }
}