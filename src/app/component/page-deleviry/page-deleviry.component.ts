import { Component } from '@angular/core';
import { NotifserviceService } from 'src/app/services/notifservice.service';

@Component({
  selector: 'app-page-deleviry',
  templateUrl: './page-deleviry.component.html',
})
export class PageDeleviryComponent {
  clientId = '';
  orderId = '';
  status = '';
  notificationEnvoyee = false;

  constructor(private webSocketService: NotifserviceService) {}
  ngOnInit() {
    this.webSocketService.connect('admin'); // nom fixe pour le livreur/admin
  }
  
  envoyerNotification() {
    const message = {
      orderId: this.orderId,
      status: this.status,
      commandeDTO: {
        iduser: this.clientId
      }
    };

    // ✅ Convertir l'objet en string JSON avant l'envoi
    this.webSocketService.connect('admin'); // ou un nom fixe selon ton backend
    this.notificationEnvoyee = true;
  }
}
