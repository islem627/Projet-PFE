/*import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  constructor() { 
    this.initConnenctionSocket();
  }

  initConnenctionSocket() {
    const url = '//localhost:3000/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);

        this.messageSubject.next(currentMessage);

      })
    })
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
}*/

///
//

import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, first } from 'rxjs';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { 
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const url = '//localhost:3000/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.isConnected.next(true);
      console.log('STOMP connection established');
    }, (error: any) => {
      console.error('STOMP connection error:', error);
      this.isConnected.next(false);
    });
  }

  joinRoom(roomId: string) {
    this.isConnected.subscribe((connected) => {
      if (connected) {
        this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
          const messageContent = JSON.parse(messages.body);
          const currentMessages = this.messageSubject.getValue();
          currentMessages.push(messageContent);
          this.messageSubject.next(currentMessages);
        });
      } else {
        console.error('STOMP connection is not established. Unable to join the room.');
      }
    });
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.isConnected.subscribe((connected) => {
      if (connected) {
        this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
      } else {
        console.error('STOMP connection is not established. Unable to send the message.');
      }
    });
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }
}
