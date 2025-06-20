/*import { Component, OnInit, OnDestroy } from '@angular/core';
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
*/






/*
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebSocketService } from 'src/app/services/web-socket-servicee.service';

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
  listorders: Commande[] = [];
  archivedOrders: Commande[] = [];
  showArchived = false;
  notificationMessage = '';
  showNotification = false;
  token: string = '';
  currentUser: { iduser: number; username: string } | null = null;
  private subscription: Subscription | null = null;
  private apiUrl = '/api/orders';

  constructor(
    private authService: AuthService,
    private service: AllmyservicesService,
    private http: HttpClient,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.token = localStorage.getItem('token') || '';

    if (this.currentUser) {
      this.fetchCommandesByLivreur(this.currentUser.iduser.toString());
      this.webSocketService.connect(this.currentUser.iduser.toString(), this.token);
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
    } else if (storedUsername && storedIduser) {
      this.currentUser = {
        iduser: parseInt(storedIduser, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
    } else {
      this.router.navigate(['/']);
    }
  }

  private fetchCommandesByLivreur(idlivreur: string): void {
    this.service.AllcmdByIdLivreur(idlivreur).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.listorders = [...this.commandes];
        console.log(`✅ Commandes récupérées pour le livreur ${idlivreur}:`, commandes);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des commandes:', err);
      }
    });
  }

  updateOrderStatus(orderId: string, statut: string): void {
    const formData = new FormData();
    formData.append('statut_commande', statut);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.put(`${this.apiUrl}/update/${orderId}`, formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('✅ Statut de commande mis à jour:', response);
        },
        error: (error) => {
          console.error('❌ Erreur de mise à jour de statut:', error);
        }
      });
  }

  archiveOrder(order: Commande): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous archiver la commande ${order.id_commande} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivedOrders.push({ ...order });
        this.listorders = this.listorders.filter(o => o.id_commande !== order.id_commande);
        this.showNotification = true;
        this.notificationMessage = 'Commande archivée avec succès!';
      }
    });
  }

  unarchiveOrder(order: Commande): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous restaurer la commande ${order.id_commande} ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, restaurer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listorders.push({ ...order });
        this.archivedOrders = this.archivedOrders.filter(o => o.id_commande !== order.id_commande);
        this.showNotification = true;
        this.notificationMessage = 'Commande restaurée avec succès!';
      }
    });
  }

 

}
 */




import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
// import { Stomp } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface User {
  id: string;
  username: string;
  disponible: boolean;
}

export interface Commande {
  id_commande: string;
  dateCommande: string;
  statut_commande: string;
  adresse_livraison: string;
  total: number;
  remise: number;
  iduser?: number;
  userDTO?: any;
  livreurId?: number;
  gouvernoratCmd?: string;
  articel_commande?: string;
  fraisLivraison?: number;
  date_livraison_estimee?: string;
  commentaires?: string;
  ispaied?: boolean;
  latitude?: number;
  longitude?: number;
  idproduit?: number;
  productDTO?: any;
  longueur_cm?: number;
  largeur_cm?: number;
  hauteur_cm?: number;
  poids_grammes?: number;
  enseigne?: string;
  destination_enseigne?: string;
  archived?: boolean;
  noteClient?: number;
  commentaireClient?: string;
  date_livree?: string;
  date_ajoutsystem?: string;
  date_affection?: string;
  date_expidetion?: string;
  idpartenaire?: number;
}

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
  listorders: Commande[] = [];
  archivedOrders: Commande[] = [];
  showArchived = false;
  notificationMessage = '';
  showNotification = false;
  token: string = '';
  currentUser: { iduser: number; username: string } | null = null;
  isDisponible: boolean = false;
  isLoading: boolean = true;
  isUpdating: boolean = false;
  private subscription: Subscription | null = null;
  user: User | null = null;
  errorMessage: string | null = null;
     private stompClient:any
  private connected: boolean = false;

  constructor(
    private authService: AuthService,
    private service: AllmyservicesService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {

     this.connect(); // Passer l'ID utilisateur ici

    this.initUser();
    this.token = localStorage.getItem('token') || '';
    if (this.currentUser) {
      this.loadUser(this.currentUser.iduser.toString());
      this.fetchCommandesByLivreur(this.currentUser.iduser.toString());
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun utilisateur connecté. Veuillez vous reconnecter.',
      }).then(() => {
        this.router.navigate(['/']);
      });
    }
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');
    if (this.authService.currentUser) {
      this.currentUser = {
        iduser: this.authService.currentUser.iduser,
        username: this.authService.currentUser.username
      };
    } else if (storedUsername && storedIduser) {
      this.currentUser = {
        iduser: parseInt(storedIduser, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
    } else {
      this.router.navigate(['/']);
    }
  }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.http.get<User>(`${environment.baseUrlUser}/User/getuser/${id}`).subscribe({
      next: (response) => {
        this.user = response;
        this.isDisponible = response.disponible;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les données de l’utilisateur.',
        });
      }
    });
  }

  toggleDisponibilite(): void {
    if (!this.user || !this.currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun utilisateur chargé. Veuillez réessayer.',
      });
      return;
    }

    this.isUpdating = true;
    const newDisponibilite = !this.user.disponible;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.put(`${environment.baseUrlUser}/User/${this.user.id}/disponibilite?disponible=${newDisponibilite}`, null, { headers }).subscribe({
      next: () => {
        this.user!.disponible = newDisponibilite;
        this.isDisponible = newDisponibilite;
        this.isUpdating = false;
        this.showNotification = true;
        this.notificationMessage = `Vous êtes maintenant ${newDisponibilite ? 'disponible' : 'non disponible'}.`;
      },
      error: () => {
        this.isUpdating = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la mise à jour de la disponibilité.',
        });
      }
    });
  }

  private fetchCommandesByLivreur(idlivreur: string): void {
    this.service.AllcmdByIdLivreur(idlivreur).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.listorders = this.commandes.filter(o => !o.archived);
        this.archivedOrders = this.commandes.filter(o => o.archived);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les commandes.',
        });
      }
    });
  }

