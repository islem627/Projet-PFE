/*import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
import { Client, IMessage } from '@stomp/stompjs'; // en haut du fichier
import { NotifuserService } from 'src/app/services/notifuser.service';



interface Notification {
  message: string;
  date: string;
  status: string;  // Statut ajouté pour chaque notification
}

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
  
})
export class HeaderclientComponent implements OnInit {
  notifications: string[] = [];
  private stompClient!: Client;
  messages: Notification[] = [];
  notificationCount = 0;
  showNotifications = false;
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotifuserService

  ) {}

  ngOnInit(): void {
    
    this.connect();
    this.notificationService.notifications$.subscribe((notifications) => {
    this.notifications = notifications;
    });
  }
  

  connect(): void {
    const userId = localStorage.getItem('userId'); // récupère l'utilisateur
    if (!userId) return;
  
    this.stompClient = new Client({
      brokerURL: undefined, // nécessaire quand on utilise SockJS
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (msg: string) => {
        console.log('STOMP DEBUG:', msg);
      },
      onConnect: (frame) => {
        console.log('Connecté à WebSocket :', frame);
  
        this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
          this.showNotification(message.body);
        });
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP :', frame.headers['message']);
        console.error('Détails :', frame.body);
      }
    });
  
    this.stompClient.activate(); // à la place de connect()
  }

  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
  

  showNotification(message: string): void {
    const currentTime = new Date();
    const formattedTime = this.formatDate(currentTime);

    // Ajout de la notification avec statut 'new' par défaut
    this.messages.unshift({ message, date: formattedTime, status: 'new' });
    this.notificationCount++;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationCount = 0;
    }
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
      logout(): void {
        // Créer les en-têtes d'authentification si nécessaire
        const authHeader = new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
    
        // Affichage d'une alerte de confirmation avec SweetAlert2
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
            // Suppression des éléments du localStorage (token, refreshToken, etc.)
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
        
            // Vérification dans la console pour s'assurer que tout est supprimé
            console.log("LocalStorage après déconnexion:", localStorage);
    
            // Appel à l'API de déconnexion sur le backend (en utilisant HttpClient)
            this.http.get('http://localhost:8762/User/signout', { headers: authHeader }).subscribe({
              next: (response) => {
                // Si la déconnexion réussit, on redirige l'utilisateur vers la page de connexion
                console.log("Déconnexion réussie:", response);
                
                // Redirection vers la page de login
                this.router.navigate(['/']);
    
                // Affichage d'un message de succès avec SweetAlert2
                Swal.fire({
                  title: "Logged out!",
                  text: "You have been successfully logged out.",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false
                });
              },
              error: (err) => {
                // Si l'API de déconnexion échoue, on affiche une erreur
                console.error("Erreur de déconnexion:", err);
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
        
}

*/






/*

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketServiceeService } from '../../services/web-socket-servicee.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
})
export class HeaderclientComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private subscription: Subscription | null = null;
  userId = '21'; // Simulé, récupéré depuis l'authentification
  token = localStorage.getItem('token') || ''; // Simulé, récupéré depuis le login

  constructor(private webSocketService: WebSocketServiceeService ,
          private http: HttpClient,
          private router: Router,

  ) {}

  ngOnInit(): void {
    this.webSocketService.connect(this.userId, this.token);
    this.subscription = this.webSocketService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      console.log('Notifications reçues dans Headerclient:', notifications);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }
   logout(): void {
          // Créer les en-têtes d'authentification si nécessaire
          const authHeader = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          });
      
          // Affichage d'une alerte de confirmation avec SweetAlert2
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
              // Suppression des éléments du localStorage (token, refreshToken, etc.)
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('role');
              localStorage.removeItem('username');
              localStorage.removeItem('email');
          
              // Vérification dans la console pour s'assurer que tout est supprimé
              console.log("LocalStorage après déconnexion:", localStorage);
      
              // Appel à l'API de déconnexion sur le backend (en utilisant HttpClient)
              this.http.get('http://localhost:8762/User/signout', { headers: authHeader }).subscribe({
                next: (response) => {
                  // Si la déconnexion réussit, on redirige l'utilisateur vers la page de connexion
                  console.log("Déconnexion réussie:", response);
                  
                  // Redirection vers la page de login
                  this.router.navigate(['/']);
      
                  // Affichage d'un message de succès avec SweetAlert2
                  Swal.fire({
                    title: "Logged out!",
                    text: "You have been successfully logged out.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                  });
                },
                error: (err) => {
                  // Si l'API de déconnexion échoue, on affiche une erreur
                  console.error("Erreur de déconnexion:", err);
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
}

*/



