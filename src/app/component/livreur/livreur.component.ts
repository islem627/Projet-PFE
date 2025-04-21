/*import { Component, OnInit } from '@angular/core';
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
*/
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketServiceeService } from '../../services/web-socket-servicee.service';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

interface Commande {
  id_commande: string;
  dateCommande: string;
  statut_commande: string;
  adresse_livraison: string;
  total: number;
  remise: number;
  iduser?: number;
}

interface OrderUpdate {
  orderId: string;
  status: string;
  commandeDTO: Commande;
}

@Component({
  selector: 'app-livreur',
  templateUrl: './livreur.component.html',
  styleUrls: ['./livreur.component.css']
})
export class LivreurComponent implements OnInit, OnDestroy {
  listorders: Commande[] = [];
  archivedOrders: Commande[] = [];
  showArchived: boolean = false;
  notificationMessage: string = '';
  showNotification: boolean = false;
  private subscription: Subscription | null = null;

  constructor(
    private service: AllmyservicesService,
    private http: HttpClient,
    private webSocketService: WebSocketServiceeService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('iduser') || 'livreur';
    const token = localStorage.getItem('token') || '';
    this.webSocketService.connect(userId, token);

    this.subscription = this.webSocketService.notifications$.subscribe(notifications => {
      if (notifications.length > 0) {
        const latestNotification = notifications[notifications.length - 1];
        this.showNotification = true;
        this.notificationMessage = latestNotification.message;
        console.log('Notification reçue dans LivreurComponent:', this.notificationMessage);
        setTimeout(() => {
          this.showNotification = false;
          this.notificationMessage = '';
        }, 3000);
      }
    });

    this.Mybackfunction();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  Mybackfunction(): void {
    this.service.AllOrderss().subscribe(
      (result: Commande[]) => {
        console.log('Succès chargement des commandes:', result);
        this.listorders = result;
      },
      (error) => {
        console.error('Erreur lors du chargement des commandes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les commandes. Veuillez réessayer.',
        });
      }
    );
  }

  updateOrderStatus(order: Commande, status: string): void {
    console.log('Mise à jour du statut pour la commande:', order.id_commande, 'Statut:', status);

    // Mettre à jour via l'API
    const updatedCommande = { ...order, statut_commande: status };
    this.service.updateorder(order.id_commande, updatedCommande).subscribe({
      next: () => {
        console.log('Statut mis à jour dans la base de données');

        // Envoyer la notification WebSocket
        const orderUpdate: OrderUpdate = {
          orderId: order.id_commande,
          status: status,
          commandeDTO: updatedCommande
        };
        this.webSocketService.sendOrderUpdate(orderUpdate);
        console.log('Envoi de orderUpdate:', orderUpdate);

        // Mettre à jour l'interface
        order.statut_commande = status;

        this.notificationMessage = `Commande ${order.id_commande} mise à jour : ${status}`;
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
          this.notificationMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        Swal.fire('Erreur', 'Impossible de mettre à jour le statut', 'error');
      }
    });
  }

  archiveOrder(order: Commande): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous archiver la commande ${order.id_commande} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivedOrders.push({ ...order });
        this.listorders = this.listorders.filter(o => o.id_commande !== order.id_commande);
        this.showNotification = true;
        this.notificationMessage = 'Commande archivée avec succès !';
        Swal.fire(
          'Archivée !',
          'Votre commande a été archivée.',
          'success'
        );
      }
    });
  }

  unarchiveOrder(order: Commande): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous restaurer la commande ${order.id_commande} ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, restaurer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listorders.push({ ...order });
        this.archivedOrders = this.archivedOrders.filter(o => o.id_commande !== order.id_commande);
        this.showNotification = true;
        this.notificationMessage = 'Commande restaurée avec succès !';
        Swal.fire(
          'Restaurée !',
          'Votre commande a été restaurée depuis l\'archive.',
          'success'
        );
      }
    });
  }
}