updateOrderStatus(orderId: string, statut: string): void {
    console.log(`Mise à jour du statut de la commande ${orderId} à : ${statut}`);

    // Vérifier si la commande existe localement
    const order = this.listorders.find(o => o.id_commande === orderId);
    if (!order) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Commande introuvable.',
        });
        return;
    }

    // Valider l'ID de la commande
    const numericOrderId = parseInt(orderId, 10);
    if (isNaN(numericOrderId)) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'ID de commande invalide.',
        });
        return;
    }

    // Normaliser le statut pour correspondre au backend
    const normalizedStatut = statut.trim().toUpperCase();
    console.log(`Statut normalisé envoyé : ${normalizedStatut}`);

    // Configurer les headers
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Préparer les paramètres
    const params = new URLSearchParams();
    params.set('statut_commande', normalizedStatut);

    // Construire l'URL
    const url = `http://localhost:8764/Commande/updatecmd/${numericOrderId}?${params.toString()}`;
    console.log(`Envoi de la requête PUT vers : ${url}`);

    this.http.put(url, null, { headers }).subscribe({
        next: (response: any) => {
            console.log(`Réponse de updatecmd:`, response);
            this.showNotification = true;
            this.notificationMessage = `Commande #${orderId} mise à jour à ${normalizedStatut}. Notifications envoyées au client et au partenaire.`;

            Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: `Commande #${orderId} mise à jour à ${normalizedStatut}.`,
            });

            // Envoyer la notification WebSocket pour tous les statuts
            if (this.stompClient && this.stompClient.connected) {
                this.stompClient.send('/app/sendMessage', {}, normalizedStatut);
                this.showNotificationMessage(normalizedStatut);
            }

            // Archiver automatiquement uniquement pour DELIVERED ou CANCELLED
            if (normalizedStatut === 'DELIVERED' || normalizedStatut === 'CANCELLED') {
                this.archiveOrderWithoutConfirmation(order);
            } else {
                // Mettre à jour la liste locale sans archiver
                order.statut_commande = normalizedStatut;
                this.fetchCommandesByLivreur(this.currentUser!.iduser.toString());
            }
        },
        error: (err) => {
            console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, err);
            this.showNotification = true;
            this.notificationMessage = `Erreur lors de la mise à jour de la commande #${orderId}: ${err.error?.message || err.statusText || 'Erreur inconnue'}`;
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: `Impossible de mettre à jour le statut: ${err.error?.message || err.statusText || 'Erreur inconnue'}`,
            });
        }
    });
}

  private archiveOrderWithoutConfirmation(order: Commande): void {
    this.service.archiveCommande(order.id_commande.toString()).subscribe({
      next: () => {
        this.listorders = this.listorders.filter(o => o.id_commande !== order.id_commande);
        this.archivedOrders.push({ ...order, archived: true });
        this.showNotification = true;
        this.notificationMessage = `Commande #${order.id_commande} archivée automatiquement après ${order.statut_commande}.`;
        this.fetchCommandesByLivreur(this.currentUser!.iduser.toString()); // Refresh UI
      },
      error: (err) => {
        console.error(`Error archiving order ${order.id_commande}:`, err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Échec de l'archivage automatique de la commande: ${err.statusText || err.message}`,
        });
      }
    });
  }
  

  archiveOrder(order: Commande): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous archiver la commande ${order.id_commande} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, archiver !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.archiveCommande(order.id_commande.toString()).subscribe({
          next: () => {
            this.listorders = this.listorders.filter(o => o.id_commande !== order.id_commande);
            this.archivedOrders.push({ ...order, archived: true });
            this.showNotification = true;
            this.notificationMessage = 'Commande archivée avec succès !';
            Swal.fire('Archivée !', 'Votre commande a été archivée.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de l\'archivage de la commande.', 'error');
          }
        });
      }
    });
  }

  unarchiveOrder(order: Commande): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous restaurer la commande ${order.id_commande} ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, restaurer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.unarchiveCommande(order.id_commande.toString()).subscribe({
          next: () => {
            this.archivedOrders = this.archivedOrders.filter(o => o.id_commande !== order.id_commande);
            this.listorders.push({ ...order, archived: false });
            this.showNotification = true;
            this.notificationMessage = 'Commande restaurée avec succès !';
            Swal.fire('Restaurée !', 'Votre commande a été restaurée depuis l\'archive.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec du désarchivage de la commande.', 'error');
          }
        });
      }
    });
  }

  updateOrderStatusPaid(orderId: string): void {
    const order = this.listorders.find(o => o.id_commande === orderId);
    if (!order) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Commande introuvable.',
      });
      return;
    }
    const newPaymentStatus = !order.ispaied;
    const url = `http://localhost:8764/Commande/updateCMD/${orderId}`;
    const formData = new FormData();
    formData.append('ispaied', newPaymentStatus.toString());

    this.http.put(url, formData).subscribe({
      next: () => {
        order.ispaied = newPaymentStatus;
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: `La commande ${orderId} a été marquée comme ${newPaymentStatus ? 'payée' : 'non payée'}.`,
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de mettre à jour le statut de paiement.',
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }



   connect(): void {
    const socket = new SockJS('http://localhost:8764/ws');
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


    showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 5000); 
  }




}