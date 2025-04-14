import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-order-user-client',
  templateUrl: './order-user-client.component.html',
  styleUrls: ['./order-user-client.component.css']
})
export class OrderUserClientComponent implements OnInit {
  private stompClient!: Client;
  orderUpdates: any[] = [];

  ngOnInit(): void {
    this.connect();
  }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg: string) => console.log(msg),
      onConnect: () => {
        console.log('Connected to WebSocket');

        // Subscribe to the order topic
        this.stompClient.subscribe('/topic/order', (message: any) => {
          const orderUpdate = JSON.parse(message.body);
          this.displayOrderUpdate(orderUpdate);
        });
      },
      onStompError: (error) => {
        console.error('WebSocket connection error:', error);
      }
    });

    this.stompClient.activate();
  }

  displayOrderUpdate(orderUpdate: any): void {
    let icon = '';
    let progressBarClass = '';
    let progressValue = 0;

    // Determine the icon and progress for the order status
    if (orderUpdate.status === 'Prepared') {
      icon = 'fas fa-utensils prepared';
      progressBarClass = 'progress-bar-striped bg-warning';
      progressValue = 33;
    } else if (orderUpdate.status === 'Ready') {
      icon = 'fas fa-check-circle ready';
      progressBarClass = 'progress-bar-striped bg-info';
      progressValue = 66;
    } else if (orderUpdate.status === 'Delivered') {
      icon = 'fas fa-truck delivered';
      progressBarClass = 'progress-bar-striped bg-success';
      progressValue = 100;
    }

    // Add the update to the array of updates
    this.orderUpdates.push({
      status: orderUpdate.status,
      orderId: orderUpdate.orderId,
      icon,
      progressBarClass,
      progressValue
    });
  }
}