import { Component, OnInit } from '@angular/core';
import { NotifserviceService } from 'src/app/services/notifservice.service';

@Component({
  selector: 'app-notifclient',
  templateUrl: './notifclient.component.html',
})
export class NotifclientComponent implements OnInit {
  notifications: string[] = []; // Liste des notifications
  clientId: string | null = '';  // Déclaration de clientId

  constructor(private webSocketService: NotifserviceService) {}

  ngOnInit(): void {
    // Récupérer l'ID du client depuis localStorage
    this.clientId = localStorage.getItem('iduser');  // Suppose que 'userId' est la clé où l'ID est stocké

    // Vérifier si l'ID est valide
    if (this.clientId) {
      // Connexion WebSocket et écoute des messages
      this.webSocketService.connect(this.clientId);

      // Souscrire aux messages et ajouter les notifications à la liste
      this.webSocketService.getMessages().subscribe(message => {
        this.notifications.push(message); // Ajouter la notification reçue
      });
    } else {
      console.error('Client ID non trouvé dans localStorage');
    }
  }
}
