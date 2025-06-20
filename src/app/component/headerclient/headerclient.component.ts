
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { AllmyservicesService, Commande, UserDTO } from 'src/app/services/allmyservices.service';
// import { OrderUpdate, WebSocketServiceeService } from 'src/app/services/web-socket-servicee.service';
//import { ChatService } from 'src/app/services/chat.service';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Notification {
  message: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
})
export class HeaderclientComponent implements OnInit, OnDestroy {
    private stompClient: any;
      messages: Notification[] = [];
  notifications: Notification[] = [];
  userId: string;
  token: string;
  commandes: Commande[] = [];
  livreurs: UserDTO[] = [];
  notificationCount = 0;
  showNotifications = false;
  loading = false;
  private subscription: Subscription | null = null;
  errorMessage: string | null = null;
  currentUser: { iduser: number; username: string } | null = null;
  unreadMessageCount: number = 0;
  private unreadCountSubscription: Subscription | null = null;
    usernameUserConnected: String = '';
  roleUserConnected: String = '';
isUserConnected: String = '';
  constructor(
    // private webSocketService: WebSocketServiceeService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private service: AllmyservicesService,
    // private chatService : ChatService
    ) {
    this.userId = localStorage.getItem('iduser') || '';
    this.token = localStorage.getItem('token') || '';
  }

  ngOnInit(): void {
this.connect()
    
 this.usernameUserConnected = localStorage.getItem('username');
    this.roleUserConnected = localStorage.getItem('role');
    this.isUserConnected = localStorage.getItem('iduser');



    if (this.isUserConnected) {
      this.getClientDetails();  // Appel de la méthode pour récupérer les détails
    }
    // this.unreadCountSubscription = this.chatService.getUnreadCountSubject().subscribe({
    //   next: (count: number) => {
    //     this.unreadMessageCount = count;
    //     console.log('Compte de messages non lus mis à jour :', this.unreadMessageCount);
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors de la réception du compte de messages non lus :', error);
    //   }
    // });

    



    this.initUser();
    if (this.currentUser) {
      this.loadNotifications();
      // this.webSocketService.connect(this.currentUser.iduser.toString(), this.token);
      // this.subscription = this.webSocketService.notifications$.subscribe({
      //   next: (notifications: OrderUpdate[]) => {
      //     console.log('📨 Notifications brutes reçues:', notifications);
      //     const newNotifications = notifications.map((n: OrderUpdate) => ({
      //       message: `Commande #${n.orderId} (${n.articelCommande || 'Article inconnu'}) est maintenant ${n.status} pour livraison à ${n.adresseLivraison || 'Adresse inconnue'}`,
      //       date: n.dateCommande ? new Date(n.dateCommande).toLocaleString() : new Date().toLocaleString(),
      //       status: 'new'
      //     }));
      //     this.notifications = [...this.notifications, ...newNotifications];
      //     this.notificationCount = this.notifications.length;
      //     this.saveNotifications();
      //     console.log('✅ Notifications formatées:', this.notifications);
      //     Swal.fire({
      //       title: 'Nouvelle notification',
      //       text: newNotifications[newNotifications.length - 1].message,
      //       icon: 'info',
      //       timer: 5000,
      //       showConfirmButton: false
      //     });
      //   },
      //   error: (err) => {
      //     console.error('❌ Erreur dans l\'abonnement WebSocket:', err);
      //   }
      // });
      this.fetchCommandesByClient(this.currentUser.iduser.toString());
    } else {
      console.error('❌ userId ou token manquant dans localStorage');
    }
  }

