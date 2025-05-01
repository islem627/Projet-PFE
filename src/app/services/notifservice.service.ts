
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotifserviceService {
  private stompClient: Client | null = null;
  private messageSubject = new Subject<string>();

  constructor() {}

  connect(username: string): void {
    if (this.stompClient && this.stompClient.connected) {
      return; // Déjà connecté
    }

    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    this.stompClient.onConnect = (frame) => {
      console.log('✅ WebSocket connecté:', frame);
      this.stompClient!.subscribe(`/user/${username}/queue/notify`, (message: IMessage) => {
        console.log('📩 Notification reçue:', message.body);
        this.messageSubject.next(message.body);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur STOMP:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('🔌 WebSocket déconnecté');
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  sendOrderUpdate(destination: string, message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({ destination, body: message });
    } else {
      console.error("STOMP client is not connected, cannot send message.");
    }
  }
  
}