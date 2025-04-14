import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { PusherService } from 'src/app/services/pusher.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  message: string = '';
  receivedMessage: string = '';

  constructor(private messageService: MessageService, private pusherService: PusherService) {
    this.pusherService.listenToEvent((data) => {
      this.receivedMessage = data;
    });
  }

  sendMessage() {
    this.messageService.sendMessage(this.message).subscribe(response => {
      console.log('Message sent:', response);
      this.receivedMessage = response;  // Affiche le message envoyé sur la page

    });
  }
}
