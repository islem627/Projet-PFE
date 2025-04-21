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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketServiceeService } from '../../services/web-socket-servicee.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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
export class HeaderclientComponent implements OnInit, OnDestroy {
  
  notifications: any[] = [];
  private subscription: Subscription | null = null;
  userId: string;
  token: string;
  messages: Notification[] = [];
  notificationCount = 0;
  showNotifications = false;

  constructor(
    private webSocketService: WebSocketServiceeService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
  ) {
    this.userId = localStorage.getItem('iduser') || '';
    this.token = localStorage.getItem('token') || '';
  }

  ngOnInit(): void {
    if (this.userId && this.token) {
      this.webSocketService.connect(this.userId, this.token);
      this.subscription = this.webSocketService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        console.log('Notifications received in Headerclient:', notifications);
      });
    } else {
      console.error('userId or token missing');
      Swal.fire('Error', 'Please log in to receive notifications', 'error');
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  logout(): void {
    const authHeader = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    Swal.fire({
      title: 'Logout?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('iduser');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('email');

        this.http.get('http://localhost:8762/User/signout', { headers: authHeader }).subscribe({
          next: () => {
            this.router.navigate(['/']);
            Swal.fire({
              title: 'Logged out!',
              text: 'You have been logged out successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Logout error:', err);
            Swal.fire('Error', 'Error during logout. Please try again.', 'error');
          }
        });
      }
    });
  }
 

}