/*
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { WebSocketServiceeService } from '../../services/web-socket-servicee.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AllmyservicesService, Commande, UserDTO } from 'src/app/services/allmyservices.service';

export interface ChatMessage {
  message: string;
  user: string;
}

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
})
export class HeaderclientComponent implements OnInit, OnDestroy {

  userId: string;
  token: string;
  commandes: Commande[] = [];
  livreurs: UserDTO[] = [];
  messages: { message: string, date: string, status: string }[] = [];
  notificationCount = 0;
  showNotifications = false;
  loading = false;
  private subscription: Subscription | null = null;
  errorMessage: string | null = null;
  currentLivreur: { livreurId: number; username: string } | null = null;
  listorders: Commande[] = [];

  constructor(
    private webSocketService: WebSocketServiceeService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private service: AllmyservicesService
  ) {
    this.userId = localStorage.getItem('iduser') || '';
    this.token = localStorage.getItem('token') || '';
  }

  ngOnInit(): void {
    this.initUser();
    if (this.currentLivreur) {
      this.fetchCommandesByLivreur(this.currentLivreur.livreurId.toString());
    }
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      // Ensure that currentUser contains livreurId and username
      this.currentLivreur = {
        livreurId: this.authService.currentUser.iduser, // Use iduser here
        username: this.authService.currentUser.username
      };
      console.log('Utilisateur connecté (AuthService) :', this.currentLivreur);
    } else if (storedUsername && storedIduser) {
      this.currentLivreur = {
        livreurId: parseInt(storedIduser, 10),
        username: storedUsername
      };
      console.log('Utilisateur chargé depuis localStorage :', this.currentLivreur);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('Aucun identifiant utilisateur trouvé.');
    }
  }

  private fetchCommandesByLivreur(iduser: string): void {
    this.service.AllcmdByIdClient(iduser).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.listorders = [...this.commandes]; // Pour gestion archive
        this.errorMessage = null;
        console.log(`Commandes récupérées pour le client ${iduser} :`, commandes);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commandes du client :', err);
        this.errorMessage = 'Erreur lors du chargement des commandes du client.';
      }
    });
  }

  getLivreurFromCommandes(): void {
    try {
      if (!this.commandes || this.commandes.length === 0) {
        alert('Aucune commande trouvée.');
        return;
      }

      const clientsFromCommandes = this.commandes
        .map(c => c.userDTO)
        .filter((livreur): livreur is UserDTO => livreur !== undefined && livreur !== null);

      const uniqueClientsMap = new Map<number, UserDTO>();

      clientsFromCommandes.forEach(livreur => {
        if (!uniqueClientsMap.has(livreur.id)) {
          uniqueClientsMap.set(livreur.id, livreur);
        }
      });

      this.livreurs = Array.from(uniqueClientsMap.values());
      console.log('Clients extraits :', this.livreurs);

    } catch (error) {
      console.error('Erreur dans getLivreurFromCommandes()', error);
    }
  }

  ngOnDestroy(): void {
    // Handle cleanup
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }*/





    import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { WebSocketServiceeService } from 'src/app/services/web-socket-servicee.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AllmyservicesService , Commande, UserDTO } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-headerclient',
  templateUrl: './headerclient.component.html',
  styleUrls: ['./headerclient.component.css']
})
export class HeaderclientComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  userId: string;
  token: string;
  commandes: Commande[] = [];
  livreurs: UserDTO[] = [];
  messages: { message: string, date: string, status: string }[] = [];
  notificationCount = 0;
  showNotifications = false;
  loading = false;
  private subscription: Subscription | null = null;
  errorMessage: string | null = null;
  currentLivreur: { livreurId: number; username: string } | null = null;
  listorders: Commande[] = [];

  constructor(
    private webSocketService: WebSocketServiceeService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private service: AllmyservicesService
  ) {
    this.userId = localStorage.getItem('iduser') || '';
    this.token = localStorage.getItem('token') || '';
  }

  ngOnInit(): void {


    this.webSocketService.connect(this.userId, this.token);
    this.subscription = this.webSocketService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      console.log('Notifications reçues dans Headerclient:', notifications);
    });


    this.initUser();
    if (this.currentLivreur) {
      this.fetchCommandesByLivreur(this.currentLivreur.livreurId.toString());
    }
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      this.currentLivreur = {
        livreurId: this.authService.currentUser.iduser,
        username: this.authService.currentUser.username
      };
      console.log('Utilisateur connecté (AuthService) :', this.currentLivreur);
    } else if (storedUsername && storedIduser) {
      this.currentLivreur = {
        livreurId: parseInt(storedIduser, 10),
        username: storedUsername
      };
      console.log('Utilisateur chargé depuis localStorage :', this.currentLivreur);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('Aucun identifiant utilisateur trouvé.');
    }
  }

  private fetchCommandesByLivreur(iduser: string): void {
    this.service.AllcmdByIdClient(iduser).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.listorders = [...this.commandes]; // Pour gestion archive
        this.errorMessage = null;
        console.log(`Commandes récupérées pour le client ${iduser} :`, commandes);

        this.fetchLivreursFromCommandes(); // Appel des livreurs liés
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commandes du client :', err);
        this.errorMessage = 'Erreur lors du chargement des commandes du client.';
      }
    });
  }

  private fetchLivreursFromCommandes(): void {
    const livreurIds = Array.from(
      new Set(this.commandes.map(cmd => cmd.livreurId).filter(id => id !== null && id !== undefined))
    );

    if (livreurIds.length === 0) {
      console.warn('Aucun livreurId trouvé dans les commandes.');
      return;
    }

    this.livreurs = [];

    livreurIds.forEach(id => {
      this.service.DetailsUser(id.toString()).subscribe({
        next: (livreur: UserDTO) => {
          this.livreurs.push(livreur);
          console.log('Livreur récupéré :', livreur);
        },
        error: (err) => {
          console.error(`Erreur lors de la récupération du livreur avec l'id ${id}`, err);
        }
      });
    });
  }

  getLivreurFromCommandes(): void {
    try {
      if (!this.commandes || this.commandes.length === 0) {
        alert('Aucune commande trouvée.');
        return;
      }

      const clientsFromCommandes = this.commandes
        .map(c => c.userDTO)
        .filter((livreur): livreur is UserDTO => livreur !== undefined && livreur !== null);

      const uniqueClientsMap = new Map<number, UserDTO>();

      clientsFromCommandes.forEach(livreur => {
        if (!uniqueClientsMap.has(livreur.id)) {
          uniqueClientsMap.set(livreur.id, livreur);
        }
      });

      this.livreurs = Array.from(uniqueClientsMap.values());
      console.log('Clients extraits :', this.livreurs);

    } catch (error) {
      console.error('Erreur dans getLivreurFromCommandes()', error);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }







 /* loadCommandes(): void {
    if (!this.userId) {
      console.warn('ID utilisateur manquant');
      return;
    }

    this.loading = true;
    this.service.AllcmdByIdClient(this.userId).subscribe({
      next: (commandes: Commande[]) => {
        this.commandes = commandes;
        this.loadLivreurDetails();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des commandes du client :', error);
        this.loading = false;
      }
    });
  }*/
/*
  getLivreursFromCommandes(): void {
    // Récupérer les ID des livreurs à partir des commandes
    const uniqueLivreurIds = Array.from(
      new Set(this.commandes.map(cmd => cmd.livreurId).filter(id => id !== null))
    );

    // Si aucun livreur n'est associé aux commandes, on arrête ici
    if (uniqueLivreurIds.length === 0) {
      console.log('Aucun livreur trouvé pour ce client.');
      return;
    }

    // Appeler getUserById pour chaque ID de livreur unique
    const requests = uniqueLivreurIds.map(id => this.service.DetailsUser(id!));

    forkJoin(requests).subscribe({
      next: (users: UserDTO[]) => {
        this.livreurs = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livreurs :', error);
      }
    });
  }*/

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationCount = 0;
    }
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

  logout(): void {
    const authHeader = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    Swal.fire({
      title: "Se déconnecter ?",
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, se déconnecter",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.http.get('http://localhost:8762/User/signout', { headers: authHeader }).subscribe({
          next: () => {
            this.router.navigate(['/']);
            Swal.fire("Déconnecté", "Vous avez été déconnecté avec succès.", "success");
          },
          error: () => {
            Swal.fire("Erreur", "Une erreur est survenue lors de la déconnexion.", "error");
          }
        });
      }
    });
  }

  openChat(livreurId: number): void {
    if (!livreurId) {
      console.error('ID livreur non défini');
      return;
    }
    this.router.navigate(['/chat', livreurId]);
  }
}
