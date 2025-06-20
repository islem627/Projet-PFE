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
  archivedCommandes: any[] = [];
  allCommandes: any[] = [];
  errorMessage: string | null = null;
  currentUser: { iduser: number; username: string } | null = null;
  selectedOrder: any | null = null;
  showAllOrders: boolean = false;
LivreuId : string ;
  user: any = {};  
  constructor(
    private authService: AuthService,
    private service: AllmyservicesService
  ) {}

  ngOnInit(): void {
    this.initUser();
    if (!this.currentUser) return;

    this.fetchCommandes(this.currentUser.iduser);
    this.fetchArchivedOrders(this.currentUser.iduser);
  }

    getLivreurDetails(id: string) {
    this.service.DetailsUser(id).subscribe(
      (result) => {
        this.user = result;  // Stockage des détails du user
        console.log('Détails du user:', this.user);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du user:', error);
      }
    );
  }
  private initUser(): void {
    const storedUsername = localStorage.getItem('username');
    const storedIduser = localStorage.getItem('iduser');
    const LivreuId = localStorage.getItem('livreurId');

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
    this.service.getActiveCommandes(iduser.toString()).subscribe({
      next: (commandes) => {
        this.commandes = commandes || [];
        this.updateAllCommandes();
        this.errorMessage = null;
        console.log(`Commandes actives récupérées pour iduser ${iduser} :`, this.commandes);
      },
      error: (err) => {
        console.error('Erreur récupération commandes actives :', err);
        this.errorMessage = `Erreur lors du chargement des commandes actives pour l'utilisateur ${this.currentUser?.username}.`;
      }
    });
  }

  private fetchArchivedOrders(iduser: number): void {
    this.service.getArchivedCommandes(iduser.toString()).subscribe({
      next: (commandes) => {
        this.archivedCommandes = commandes || [];
        this.updateAllCommandes();
        console.log(`Commandes archivées récup recovered pour iduser ${iduser} :`, this.archivedCommandes);
      },
      error: (err) => {
        console.error('Erreur récupération commandes archivées :', err);
        this.errorMessage = `Erreur lors du chargement des commandes archivées pour l'utilisateur ${this.currentUser?.username}.`;
      }
    });
  }

  private updateAllCommandes(): void {
    this.allCommandes = [
      ...this.commandes.map(cmd => ({ ...cmd, isArchived: false })),
      ...this.archivedCommandes.map(cmd => ({ ...cmd, isArchived: true }))
    ];
    console.log('All commandes:', this.allCommandes);
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
      }
    });
  }

  toggleAllOrders(): void {
    this.showAllOrders = !this.showAllOrders;
    console.log('Show all orders:', this.showAllOrders);
  }

  removeCommande(order: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette commande sera archivée.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, archiver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.archiveCommande(order.id_commande.toString()).subscribe({
          next: () => {
            this.commandes = this.commandes.filter(cmd => cmd.id_commande !== order.id_commande);
            this.archivedCommandes.push({ ...order, isArchived: true });
            this.updateAllCommandes();
            Swal.fire('Archivé!', 'La commande a été archivée.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de l\'archivage de la commande :', err);
            Swal.fire('Erreur', 'Échec de l\'archivage de la commande.', 'error');
          }
        });
      }
    });
  }

  unarchiveOrder(order: any): void {
    Swal.fire({
      title: 'Restaurer la commande ?',
      text: 'Cette commande sera restaurée dans la liste des commandes actives.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, restaurer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.unarchiveCommande(order.id_commande.toString()).subscribe({
          next: () => {
            this.archivedCommandes = this.archivedCommandes.filter((archived) => archived.id_commande !== order.id_commande);
            this.commandes.push({ ...order, isArchived: false });
            this.updateAllCommandes();
            Swal.fire('Restauré!', `La commande ${order.id_commande} a été restaurée.`, 'success');
          },
          error: (err) => {
            console.error('Erreur lors du désarchivage de la commande :', err);
            Swal.fire('Erreur', 'Échec du désarchivage de la commande.', 'error');
          }
        });
      }
    });
  }

  evaluateOrder(id: string, noteClient: number, commentaireClient: string): void {
    if (!this.currentUser) {
      Swal.fire('Erreur', 'Utilisateur non connecté', 'error');
      return;
    }

    const userId = this.currentUser.iduser;
    console.log('Évaluation envoyée:', { id_commande: id, noteClient, commentaireClient, userId });

    this.service.evaluateCommande(id, noteClient, commentaireClient, userId).subscribe({
      next: (commande) => {
        console.log('Évaluation réussie, réponse:', commande);
        const index = this.commandes.findIndex((cmd) => cmd.id_commande.toString() === id.toString());
        if (index !== -1) {
          this.commandes[index] = commande;
          this.commandes = [...this.commandes];
          Swal.fire('Succès', 'Votre évaluation a été soumise avec succès', 'success');
        } else {
          const archivedIndex = this.archivedCommandes.findIndex((cmd) => cmd.id_commande.toString() === id.toString());
          if (archivedIndex !== -1) {
            this.archivedCommandes[archivedIndex] = commande;
            this.archivedCommandes = [...this.archivedCommandes];
            Swal.fire('Succès', 'Votre évaluation a été soumise avec succès', 'success');
          } else {
            console.warn('Commande non trouvée dans la liste pour id:', id);
            Swal.fire('Succès', 'Votre évaluation a été soumise avec succès, mais la liste locale n\'a pas été mise à jour.', 'success');
            this.fetchCommandes(this.currentUser!.iduser);
            this.fetchArchivedOrders(this.currentUser!.iduser);
          }
        }
        this.updateAllCommandes();
      },
      error: (err) => {
        console.error('Erreur lors de l\'évaluation de la commande :', err);
        const errorMsg = err.error?.message || 'Échec de l\'évaluation. Veuillez réessayer.';
        Swal.fire('Erreur', errorMsg, 'error');
      }
    });
  }

  openEvaluateModal(order: any): void {
    Swal.fire({
      title: 'Noter la commande',
      html: `
        <style>
          .rating-stars {
            display: flex;
            justify-content: center;
            gap: 12px;
            font-size: 2.5rem;
            margin: 1.5rem 0;
          }
          .rating-stars i {
            color: #e0e0e0;
            cursor: pointer;
            transition: transform 0.3s ease, color 0.3s ease;
          }
          .rating-stars i.selected {
            color: #ffc107;
            text-shadow: 0 0 8px rgba(255, 193, 7, 0.5);
          }
          .rating-stars i:hover {
            transform: scale(1.3);
            color: #ffca28;
          }
          .textarea-container {
            display: flex;
            justify-content: center;
            margin: 1rem 0;
          }
          .swal2-textarea {
            width: 80%;
            max-width: 300px;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
            padding: 12px;
            font-size: 1rem;
            box-sizing: border-box;
            transition: border-color 0.3s ease;
            resize: none;
          }
          .swal2-textarea:focus {
            border-color: #2196f3;
            outline: none;
            box-shadow: 0 0 8px rgba(33, 150, 243, 0.3);
          }
          .swal2-title {
            font-size: 1.5rem;
            color: #333;
            font-weight: 600;
          }
          .swal2-html-container {
            padding: 1rem 2rem !important;
            overflow: visible !important;
          }
        </style>
        <div class="rating-stars" id="star-container">
          <i class="fa fa-star" data-value="1"></i>
          <i class="fa fa-star" data-value="2"></i>
          <i class="fa fa-star" data-value="3"></i>
          <i class="fa fa-star" data-value="4"></i>
          <i class="fa fa-star" data-value="5"></i>
        </div>
        <div class="textarea-container">
          <textarea id="commentaire" class="swal2-textarea" placeholder="Laissez un commentaire (facultatif)..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#2196f3',
      cancelButtonColor: '#d33',
      customClass: {
        popup: 'swal2-custom-popup',
        confirmButton: 'swal2-custom-button',
        cancelButton: 'swal2-custom-button'
      },
      didOpen: () => {
        const stars = Array.from(document.querySelectorAll('#star-container i'));
        let selectedRating = 0;

        stars.forEach((star, index) => {
          star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach((s, i) => {
              s.classList.toggle('selected', i < selectedRating);
            });
          });
        });

        // Force buttons to be visible
        const confirmButton = document.querySelector('.swal2-confirm');
        const cancelButton = document.querySelector('.swal2-cancel');
        if (confirmButton) {
          confirmButton.setAttribute('style', 'display: inline-block !important; visibility: visible !important;');
        }
        if (cancelButton) {
          cancelButton.setAttribute('style', 'display: inline-block !important; visibility: visible !important;');
        }

        // Trigger a redraw
        setTimeout(() => {
          const actions = document.querySelector('.swal2-actions');
          if (actions) {
            actions.classList.add('swal2-actions-visible');
          }
        }, 0);
      },
      preConfirm: () => {
        const stars = Array.from(document.querySelectorAll('#star-container i'));
        const selectedRating = stars.filter(s => s.classList.contains('selected')).length;
        const commentaire = (document.getElementById('commentaire') as HTMLTextAreaElement)?.value?.trim() || '';

        if (!selectedRating) {
          Swal.showValidationMessage('Merci de donner une note.');
          return false;
        }
        return { noteClient: selectedRating, commentaireClient: commentaire };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Modal soumis:', result.value);
        const { noteClient, commentaireClient } = result.value;
        this.evaluateOrder(order.id_commande.toString(), noteClient, commentaireClient);
      }
    });
  }
}