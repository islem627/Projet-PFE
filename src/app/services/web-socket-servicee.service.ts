/*import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
export interface OrderUpdate {
  orderId: number;
  status: string;
  commandeDTO: any; // tu peux remplacer `any` par le type exact si tu en as un
}

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
  */



/* mariem 
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderUpdate {
  orderId: string;
  status: string;
  articelCommande?: string;
  adresseLivraison?: string;
  dateCommande?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceeService {
  private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<OrderUpdate[]>([]);
  notifications$: Observable<OrderUpdate[]> = this.notificationsSubject.asObservable();

  connect(userId: string, token: string): void {
    if (!userId || !token) {
      console.error('userId ou token manquant');
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      debug: (msg: string) => console.log('STOMP DEBUG:', msg),
      onConnect: () => {
        console.log('Connecté à WebSocket pour userId:', userId);
        console.log('Abonnement au topic: /topic/notifications/' + userId);
        this.stompClient!.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
          console.log('Message brut reçu:', message.body);
          const notification: OrderUpdate = JSON.parse(message.body);
          console.log('Notification parsée:', notification);
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([...currentNotifications, notification]);
        });
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP:', frame.headers['message'], frame.body);
      },
      onWebSocketClose: () => {
        console.warn('Connexion WebSocket fermée');
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('WebSocket déconnecté');
    }
  }
}*/


import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderUpdate {
  orderId: string;
  status: string;
  articelCommande?: string;
  adresseLivraison?: string;
  dateCommande?: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<OrderUpdate[]>([]);
  notifications$: Observable<OrderUpdate[]> = this.notificationsSubject.asObservable();

  connect(userId: string, token: string): void {
    console.log('Tentative de connexion WebSocket avec userId:', userId, 'et token:', token);
    if (!userId || !token) {
      console.error('❌ userId ou token manquant');
      return;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg: string) => console.log('STOMP DEBUG:', msg),
      onConnect: () => {
        console.log(`✅ Connecté WebSocket pour userId: ${userId}`);
        this.subscribeToNotifications(userId);
      },
      onStompError: (frame) => {
        console.error('❌ Erreur STOMP:', frame.headers['message'], frame.body);
      },
      onWebSocketClose: () => {
        console.warn('⚠️ Connexion WebSocket fermée, tentative de reconnexion...');
      },
      onWebSocketError: (error) => {
        console.error('❌ Erreur WebSocket:', error);
      }
    });

    this.stompClient.activate();
  }

  private subscribeToNotifications(userId: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
        try {
          console.log('📨 Message brut reçu:', message.body);
          const notification: OrderUpdate = JSON.parse(message.body);
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([...currentNotifications, notification]);
        } catch (error) {
          console.error('❌ Erreur lors du parsing du message:', error);
        }
      });
    } else {
      console.warn('⚠️ Impossible de s’abonner, stompClient non connecté');
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('🔌 WebSocket déconnecté');
    }
  }
}