  private saveNotifications(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  

  private loadNotifications(): void {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      this.notifications = JSON.parse(saved);
      this.notificationCount = this.notifications.length;
    }
  }
  ngOnDestroyChat(): void {
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }


  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
      console.log('✅ Utilisateur connecté (AuthService):', this.currentUser);
    } else if (storedUsername && storedUserId) {
      this.currentUser = {
        iduser: parseInt(storedUserId, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
      console.log('✅ Utilisateur chargé depuis localStorage:', this.currentUser);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('⚠️ Aucun identifiant utilisateur trouvé.');
      this.router.navigate(['/']);
    }
  }

  private fetchCommandesByClient(iduser: string): void {
    this.service.AllcmdByIdClient(iduser).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.errorMessage = null;
        console.log(`✅ Commandes récupérées pour le client ${iduser}:`, commandes);
        this.fetchLivreursFromCommandes();
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des commandes du client:', err);
        this.errorMessage = 'Erreur lors du chargement des commandes du client.';
      }
    });
  }

  private fetchLivreursFromCommandes(): void {
    const livreurIds = Array.from(
      new Set(this.commandes.map((cmd) => cmd.livreurId).filter((id) => id !== null && id !== undefined))
    );

    if (livreurIds.length === 0) {
      console.warn('⚠️ Aucun livreurId trouvé dans les commandes.');
      return;
    }

    this.livreurs = [];
    livreurIds.forEach((id) => {
      this.service.DetailsUser(id.toString()).subscribe({
        next: (livreur: UserDTO) => {
          this.livreurs.push(livreur);
          console.log('✅ Livreur récupéré:', livreur);
        },
        error: (err) => {
          console.error(`❌ Erreur lors de la récupération du livreur avec l'id ${id}`, err);
        }
      });
    });
  }

  toggleNotifications(event: Event): void {
  event.preventDefault(); // Empêche le comportement par défaut du lien
  this.showNotifications = !this.showNotifications;
  if (this.showNotifications) {
    this.notificationCount = 0;
    this.notifications.forEach((n) => (n.status = 'read'));
    this.saveNotifications();
  }
}

  deleteNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.notificationCount = this.notifications.length;
    this.saveNotifications();
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
    this.saveNotifications();
  }

  getNotificationClass(status: string): string {
    return status === 'new' ? 'notification-new' : 'notification-read';
  }

  markAsRead(index: number): void {
    this.notifications[index].status = 'read';
    this.saveNotifications();
  }
profile() : void
{
  this.router.navigate(['/updateprofile']);

}

 logout(): void {
    const authHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.token
    });

    Swal.fire({
      title: 'Log out?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.http.get('http://localhost:8762/User/signout', { headers: authHeader }).subscribe({
          next: () => {
            this.router.navigate(['/']);
            Swal.fire('Logged out', 'You have been successfully logged out.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'An error occurred during logout.', 'error');
          }
        });
      }
    });
  }


  openChat(livreurId: number): void {
    if (!livreurId) {
      console.error('❌ ID livreur non défini');
      return;
    }
    this.router.navigate(['/chat', livreurId]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // this.webSocketService.disconnect();
  }
  getLivreurFromCommandes(): void {
    console.log('Méthode getLivreurFromCommandes appelée.');
    this.fetchLivreursFromCommandes(); // Appeler la méthode existante pour charger les livreurs
  }



 user:any

    getClientDetails() {
    this.service.DetailsUser(this.isUserConnected).subscribe(
      (result) => {
        this.user = result;  // Stockage des détails du user
        console.log('Détails du user:', this.user);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du user:', error);
      }
    );
  }
  

  connect(): void {
      const socket = new SockJS('http://localhost:8764/ws');
        this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected:', frame);
      this.stompClient.subscribe('/topic/notifications', (message: any) => {
        console.log('Notification reçue:', message.body);
        this.showNotification(message.body);
      });
    }, (error: any) => {
      console.error('Erreur de connexion WebSocket:', error);
    });
  }

    showNotification(message: string): void {
    const currentTime = new Date();
    const formattedTime = this.formatDate(currentTime);
    console.log("***message in shwo is ***",message)  

    // Ajout de la notification avec statut 'new' par défaut
   // this.messages.unshift({ message, date: formattedTime, status: 'new' });
   this.notifications.unshift({ message, date: formattedTime, status: 'new' });
    this.notificationCount++;
  }

   formatDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
}
