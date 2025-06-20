import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllmyservicesService, Commande, UserDTO } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
// import { ChatService } from 'src/app/services/chat.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-livreur',
  templateUrl: './sidebar-livreur.component.html',
  styleUrls: ['./sidebar-livreur.component.css']
})
export class SidebarLivreurComponent implements OnInit, OnDestroy {
  messages: Notification[] = [];
  notificationCount = 0;
  showNotifications = false;
  loading: boolean = false;
  commandes: Commande[] = [];
  errorMessage: string | null = null;
  currentUser: { iduser: number; username: string } | null = null;
  selectedOrder: Commande | null = null;
  listorders: Commande[] = [];
  archivedOrders: Commande[] = [];
  showArchived: boolean = false;
  notificationMessage: string = '';
  showNotification: boolean = false;
  private subscription: Subscription | null = null;
  clients: UserDTO[] = [];
  unreadCount: number = 0;
  private unreadCountSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private http: HttpClient,
    private service: AllmyservicesService,
    // private chatService: ChatService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit démarré');
    this.initUser();
    if (this.currentUser) {
      console.log('Utilisateur connecté:', this.currentUser);
      this.fetchCommandesByLivreur(this.currentUser.iduser.toString());
    } else {
      console.error('Aucun utilisateur connecté');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun utilisateur connecté. Veuillez vous reconnecter.',
      });
      this.router.navigate(['/']);
    }
    // this.unreadCountSubscription = this.chatService.getUnreadCountSubject().subscribe({
    //   next: (count: number) => {
    //     this.unreadCount = count;
    //     console.log('Unread count updated:', this.unreadCount);
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors de la réception du unread count:', error);
    //   }
    // });
  }

  ngOnDestroy(): void {
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
      console.log('Utilisateur chargé depuis AuthService:', this.currentUser);
    } else if (storedUsername && storedIduser) {
      this.currentUser = {
        iduser: parseInt(storedIduser, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
      console.log('Utilisateur chargé depuis localStorage:', this.currentUser);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('Aucun identifiant utilisateur trouvé.');
    }
  }

  private fetchCommandesByLivreur(idlivreur: string): void {
    this.loading = true;
    console.log('Récupération des commandes pour le livreur ID:', idlivreur);
    this.service.AllcmdByIdLivreur(idlivreur).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.listorders = [...this.commandes];
        this.errorMessage = null;
        this.loading = false;
        console.log('Commandes récupérées:', this.commandes);
        this.getClientsFromCommandes();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commandes:', err);
        this.errorMessage = 'Erreur lors du chargement des commandes.';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les commandes. Veuillez réessayer.',
        });
      }
    });
  }

  getClientsFromCommandes(): void {
    this.loading = true;
    console.log('getClientsFromCommandes démarré, commandes:', this.commandes);
    try {
      if (!this.commandes || this.commandes.length === 0) {
        console.warn('Aucune commande disponible.');
        this.clients = [];
        this.loading = false;
        Swal.fire({
          icon: 'info',
          title: 'Aucune commande',
          text: 'Aucune commande trouvée pour ce livreur.',
        });
        return;
      }

      const clientsFromCommandes = this.commandes
        .map(c => {
          if (!c.userDTO) {
            console.warn('userDTO manquant pour la commande:', c);
          }
          return c.userDTO;
        })
        .filter((user): user is UserDTO => user !== undefined && user !== null);

      console.log('Clients extraits:', clientsFromCommandes);

      if (clientsFromCommandes.length === 0) {
        console.warn('Aucun client valide trouvé.');
        this.clients = [];
        this.loading = false;
        Swal.fire({
          icon: 'info',
          title: 'Aucun client',
          text: 'Aucun client associé aux commandes.',
        });
        return;
      }

      const uniqueClientsMap = new Map<number, UserDTO>();
      clientsFromCommandes.forEach(client => {
        if (!uniqueClientsMap.has(client.id)) {
          uniqueClientsMap.set(client.id, client);
        }
      });

      this.clients = Array.from(uniqueClientsMap.values());
      this.loading = false;
      console.log('Clients uniques:', this.clients);
    } catch (error) {
      console.error('Erreur dans getClientsFromCommandes:', error);
      this.errorMessage = 'Erreur lors de la récupération des clients.';
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger la liste des clients.',
      });
    }
  }

  openChat(clientId: string): void {
    if (!clientId) {
      console.error('ID client non défini');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'ID client non défini.',
      });
      return;
    }
    console.log('Navigation vers chat avec client ID:', clientId);
    this.router.navigate(['/chat', clientId]);
  }


}