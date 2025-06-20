import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllmyservicesService, Commande, UserDTO } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-sidebar-client',
  templateUrl: './sidebar-client.component.html',
  styleUrls: ['./sidebar-client.component.css']
})
export class SidebarClientComponent implements OnInit, OnDestroy {
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
   
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private service: AllmyservicesService,
    private chatService : ChatService
    ) {
    this.userId = localStorage.getItem('iduser') || '';
    this.token = localStorage.getItem('token') || '';
  }

  ngOnInit(): void {
//this.connect()
    
 this.usernameUserConnected = localStorage.getItem('username');
    this.roleUserConnected = localStorage.getItem('role');
    this.isUserConnected = localStorage.getItem('iduser');



    if (this.isUserConnected) {
      this.getClientDetails();  // Appel de la méthode pour récupérer les détails
    }
    this.unreadCountSubscription = this.chatService.getUnreadCountSubject().subscribe({
      next: (count: number) => {
        this.unreadMessageCount = count;
        console.log('Compte de messages non lus mis à jour :', this.unreadMessageCount);
      },
      error: (error) => {
        console.error('Erreur lors de la réception du compte de messages non lus :', error);
      }
    });

    



    this.initUser();
    if (this.currentUser) {
      this.loadNotifications();
   
    
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

 
profile() : void
{
  this.router.navigate(['/updateprofile']);

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
  

}