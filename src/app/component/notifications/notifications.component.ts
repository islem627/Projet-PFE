import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: string[] = []; // Définir la propriété notifications
  messages: string[] = [];
  private messageSubscription!: Subscription;

  constructor(private websocketService: WebSocketService) {}

  ngOnInit(): void {
    this.connectToWebSocket();
  }

  private connectToWebSocket(): void {
    this.messageSubscription = this.websocketService.getMessages().subscribe({
      next: (message: string) => {
        this.notifications.push(message); // Ajouter le message à la liste des notifications
      },
      error: (err: any) => console.error('Erreur WebSocket:', err)
    });
  }

  sendNotification(): void {
    const message = 'Notification test';
    this.websocketService.sendMessage(message);
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
