import { Component, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private stompClient: any;
  messages: string[] = [];
  notificationCount = 0; // Number of unread notifications
  showNotifications = false; // Controls the display of the notification list

  ngOnInit(): void {
    this.connect();
  }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
   
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected:', frame);
      this.stompClient.subscribe('/topic/notifications', (message: any) => {
        this.showNotification(message.body);
      });
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  showNotification(message: string): void {
    const currentTime = new Date();
    const formattedTime = this.formatDate(currentTime);
  
    // Add the date and time to the notification
    const notificationWithTime = `${formattedTime}: ${message}`;
      
    this.messages.push(notificationWithTime);
    this.notificationCount++; // Increment the unread notification counter
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications; // Toggle the visibility of notifications
    if (this.showNotifications) {
      this.notificationCount = 0; // Reset the unread notification count when the list is opened
    }
  }

  // Method to format the date and time (hh:mm:ss dd/mm/yyyy)
  formatDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months start from 0
    const year = date.getFullYear();
  
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
}
