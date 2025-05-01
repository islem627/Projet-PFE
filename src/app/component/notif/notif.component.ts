
import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotifserviceService {
  private stompClient: Client;
  private messageSubject: Subject<string> = new Subject<string>();
  private username: string = '';

  constructor() {
    this.stompClient = new Client({
      brokerURL: undefined, // Car on utilise SockJS à la place
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connecté au WebSocket");
        this.subscribeToUserChannel();
      },
      onStompError: (frame) => {
        console.error('❌ Erreur STOMP :', frame.headers['message']);
        console.error('Détails :', frame.body);
      }
    });
  }

  /**
   * Se connecte et prépare l'abonnement personnalisé.
   * @param username 
   */
  connect(username: string): void {
    this.username = username;
    this.stompClient.activate(); // Démarre la connexion (remplace connect())
  }

  private subscribeToUserChannel(): void {
    const channel = `/user/${this.username}/queue/notify`;
    console.log(`📡 Abonnement à ${channel}`);
    this.stompClient.subscribe(channel, (message: IMessage) => {
      console.log('📩 Message reçu :', message.body);
      this.messageSubject.next(message.body);
    });
  }

  /**
   * Envoie un message via WebSocket
   * @param destination 
   * @param message 
   */
  send(destination: string, message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({ destination, body: message });
      console.log(`📤 Message envoyé à ${destination} : ${message}`);
    } else {
      console.warn("⚠️ WebSocket non connecté !");
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
}
