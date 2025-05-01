// src/app/components/chat/chat.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from 'src/app/models/chat-message';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
import { TypingEvent } from 'src/app/models/TypingEvent';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageInput: string = '';
  userId: string = '';
  messageList: ChatMessage[] = [];
  roomId: string = 'ABC';
  typingUser: string | null = null;
  connectionError: string | null = null;
  loadingMessages: boolean = true; // Nouveau : indique si les messages sont en cours de chargement
  loadingError: string | null = null; // Nouveau : erreur spécifique pour le chargement des messages
  private messageSubscription: Subscription | null = null;
  private typingSubscription: Subscription | null = null;
  private connectionSubscription: Subscription | null = null;
  private seenMessages: Set<string> = new Set();
  private typingTimeout: any;
  private loadingTimeout: any;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || '';
      console.log('UserId depuis la route :', this.userId);
      this.chatService.joinRoom(this.roomId);
      this.chatService.subscribeToTyping(this.roomId);
      this.lisenerMessage();
      this.listenToTyping();
      this.listenToConnectionStatus();
      // Définir un timeout pour détecter un échec de chargement
      this.loadingTimeout = setTimeout(() => {
        if (this.loadingMessages && this.messageList.length === 0) {
          this.loadingMessages = false;
          this.loadingError = 'Impossible de charger l\'historique des messages';
          console.error('Échec du chargement des messages après 10 secondes');
        }
      }, 10000);
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    clearTimeout(this.typingTimeout);
    clearTimeout(this.loadingTimeout);
  }

  sendMessage() {
    if (!this.messageInput.trim()) {
      console.warn("Impossible d'envoyer un message vide");
      this.connectionError = "Impossible d'envoyer un message vide";
      return;
    }
    if (!this.userId) {
      console.error('UserId non défini');
      this.connectionError = "Utilisateur non identifié";
      return;
    }
    const chatMessage: ChatMessage = {
      message: this.messageInput,
      user: this.userId
    };
    console.log('Tentative d\'envoi du message :', chatMessage);
    this.chatService.sendMessage(this.roomId, chatMessage);
    this.messageInput = '';
    this.connectionError = null;
    this.chatService.sendTypingEvent(this.roomId, this.userId, false);
  }

  lisenerMessage() {
    this.messageSubscription = this.chatService.getMessageSubject().subscribe({
      next: (messages: ChatMessage[]) => {
        console.log('Messages reçus dans lisenerMessage :', messages);
        this.messageList = messages.map((item: ChatMessage) => ({
          ...item,
          message_side: item.user === this.userId ? 'sender' : 'receiver'
        }));
        console.log('messageList mis à jour :', this.messageList);
        if (this.messageList.length > 0) {
          this.loadingMessages = false;
          this.loadingError = null;
          console.log('Messages chargés avec succès');
        }
        messages.forEach((msg) => {
          if (
            msg.id &&
            !msg.seen &&
            msg.user !== this.userId &&
            !this.seenMessages.has(msg.id)
          ) {
            console.log('Envoi de notification de vu pour message ID :', msg.id);
            this.seenMessages.add(msg.id);
            this.chatService.sendSeenNotification(this.roomId, msg);
          }
        });
      },
      error: (error) => {
        console.error('Erreur dans lisenerMessage :', error);
        this.loadingMessages = false;
        this.loadingError = 'Impossible de charger l\'historique des messages';
      }
    });
  }

  listenToTyping() {
    this.typingSubscription = this.chatService.getTypingSubject().subscribe((event: TypingEvent | null) => {
      console.log('Événement de saisie reçu dans listenToTyping :', event);
      if (event && event.user !== this.userId && event.isTyping) {
        this.typingUser = event.user;
        console.log('Mise à jour de typingUser :', this.typingUser);
      } else {
        this.typingUser = null;
        console.log('Réinitialisation de typingUser');
      }
    });
  }

  listenToConnectionStatus() {
    this.connectionSubscription = this.chatService.isConnectedStatus().subscribe((connected) => {
      if (!connected) {
        this.connectionError = 'Connexion au serveur perdue. Tentative de reconnexion...';
        console.warn('Connexion STOMP perdue');
      } else {
        this.connectionError = null;
        console.log('Connexion STOMP rétablie');
        // Réessayer de charger les messages si la connexion est rétablie
        this.loadingMessages = true;
        this.loadingError = null;
        this.chatService.joinRoom(this.roomId);
        this.chatService.subscribeToTyping(this.roomId);
      }
    });
  }

  onTyping() {
    console.log('Détection de la saisie pour l\'utilisateur :', this.userId);
    this.chatService.sendTypingEvent(this.roomId, this.userId, true);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      console.log('Arrêt de la saisie pour l\'utilisateur :', this.userId);
      this.chatService.sendTypingEvent(this.roomId, this.userId, false);
    }, 3000);
  }

  debugSeenStatus(item: ChatMessage): string {
    console.log('Rendu du statut vu pour message:', item);
    return '';
  }

  debugInput(): void {
    console.log('Input détecté pour', this.userId);
  }
}