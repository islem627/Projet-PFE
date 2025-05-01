// src/app/components/client-notifications/client-notifications.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Commande, OrderService } from 'src/app/services/order-service.service';
import { OrderUpdate } from 'src/app/models/OrderUpdate';
import { Websocket30Service } from 'src/app/services/websocket30.service';

@Component({
  selector: 'app-client-notifications',
  templateUrl: './client-notifications.component.html',
  styleUrls: ['./client-notifications.component.css'],
})
export class ClientNotificationsComponent implements OnInit, OnDestroy {
  userId: number = 60; // Remplace par l'ID du client connecté
  commandes: Commande[] = [];
  notifications: OrderUpdate[] = [];
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private websocketService: Websocket30Service,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.websocketService.connect(this.userId);
    this.subscription.add(
      this.websocketService.notifications$.subscribe((notification) => {
        this.notifications.push(notification);
        console.log('Nouvelle notification :', notification);
      })
    );
  }

  loadOrders(): void {
    this.orderService.getOrdersByUserId(this.userId).subscribe({
      next: (commandes) => {
        this.commandes = commandes;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des commandes';
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
    this.subscription.unsubscribe();
  }
}