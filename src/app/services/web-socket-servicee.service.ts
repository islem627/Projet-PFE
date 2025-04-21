import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceeService {
  private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$: Observable<any[]> = this.notificationsSubject.asObservable();
  private subscription: StompSubscription | null = null;

  connect(userId: string, token: string): void {
    console.log('Connexion WebSocket avec token:', token ? 'Présent' : 'Absent');
    console.log('Connexion pour userId:', userId);

    this.stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        debug: (str) => console.log('STOMP Debug:', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connecté à WebSocket:', frame);
      const destination = `/user/${userId}/queue/order`;
      console.log('Abonnement à la destination:', destination);

      this.subscription = this.stompClient!.subscribe(destination, (message) => {
        console.log('📬 Message WebSocket reçu:', message);
        try {
          const orderUpdate = JSON.parse(message.body);
          console.log('OrderUpdate parsé:', orderUpdate);
          const currentNotifications = this.notificationsSubject.getValue();
          const newNotification = {
            message: `Commande ${orderUpdate.orderId} mise à jour : ${orderUpdate.status}`,
            date: new Date().toISOString()
          };
          this.notificationsSubject.next([...currentNotifications, newNotification]);
        } catch (error) {
          console.error('Erreur lors du parsing du message WebSocket:', error);
        }
      }, { id: 'sub-0' });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erreur STOMP:', frame);
    };

    this.stompClient.onWebSocketClose = (event) => {
      console.error('WebSocket fermé:', event);
      setTimeout(() => this.connect(userId, token), 5000);
    };

    this.stompClient.activate();
  }

  sendOrderUpdate(orderUpdate: any): void {
    if (this.stompClient && this.stompClient.connected) {
      const destination = '/app/order/status';
      console.log('Envoi du message WebSocket à:', destination, 'Contenu:', orderUpdate);
      this.stompClient.publish({
        destination,
        body: JSON.stringify(orderUpdate)
      });
    } else {
      console.error('Impossible d\'envoyer le message : WebSocket non connecté');
    }
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    console.log('Déconnexion WebSocket');
  }
}