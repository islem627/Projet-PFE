import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


@Component({
  selector: 'app-real-time-notifications',
  templateUrl: './real-time-notifications.component.html',
  styleUrls: ['./real-time-notifications.component.css']
})
export class RealTimeNotificationsComponent implements OnInit {
  private stompClient!: Client;
  notifications: string[] = [];

  ngOnInit(): void {
    this.connect();
  }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');  // URL de votre WebSocket
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg: string) => console.log(msg),
      onConnect: (frame) => {
        console.log('Connected: ' + frame);  // Connexion réussie
        this.stompClient.subscribe('/topic/notifications', (message) => {
          this.showNotification(message.body);  // Traiter les messages entrants
        });
      },
      onStompError: (error) => {
        console.error('WebSocket connection error: ' + error);  // Erreur de connexion WebSocket
      }
    });

    this.stompClient.activate();
  }

  showNotification(message: string): void {
    this.notifications.push(message);  // Ajouter la notification à la liste
  }
}