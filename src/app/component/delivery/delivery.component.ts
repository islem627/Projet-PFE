// src/app/components/delivery/delivery.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderUpdate } from 'src/app/models/OrderUpdate';
import { Commande, OrderService } from 'src/app/services/order-service.service';
import { Websocket30Service } from 'src/app/services/websocket30.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent implements OnInit, OnDestroy {
  livreurId: number = 1; // Remplace par l'ID du livreur connecté
  commandes: Commande[] = [];
  newStatus: { [key: string]: string } = {};
  error: string | null = null;
  notifications: OrderUpdate[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private orderService: OrderService,
    private websocketService: Websocket30Service
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    const userId = 60; // Pour tester les notifications côté client
    this.websocketService.connect(userId);
    this.subscription.add(
      this.websocketService.notifications$.subscribe((notification) => {
        this.notifications.push(notification);
        console.log('Nouvelle notification :', notification);
      })
    );
  }

  loadOrders(): void {
    this.orderService.getOrdersByLivreurId(this.livreurId).subscribe({
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

  updateStatus(orderId: number): void {
    const status = this.newStatus[orderId];
    if (!status) {
      this.error = 'Veuillez sélectionner un statut';
      return;
    }

    this.orderService.updateOrderStatus(orderId.toString(), status).subscribe({
      next: () => {
        this.error = null;
        this.newStatus[orderId] = '';
        this.loadOrders();
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du statut';
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
    this.subscription.unsubscribe();
  }
}