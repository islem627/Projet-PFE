import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private pusher: any;  // Utilisation de any temporairement pour contourner le problème de type
  private channel: any;  // Utilisation de any pour le canal aussi

  constructor() {
    // Remplacez 'YOUR_APP_KEY' et 'YOUR_CLUSTER' par vos informations réelles de Pusher.
    this.pusher = new Pusher('5c434c2523cf909f4c29', {
      cluster: 'eu'
    });

    // S'abonner à un canal
    this.channel = this.pusher.subscribe('my-channel');
  }

  /**
   * Méthode pour écouter un événement spécifique sur le canal Pusher
   * @param callback - La fonction qui sera exécutée lorsqu'un message est reçu
   */
  listenToEvent(callback: (data: any) => void) {
    // Liez l'événement à la fonction callback pour traiter les données reçues
    this.channel.bind('my-event', (data: any) => {
      callback(data);  // Exécute la fonction callback avec les données reçues
    });
  }
}
