import { Component, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-livreur',
  templateUrl: './livreur.component.html',
  styleUrls: ['./livreur.component.css']
})
export class LivreurComponent implements OnInit {
  private stompClient: any;
  notificationMessage: string = ''; // Stocke le message
  showNotification: boolean = false;

  ngOnInit(): void {
    this.connect();
  }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected:', frame);
      this.stompClient.subscribe('/topic/notifications', (message: any) => {
        this.showNotificationMessage(message.body);
      });
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  // Méthode pour envoyer un message personnalisé
  sendMessage(): void {
    if (this.notificationMessage.trim()) {
      // Envoi du message au serveur via WebSocket
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.send('/app/sendMessage', {}, this.notificationMessage);
        this.showNotificationMessage(this.notificationMessage); // Afficher la notification immédiatement
        this.notificationMessage = ''; // Réinitialiser la zone de texte
      } else {
        console.error('WebSocket connection is not established.');
      }
    }
  }

  // Méthode pour gérer l'affichage de la notification
  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 5000); // Cache la notification après 5 secondes
  }

  // Méthode pour mettre à jour le statut de la commande
  updateOrderStatus(status: string): void {
    this.notificationMessage = `Order status updated to: ${status}`;
    this.showNotification = true;

    // Envoi du message de statut via WebSocket
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/sendMessage', {}, this.notificationMessage);
    } else {
      console.error('WebSocket connection is not established.');
    }
  }
}
