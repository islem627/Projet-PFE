import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WbsService {
  private stompClient: any;
  private notificationSubject = new Subject<any>();
  public notifications$ = this.notificationSubject.asObservable();

  connect(userId: string): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    // Remplace par un token JWT valide généré pour khawla
    const token = '<ton-token-jwt>';
    this.stompClient.connect(
      { Authorization: `Bearer ${token}` },
      (frame: any) => {
        console.log(`WebSocket connecté avec succès pour l'utilisateur : ${userId}`);
        this.stompClient.subscribe(`/user/${userId}/queue/order`, (message: any) => {
          console.log('Message brut reçu :', message.body);
          const notification = JSON.parse(message.body);
          console.log(`Notification reçue pour l'utilisateur : ${userId}`, notification);
          this.notificationSubject.next(notification);
        });
        console.log(`Abonnement à : /user/${userId}/queue/order`);
      },
      (error: any) => {
        console.error('Erreur de connexion WebSocket :', error);
      }
    );
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      console.log('WebSocket déconnecté');
    }
  }
}