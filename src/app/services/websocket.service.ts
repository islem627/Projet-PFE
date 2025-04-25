import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;

  connect() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log('Connected');
    });
  }

  subscribeToUserNotifications(userId: string, callback: (message: any) => void) {
    this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: any) => {
      callback(JSON.parse(message.body));
    });
  }

  sendOrderStatusUpdate(orderId: string, status: string) {
    const orderUpdate = { orderId, status };
    this.stompClient.send('/app/order/status', {}, JSON.stringify(orderUpdate));
  }
}
