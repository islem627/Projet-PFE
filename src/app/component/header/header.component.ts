import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

interface Notification {
  message: string;
  date: string;
  status: string;  // Statut ajouté pour chaque notification
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  private stompClient: any;
  messages: Notification[] = [];
  notificationCount = 0;
  showNotifications = false;
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.connect();
  }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected:', frame);
      this.stompClient.subscribe('/topic/notifications', (message: any) => {
        this.showNotification(message.body);
      });
    }, (error: any) => {
      console.error('Erreur de connexion WebSocket:', error);
    });
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
