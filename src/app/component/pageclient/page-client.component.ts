/*import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PageClientComponent implements OnInit {
  commandes: any[] = [];
  errorMessage: string | null = null;
  currentUser: { iduser: number; username: string } | null = null;
  selectedOrder: any | null = null;

  constructor(
    private authService: AuthService,
    private service: AllmyservicesService
  ) {}

  ngOnInit(): void {
    this.initUser();
    if (!this.currentUser) return;

    this.fetchCommandes(this.currentUser.iduser);
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
      console.log('currentUser défini dans AuthService :', this.currentUser);
    } else if (storedUsername && storedIduser) {
      this.currentUser = {
        iduser: parseInt(storedIduser, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
      console.log('currentUser défini depuis localStorage :', this.currentUser);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('Aucun username ou iduser trouvé dans localStorage.');
    }
  }

  private fetchCommandes(iduser: number): void {
    this.service.AllcmdByIdUser(iduser.toString()).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.errorMessage = null;
        console.log(`Commandes récupérées pour iduser ${iduser} :`, commandes);
        console.log('Détails des commandes :', JSON.stringify(commandes, null, 2));
      },
      error: (err) => {
        console.error('Erreur récupération commandes :', err);
        this.errorMessage = `Erreur lors du chargement des commandes pour l'utilisateur ${this.currentUser?.username}.`;
      }
    });
  }

  getOrderDetails(id: string): void {
    console.log('Bouton Details cliqué pour commande ID :', id);
    this.errorMessage = null;
    this.selectedOrder = null;
    this.service.Detailsdeorder(id).subscribe({
      next: (result) => {
        console.log('Réponse de l\'API Detailsdeorder :', JSON.stringify(result, null, 2));
        if (result) {
          this.selectedOrder = result;
          console.log('selectedOrder défini :', JSON.stringify(this.selectedOrder, null, 2));
          const modalElement = document.getElementById('orderDetailsModal');
          if (modalElement) {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap && bootstrap.Modal) {
              const modal = new bootstrap.Modal(modalElement, { backdrop: true });
              modal.show();
            } else {
              console.error('Bootstrap Modal non disponible');
              Swal.fire('Erreur', 'Problème avec l\'initialisation de la modale', 'error');
            }
          } else {
            console.error('Élément de la modale non trouvé');
            Swal.fire('Erreur', 'Modale non trouvée dans le DOM', 'error');
          }
        } else {
          console.warn('Aucune donnée renvoyée par l\'API pour ID :', id);
          this.errorMessage = 'Aucune commande trouvée avec cet ID';
          Swal.fire('Erreur', 'Aucune commande trouvée avec cet ID', 'error');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails de la commande :', err);
        this.errorMessage = `Une erreur est survenue : ${err.message || 'Veuillez réessayer'}`;
        Swal.fire('Erreur', this.errorMessage, 'error');
      },
      complete: () => {
        console.log('Appel API Detailsdeorder terminé');
      }
    });
  }

  // Gestionnaire d'erreur pour l'image
  onImageError(event: Event): void {
    console.warn('Erreur de chargement de l\'image, utilisation de l\'image par défaut');
    (event.target as HTMLImageElement).src = 'assets/images/default-user.png';
  }
}*/

import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PageClientComponent implements OnInit {
  commandes: any[] = [];
  errorMessage: string | null = null;
  currentUser: { iduser: number; username: string } | null = null;
  selectedOrder: any | null = null;

  constructor(
    private authService: AuthService,
    private service: AllmyservicesService
  ) {}

  ngOnInit(): void {
    this.initUser();
    if (!this.currentUser) return;

    this.fetchCommandes(this.currentUser.iduser);
  }

  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');

    if (this.authService.currentUser) {
      this.currentUser = this.authService.currentUser;
      console.log('currentUser défini dans AuthService :', this.currentUser);
    } else if (storedUsername && storedIduser) {
      this.currentUser = {
        iduser: parseInt(storedIduser, 10),
        username: storedUsername
      };
      this.authService.currentUser = this.currentUser;
      console.log('currentUser défini depuis localStorage :', this.currentUser);
    } else {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous reconnecter.';
      console.warn('Aucun username ou iduser trouvé dans localStorage.');
    }
  }

  private fetchCommandes(iduser: number): void {
    this.service.AllcmdByIdUser(iduser.toString()).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.errorMessage = null;
        console.log(`Commandes récupérées pour iduser ${iduser} :`, commandes);
        console.log('Détails des commandes :', JSON.stringify(commandes, null, 2));
      },
      error: (err) => {
        console.error('Erreur récupération commandes :', err);
        this.errorMessage = `Erreur lors du chargement des commandes pour l'utilisateur ${this.currentUser?.username}.`;
      }
    });
  }

  getOrderDetails(id: string): void {
    console.log('Bouton Details cliqué pour commande ID :', id);
    this.errorMessage = null;
    this.selectedOrder = null; // Réinitialiser pour éviter les données résiduelles
    this.service.Detailsdeorder(id).subscribe({
      next: (result) => {
        console.log('Réponse de l\'API Detailsdeorder :', JSON.stringify(result, null, 2));
        if (result) {
          this.selectedOrder = result;
          console.log('selectedOrder défini :', JSON.stringify(this.selectedOrder, null, 2));
          // Ouvrir la modale manuellement
          const modalElement = document.getElementById('orderDetailsModal');
          if (modalElement) {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap && bootstrap.Modal) {
              const modal = new bootstrap.Modal(modalElement, { backdrop: true });
              modal.show();
            } else {
              console.error('Bootstrap Modal non disponible');
              Swal.fire('Erreur', 'Problème avec l\'initialisation de la modale', 'error');
            }
          } else {
            console.error('Élément de la modale non trouvé');
            Swal.fire('Erreur', 'Modale non trouvée dans le DOM', 'error');
          }
        } else {
          console.warn('Aucune donnée renvoyée par l\'API pour ID :', id);
          this.errorMessage = 'Aucune commande trouvée avec cet ID';
          Swal.fire('Erreur', 'Aucune commande trouvée avec cet ID', 'error');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails de la commande :', err);
        this.errorMessage = `Une erreur est survenue : ${err.message || 'Veuillez réessayer'}`;
        Swal.fire('Erreur', this.errorMessage, 'error');
      },
      complete: () => {
        console.log('Appel API Detailsdeorder terminé');
      }
    });
  }
}