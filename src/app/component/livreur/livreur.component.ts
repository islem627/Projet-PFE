import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2';
import { WebSocketServiceeService, OrderUpdate } from 'src/app/services/web-socket-servicee.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-livreur',
  templateUrl: './livreur.component.html',
  styleUrls: ['./livreur.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LivreurComponent implements OnInit, OnDestroy {
  commandes: Commande[] = [];
  errorMessage: string | null = null;
  currentUser: { iduser: number; username: string } | null = null;
  selectedOrder: Commande | null = null;
  listorders: Commande[] = [];
  archivedOrders: Commande[] = [];
  showArchived: boolean = false;
  notificationMessage: string = '';
  showNotification: boolean = false;
  clients: Commande[] ;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private service: AllmyservicesService,
    private http: HttpClient,
    private webSocketService: WebSocketServiceeService
  ) {}

  ngOnInit(): void {
    this.initUser();
    if (this.currentUser) {
      this.fetchCommandesByLivreur(this.currentUser.iduser.toString());
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.webSocketService.disconnect();
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
      console.log('Utilisateur connecté (AuthService) :', this.currentUser);
    } else if (storedUsername && storedIduser) {
      this.currentUser = {
        iduser: parseInt(storedIduser, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
      console.log('Utilisateur chargé depuis localStorage :', this.currentUser);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('Aucun identifiant utilisateur trouvé.');
    }
  }

  private fetchCommandesByLivreur(idlivreur: string): void {
    this.service.AllcmdByIdLivreur(idlivreur).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.listorders = [...this.commandes]; // pour gestion archive
        this.errorMessage = null;
        console.log(`Commandes récupérées pour le livreur ${idlivreur} :`, commandes);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commandes livreur :', err);
        this.errorMessage = 'Erreur lors du chargement des commandes du livreur.';
      }
    });
  }
 

  updateOrderStatus(order: Commande, status: string): void {
    console.log('Mise à jour du statut pour la commande:', order.id_commande, 'Statut:', status);

    const updatedCommande = { ...order, statut_commande: status };
    this.service.updateorder(order.id_commande, updatedCommande).subscribe({
      next: () => {
        const orderUpdate: OrderUpdate = {
          orderId: Number(order.id_commande),
          status,
          commandeDTO: updatedCommande
        };
        this.webSocketService.sendOrderUpdate(orderUpdate);
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
        Swal.fire('Archivée !', 'Votre commande a été archivée.', 'success');
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
        Swal.fire('Restaurée !', 'Votre commande a été restaurée depuis l\'archive.', 'success');
      }
    });
  }
}
