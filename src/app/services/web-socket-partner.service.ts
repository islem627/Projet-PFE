// src/app/services/websocket-partner.service.ts
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderUpdate } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketPartnerService {
  private client: Client;
  private notificationsSubject = new BehaviorSubject<OrderUpdate[]>([]);
  notifications$: Observable<OrderUpdate[]> = this.notificationsSubject.asObservable();
  private connected = false;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      debug: (str) => console.log('STOMP Debug:', str),
      onWebSocketError: (error) => console.error('WebSocket Error:', error)
    });
  }

  connect(partnerUsername: string): void {
    if (this.connected) {
      console.log('WebSocket already connected for partner');
      return;
    }

    this.client.onConnect = (frame) => {
      this.connected = true;
      console.log('WebSocket connected for partner:', partnerUsername, 'Frame:', frame);
      this.client.subscribe(`/user/${partnerUsername}/queue/order`, (message) => {
        try {
          const orderUpdate: OrderUpdate = JSON.parse(message.body);
          console.log('Received partner notification:', orderUpdate);
          this.notificationsSubject.next([orderUpdate]);
        } catch (error) {
          console.error('Error parsing partner message:', error, 'Message:', message.body);
        }
      });
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log('WebSocket disconnected for partner');
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      this.connected = false;
    };

    this.client.onWebSocketClose = (event) => {
      console.error('WebSocket closed:', event);
      this.connected = false;
    };

    console.log('Attempting WebSocket connection for partner:', partnerUsername);
    this.client.activate();
  }

  disconnect(): void {
    if (this.connected) {
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket disconnected for partner');
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}