import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private pusher!: Pusher;
  private channel: any;

  constructor() {}

  public init() {
    this.pusher = new Pusher('5c434c2523cf909f4c29', {
      cluster: 'eu', // L'option cluster est toujours valide
    });

    this.channel = this.pusher.subscribe('notification-channel');
    this.channel.bind('new-notification', (data: any) => {
      console.log('Notification reçue:', data);
    this.listenForNotifications(data.message); 

    });
  }
   /* public listenForNotifications(callback: (message: string) => void): void {
      // Appel de la fonction callback avec le message
      if (callback) {
        //callback("Nouvelle notification: " + "Votre message ici");
        callback("Nouvelle notification: " + data.message);      }
    }*/
        public listenForNotifications(callback: (message: string) => void): void {
          // Appel du callback avec le message dynamique
          console.log('Message reçu:', callback);  // Affiche le message dans la console pour vérification
          // On transmet le message à la fonction callback
          callback("Message dynamique");

        
        }
      

}
