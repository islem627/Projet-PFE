// src/app/components/header-partner/header-partner.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebSocketPartnerService } from 'src/app/services/web-socket-partner.service';

interface Notification {
  orderId: string;
  message: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-header-partner',
  templateUrl: './header-partner.component.html',
  styleUrls: ['./header-partner.component.css']
})
export class HeaderPartnerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  notificationCount = 0;
  showNotifications = false;
  private subscription: Subscription | null = null;
  currentPartner: { id: number; username: string } | null = null;

  constructor(
    private webSocketService: WebSocketPartnerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initPartner();
    if (this.currentPartner) {
      this.webSocketService.connect(this.currentPartner.username);
      this.subscription = this.webSocketService.notifications$.subscribe((updates) => {
        updates.forEach((update) => {
          const notification: Notification = {
            orderId: update.orderId,
            message: `Commande ${update.orderId} mise à jour: ${update.status}`,
            date: new Date().toISOString(),
            status: 'new'
          };
          this.notifications.unshift(notification);
          this.notificationCount = this.notifications.filter(n => n.status === 'new').length;
          Swal.fire({
            title: 'Nouvelle notification',
            text: notification.message,
            icon: 'info',
            timer: 5000,
            showConfirmButton: false
          });
        });
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  private initPartner(): void {
    const storedUsername = localStorage.getItem('username');
    const storedId = localStorage.getItem('iduser');
    if (this.authService.currentUser) {
      this.currentPartner = {
        id: this.authService.currentUser.iduser,
        username: this.authService.currentUser.username
      };
    } else if (storedUsername && storedId) {
      this.currentPartner = {
        id: parseInt(storedId, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentPartner;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notifications.forEach((n) => (n.status = 'read'));
      this.notificationCount = 0;
    }
  }

  deleteNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.notificationCount = this.notifications.filter(n => n.status === 'new').length;
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
  }

  getNotificationClass(status: string): string {
    return status === 'new' ? 'notification-new' : 'notification-read';
  }

  markAsRead(index: number): void {
    this.notifications[index].status = 'read';
    this.notificationCount = this.notifications.filter(n => n.status === 'new').length;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.webSocketService.disconnect();
  }
}