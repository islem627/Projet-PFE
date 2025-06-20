import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';

export interface Notification {
  message: string;
  commandeId: number;
  statutCommande: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });
  }

  connect(userId: string): void {
    if (!userId) {
      console.error('❌ User ID is required to connect to WebSocket');
      return;
    }
    this.stompClient.onConnect = (frame) => {
      console.log('✅ Connected to WebSocket:', frame);
      this.stompClient.subscribe(`/user/${userId}/topic/notifications`, (message) => {
        if (message.body) {
          const notification: Notification = JSON.parse(message.body);
          console.log('📩 Notification received:', notification);
          const currentNotifications = this.notificationsSubject.getValue();
          this.notificationsSubject.next([...currentNotifications, notification]);
        }
      });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('❌ WebSocket STOMP error:', frame);
    };
    this.stompClient.onWebSocketError = (error) => {
      console.error('❌ WebSocket error:', error);
    };
    this.stompClient.onWebSocketClose = () => {
      console.warn('🔌 WebSocket connection closed. Attempting to reconnect...');
    };
    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('🔌 WebSocket disconnected');
    }
  }
}