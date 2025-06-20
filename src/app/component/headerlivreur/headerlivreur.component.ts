
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stomp } from '@stomp/stompjs';
import { Observable, Subscription } from 'rxjs';
import SockJS from 'sockjs-client';
import { AllmyservicesService, Commande, UserDTO } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

interface Notification {
  message: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-headerlivreur',
  templateUrl: './headerlivreur.component.html',
  styleUrls: ['./headerlivreur.component.css']
})
export class HeaderlivreurComponent implements OnInit, OnDestroy {
  messages: Notification[] = [];
  notificationCount = 0;
  showNotifications = false;
 // clients: any[] = [];
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
  clientId:number;
  clients: UserDTO[] = [];
  unreadCount: number = 0;
  private unreadCountSubscription: Subscription | null = null;
 usernameUserConnected: String = '';
  roleUserConnected: String = '';
isUserConnected: String = '';
 user:any

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private http: HttpClient,
    private service: AllmyservicesService,

  ) {}

  ngOnInit(): void {


   this.usernameUserConnected = localStorage.getItem('username');
    this.roleUserConnected = localStorage.getItem('role');
    this.isUserConnected = localStorage.getItem('iduser');
  //  this.connect(localStorage.getItem('iduser'));
    
    this.initUser();
    if (this.currentUser) {
      this.fetchCommandesByLivreur(this.currentUser.iduser.toString());
    }
    // // Subscribe to unread count updates
    // this.unreadCountSubscription = this.chatService.getUnreadCountSubject().subscribe({
    //   next: (count: number) => {
    //     this.unreadCount = count;
    //     console.log('Unread count updated:', this.unreadCount);
    //   },
    //   error: (error) => {
    //     console.error('Error receiving unread count:', error);
    //   }
    // });
  }
  //

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
        this.listorders = [...this.commandes]; // Pour gestion archive
        this.errorMessage = null;
        console.log(`Commandes récupérées pour le livreur ${idlivreur} :`, commandes);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commandes livreur :', err);
        this.errorMessage = 'Erreur lors du chargement des commandes du livreur.';
      }
    });
  }


getClientsFromCommandes(): void {
  try {
    if (!this.commandes || this.commandes.length === 0) {
      alert('Aucune commande trouvée.');
      return;
    }

    const clientsFromCommandes = this.commandes
      .map(c => c.userDTO)
      .filter((user): user is UserDTO => user !== undefined && user !== null);

    const uniqueClientsMap = new Map<number, UserDTO>();

    clientsFromCommandes.forEach(client => {
      if (!uniqueClientsMap.has(client.id)) {
        uniqueClientsMap.set(client.id, client);
      }
    });

    this.clients = Array.from(uniqueClientsMap.values());

    console.log('Clients extraits :', this.clients);

  } catch (error) {
    console.error('Erreur dans getClientsFromCommandes()', error);
    alert('Une erreur est survenue lors de la récupération des clients.');
  }
}




  

  openChat(clientId: string): void {
    if (!clientId) {
      console.error('ID client non défini');
      return;
    }
    // Naviguer vers la route du chat avec l'ID du client
    this.router.navigate(['/chat', clientId]);
  }

  logout(): void {
    const authHeader = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    Swal.fire({
      title: "Log out?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
    
        this.http.get('http://localhost:8762/User/signout', { headers: authHeader }).subscribe({
          next: (response) => {
            this.router.navigate(['/']);
            Swal.fire({
              title: "Logged out!",
              text: "You have been successfully logged out.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "There was an issue logging you out. Please try again later.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  deleteNotification(index: number) {
    this.messages.splice(index, 1); // Supprimer la notification à l'index donné
    this.notificationCount = this.messages.length; // Réajuster le compteur de notifications
  }

  clearAllNotifications() {
    this.messages = [];
    this.notificationCount = 0;
  }

  // Méthode pour obtenir la classe CSS d'une notification en fonction de son statut
  getNotificationClass(status: string): string {
    if (status === 'new') {
      return 'notification-new';  // Classe CSS pour les notifications "nouvelle"
    } else if (status === 'read') {
      return 'notification-read'; // Classe CSS pour les notifications "lues"
    } else {
      return ''; // Classe par défaut
    }
  }

  markAsRead(index: number): void {
    this.messages[index].status = 'read'; // Marquer la notification comme lue
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationCount = 0;
    }
  }

  profile() : void
{
  this.router.navigate(['/updateprofile']);

}

stompClient:any
connect(userId: string): void {
  // Pass the userId as a query parameter to match the Spring config
  const socket = new SockJS(`http://localhost:8080/ws?userId=${userId}`);
  this.stompClient = Stomp.over(socket);

  // Optional: log STOMP traffic for debugging
  this.stompClient.debug = (msg: string) => console.log('[STOMP]', msg);

  this.stompClient.connect({}, (frame) => {
    console.log('✅ Connected:', frame);

    // Subscribe to a shared topic
    this.stompClient.subscribe('/topic/notifications', (message: any) => {
      this.showNotificationMessage('Topic: ' + message.body);
    });

    // Subscribe to user-specific queue (Spring automatically maps this)
    this.stompClient.subscribe('/user/queue/messages', (message: any) => {
      this.showNotificationMessage('Private: ' + message.body);
    });

  }, (error: any) => {
    console.error('❌ WebSocket connection error:', error);
  });
}

   showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    // this.showNotification = true;
    // setTimeout(() => this.showNotification = false, 5000); 
  }



  
}
