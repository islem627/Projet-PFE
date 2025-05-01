// src/app/services/chat.service.ts
/*import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, first } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import SockJS from 'sockjs-client';
import { TypingEvent } from '../models/TypingEvent';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private typingSubject: BehaviorSubject<TypingEvent | null> = new BehaviorSubject<TypingEvent | null>(null);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private subscribedRooms: Set<string> = new Set();

  constructor() {
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const url = 'http://localhost:3000/chat-socket';
    console.log('Tentative de connexion à WebSocket :', url);
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      () => {
        console.log('Connexion STOMP établie avec succès');
        this.isConnected.next(true);
        this.reconnectAttempts = 0;
        this.subscribedRooms.forEach((roomId) => {
          this.subscribeToRoom(roomId);
          this.subscribeToTyping(roomId);
          this.requestMessageHistory(roomId); // Demander l'historique
        });
      },
      (error: any) => {
        console.error('Erreur de connexion STOMP :', error);
        this.isConnected.next(false);
        this.handleReconnect();
      }
    );
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${this.reconnectDelay}ms`);
      setTimeout(() => {
        this.initConnectionSocket();
      }, this.reconnectDelay);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint. Veuillez vérifier le serveur WebSocket.');
    }
  }

    subscribeToRoom(roomId: string) {
      if (!this.isConnected.getValue()) {
        console.warn(`Impossible de s'abonner au salon ${roomId} : pas de connexion STOMP.`);
        this.subscribedRooms.add(roomId);
        return;
      }
      console.log(`Souscription au topic /topic/${roomId}`);
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const currentMessages = this.messageSubject.getValue();
        try {
          const messageContent = JSON.parse(messages.body);
          console.log('Message reçu sur /topic/' + roomId + ':', messageContent);
    
          if (Array.isArray(messageContent)) {
            // Handle history response (array of messages)
            messageContent.forEach((msg: ChatMessage) => {
              const index = currentMessages.findIndex((existingMsg) => existingMsg.id === msg.id);
              if (index >= 0) {
                currentMessages[index] = { ...msg };
              } else {
                currentMessages.push(msg);
              }
            });
          } else {
            // Handle single message
            const index = currentMessages.findIndex((msg) => msg.id === messageContent.id);
            if (index >= 0) {
              currentMessages[index] = { ...messageContent };
            } else {
              currentMessages.push(messageContent);
            }
          }
          this.messageSubject.next([...currentMessages]);
        } catch (error) {
          console.error('Erreur lors du traitement du message STOMP :', error);
        }
      });
    }

  requestMessageHistory(roomId: string) {
    if (!this.isConnected.getValue()) {
      console.warn(`Impossible de demander l'historique pour ${roomId} : pas de connexion STOMP.`);
      return;
    }
    console.log(`Demande de l'historique des messages pour le salon ${roomId}`);
    this.stompClient.send(`/app/history/${roomId}`, {}, {});
  }

  joinRoom(roomId: string) {
    this.isConnected.pipe(first((connected) => connected)).subscribe((connected) => {
      if (connected) {
        console.log(`Abonnement au salon ${roomId}`);
        this.subscribedRooms.add(roomId);
        this.subscribeToRoom(roomId);
        this.requestMessageHistory(roomId);
      } else {
        console.error(`Connexion STOMP non établie. Salon ${roomId} ajouté pour reconnexion.`);
        this.subscribedRooms.add(roomId);
      }
    });
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    if (!this.isConnected.getValue()) {
      console.error('Impossible d\'envoyer le message : pas de connexion STOMP.');
      return;
    }
    console.log('Envoi du message STOMP :', JSON.stringify(chatMessage));
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    console.log(`Message envoyé au salon ${roomId} :`, chatMessage);
  }

  sendSeenNotification(roomId: string, chatMessage: ChatMessage) {
    if (!this.isConnected.getValue()) {
      console.error('Impossible d\'envoyer la notification de vu : pas de connexion STOMP.');
      return;
    }
    console.log('Envoi de la notification de vu pour le message ID :', chatMessage.id);
    this.stompClient.send(`/app/seen/${roomId}`, {}, JSON.stringify(chatMessage));
  }

  sendTypingEvent(roomId: string, user: string, isTyping: boolean) {
    if (!this.isConnected.getValue()) {
      console.error('Impossible d\'envoyer l\'événement de saisie : pas de connexion STOMP.');
      return;
    }
    const event: TypingEvent = { user, isTyping };
    console.log('Envoi de l\'événement de saisie :', event);
    this.stompClient.send(`/app/typing/${roomId}`, {}, JSON.stringify(event));
  }

  subscribeToTyping(roomId: string) {
    if (!this.isConnected.getValue()) {
      console.warn(`Impossible de s'abonner au topic /topic/typing/${roomId} : pas de connexion STOMP.`);
      this.subscribedRooms.add(roomId);
      return;
    }
    console.log(`Abonnement au topic /topic/typing/${roomId}`);
    this.stompClient.subscribe(`/topic/typing/${roomId}`, (event: any) => {
      const typingEvent: TypingEvent = JSON.parse(event.body);
      console.log('Événement de saisie reçu :', typingEvent);
      const correctedEvent: TypingEvent = {
        user: typingEvent.user,
        isTyping: (typingEvent as any).typing ?? typingEvent.isTyping
      };
      this.typingSubject.next(correctedEvent);
    });
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  getTypingSubject() {
    return this.typingSubject.asObservable();
  }

  isConnectedStatus() {
    return this.isConnected.asObservable();
  }
}*/
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, first } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import SockJS from 'sockjs-client';
import { TypingEvent } from '../models/TypingEvent';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private typingSubject: BehaviorSubject<TypingEvent | null> = new BehaviorSubject<TypingEvent | null>(null);
  private unreadCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0); // New subject for unread count
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private subscribedRooms: Set<string> = new Set();

  constructor() {
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const url = 'http://localhost:3000/chat-socket';
    console.log('Tentative de connexion à WebSocket :', url);
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      () => {
        console.log('Connexion STOMP établie avec succès');
        this.isConnected.next(true);
        this.reconnectAttempts = 0;
        this.subscribedRooms.forEach((roomId) => {
          this.subscribeToRoom(roomId);
          this.subscribeToTyping(roomId);
          this.requestMessageHistory(roomId);
        });
        // Subscribe to user-specific notifications
        this.subscribeToNotifications();
      },
      (error: any) => {
        console.error('Erreur de connexion STOMP :', error);
        this.isConnected.next(false);
        this.handleReconnect();
      }
    );
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${this.reconnectDelay}ms`);
      setTimeout(() => {
        this.initConnectionSocket();
      }, this.reconnectDelay);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint. Veuillez vérifier le serveur WebSocket.');
    }
  }

  subscribeToRoom(roomId: string) {
    if (!this.isConnected.getValue()) {
      console.warn(`Impossible de s'abonner au salon ${roomId} : pas de connexion STOMP.`);
      this.subscribedRooms.add(roomId);
      return;
    }
    console.log(`Souscription au topic /topic/${roomId}`);
    this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
      const currentMessages = this.messageSubject.getValue();
      try {
        const messageContent = JSON.parse(messages.body);
        console.log('Message reçu sur /topic/' + roomId + ':', messageContent);

        if (Array.isArray(messageContent)) {
          messageContent.forEach((msg: ChatMessage) => {
            const index = currentMessages.findIndex((existingMsg) => existingMsg.id === msg.id);
            if (index >= 0) {
              currentMessages[index] = { ...msg };
            } else {
              currentMessages.push(msg);
            }
          });
        } else {
          const index = currentMessages.findIndex((msg) => msg.id === messageContent.id);
          if (index >= 0) {
            currentMessages[index] = { ...messageContent };
          } else {
            currentMessages.push(messageContent);
          }
        }
        this.messageSubject.next([...currentMessages]);
      } catch (error) {
        console.error('Erreur lors du traitement du message STOMP :', error);
      }
    });
  }

  requestMessageHistory(roomId: string) {
    if (!this.isConnected.getValue()) {
      console.warn(`Impossible de demander l'historique pour ${roomId} : pas de connexion STOMP.`);
      return;
    }
    console.log(`Demande de l'historique des messages pour le salon ${roomId}`);
    this.stompClient.send(`/app/history/${roomId}`, {}, {});
  }

  joinRoom(roomId: string) {
    this.isConnected.pipe(first((connected) => connected)).subscribe((connected) => {
      if (connected) {
        console.log(`Abonnement au salon ${roomId}`);
        this.subscribedRooms.add(roomId);
        this.subscribeToRoom(roomId);
        this.requestMessageHistory(roomId);
      } else {
        console.error(`Connexion STOMP non établie. Salon ${roomId} ajouté pour reconnexion.`);
        this.subscribedRooms.add(roomId);
      }
    });
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    if (!this.isConnected.getValue()) {
      console.error('Impossible d\'envoyer le message : pas de connexion STOMP.');
      return;
    }
    console.log('Envoi du message STOMP :', JSON.stringify(chatMessage));
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    console.log(`Message envoyé au salon ${roomId} :`, chatMessage);
  }

  sendSeenNotification(roomId: string, chatMessage: ChatMessage) {
    if (!this.isConnected.getValue()) {
      console.error('Impossible d\'envoyer la notification de vu : pas de connexion STOMP.');
      return;
    }
    console.log('Envoi de la notification de vu pour le message ID :', chatMessage.id);
    this.stompClient.send(`/app/seen/${roomId}`, {}, JSON.stringify(chatMessage));
  }

  sendTypingEvent(roomId: string, user: string, isTyping: boolean) {
    if (!this.isConnected.getValue()) {
      console.error('Impossible d\'envoyer l\'événement de saisie : pas de connexion STOMP.');
      return;
    }
    const event: TypingEvent = { user, isTyping };
    console.log('Envoi de l\'événement de saisie :', event);
    this.stompClient.send(`/app/typing/${roomId}`, {}, JSON.stringify(event));
  }

  subscribeToTyping(roomId: string) {
    if (!this.isConnected.getValue()) {
      console.warn(`Impossible de s'abonner au topic /topic/typing/${roomId} : pas de connexion STOMP.`);
      this.subscribedRooms.add(roomId);
      return;
    }
    console.log(`Abonnement au topic /topic/typing/${roomId}`);
    this.stompClient.subscribe(`/topic/typing/${roomId}`, (event: any) => {
      const typingEvent: TypingEvent = JSON.parse(event.body);
      console.log('Événement de saisie reçu :', typingEvent);
      const correctedEvent: TypingEvent = {
        user: typingEvent.user,
        isTyping: (typingEvent as any).typing ?? typingEvent.isTyping
      };
      this.typingSubject.next(correctedEvent);
    });
  }

  // New method to subscribe to notifications
  subscribeToNotifications() {
    if (!this.isConnected.getValue()) {
      console.warn('Impossible de s\'abonner aux notifications : pas de connexion STOMP.');
      return;
    }
    console.log('Souscription au topic /user/queue/notifications');
    this.stompClient.subscribe('/user/queue/notifications', (notification: any) => {
      const unreadCount = parseInt(notification.body, 10);
      console.log('Notification de compte non lu reçue :', unreadCount);
      this.unreadCountSubject.next(unreadCount);
    });
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  getTypingSubject() {
    return this.typingSubject.asObservable();
  }

  isConnectedStatus() {
    return this.isConnected.asObservable();
  }

  getUnreadCountSubject() {
    return this.unreadCountSubject.asObservable();
  }
}