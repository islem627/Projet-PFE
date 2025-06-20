import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

interface DeliveryPerson {
  id: number;
  username: string;
  phone: string;
  gouvernorat: string;
}

@Component({
  selector: 'app-histo-partner',
  templateUrl: './histo-partner.component.html',
  styleUrls: ['./histo-partner.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HistoPartnerComponent implements OnInit, OnDestroy {
  deliveredOrders: Commande[] = [];
  cancelledOrders: Commande[] = [];
  filteredDeliveredOrders: Commande[] = [];
  filteredCancelledOrders: Commande[] = [];
  deliveryPersons: DeliveryPerson[] = [];
  filteredDeliveryPersons: DeliveryPerson[] = [];
  governorates: string[] = [];
  deliveryGovernorateFilter: string = '';
  deliveryDateFilter: string = '';
  cancelledGovernorateFilter: string = '';
  cancelledDateFilter: string = '';
  ratingFilter: number | null = null;
  isLoading: boolean = true;
  notificationMessage: string = '';
  showNotification: boolean = false;
  partnerId: string = '';
  today: Date = new Date();
  sortBy: 'date_livree' | 'noteClient' | 'date_ajoutsystem' = 'date_livree';
  sortDirection: 'asc' | 'desc' = 'desc';
  private subscription: Subscription | null = null;

  constructor(
    private service: AllmyservicesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token');
    console.log('Current user:', user);
    console.log('User ID:', user?.iduser);
    console.log('User role:', user?.role);
    console.log('LocalStorage role:', storedRole);
    console.log('LocalStorage token:', storedToken ? 'Present' : 'Absent');
    
    // Vérifier si l'utilisateur est connecté et a un rôle de partenaire
    const isPartner = user?.role?.toLowerCase().includes('partner') || 
                     (storedRole && storedRole.toLowerCase().includes('partner'));
    
    if (user && user.iduser && isPartner) {
      this.partnerId = user.iduser.toString();
      console.log('Partner ID:', this.partnerId);
      this.loadGovernorates();
      this.fetchOrdersByPartenaire(this.partnerId);
      this.loadDeliveryPersons();
    } else {
      console.log('Condition failed:', {
        hasUser: !!user,
        hasIduser: !!user?.iduser,
        isPartner: isPartner
      });
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Aucun partenaire connecté ou rôle incorrect. Veuillez vous reconnecter.',
      }).then(() => {
        this.router.navigate(['/']);
      });
    }
  }

  loadGovernorates(): void {
    this.isLoading = true;
    this.service.getGovernorates().subscribe({
      next: (governorates) => {
        this.governorates = governorates;
        console.log('Governorates loaded:', governorates);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading governorates:', err);
        this.toastr.error('Erreur lors du chargement des gouvernorats');
        this.isLoading = false;
      }
    });
  }

  private fetchOrdersByPartenaire(idpartenaire: string): void {
    this.isLoading = true;
    console.log('Fetching orders for partnerId:', idpartenaire);
    this.service.getOrdersByPartenaire(idpartenaire).subscribe({
      next: (orders) => {
        this.deliveredOrders = orders.filter(o => o.statut_commande?.trim().toUpperCase() === 'DELIVERED') || [];
        this.cancelledOrders = orders.filter(o => o.statut_commande?.trim().toUpperCase() === 'CANCELLED') || [];
        this.filterDeliveredOrders();
        this.filterCancelledOrders();
        if (this.deliveredOrders.length === 0 && this.cancelledOrders.length === 0) {
          this.toastr.info('Aucune commande trouvée pour ce partenaire');
        }
        console.log('Delivered orders:', this.deliveredOrders);
        console.log('Cancelled orders:', this.cancelledOrders);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.toastr.error('Erreur lors du chargement des commandes');
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les commandes.',
        });
        this.isLoading = false;
      }
    });
  }

  loadDeliveryPersons(): void {
    this.service.getLivreurs().subscribe({
      next: (result) => {
        this.deliveryPersons = result || [];
        console.log('Delivery persons loaded:', this.deliveryPersons);
        this.filterDeliveryPersons();
      },
      error: (error) => {
        console.error('Error loading delivery persons:', error);
        this.toastr.error('Erreur lors du chargement des livreurs');
      }
    });
  }

  filterDeliveredOrders(): void {
    let filtered = [...this.deliveredOrders];

    if (this.deliveryGovernorateFilter) {
      const gov = this.deliveryGovernorateFilter.trim().toLowerCase();
      filtered = filtered.filter(order => 
        order.gouvernoratCmd?.trim().toLowerCase() === gov
      );
    }

    if (this.deliveryDateFilter) {
      const filterDate = new Date(this.deliveryDateFilter).toISOString().split('T')[0];
      filtered = filtered.filter(order => 
        order.date_ajoutsystem && 
        new Date(order.date_ajoutsystem).toISOString().split('T')[0] === filterDate
      );
    }

    if (this.ratingFilter !== null) {
      filtered = filtered.filter(order => 
        order.noteClient === this.ratingFilter
      );
    }

    filtered.sort((a, b) => {
      const sortBy = this.sortBy || 'date_livree';
      if (sortBy === 'date_livree') {
        const dateA = a.date_livree ? new Date(a.date_livree).getTime() : 0;
        const dateB = b.date_livree ? new Date(b.date_livree).getTime() : 0;
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortBy === 'noteClient') {
        const ratingA = a.noteClient || 0;
        const ratingB = b.noteClient || 0;
        return this.sortDirection === 'desc' ? ratingB - ratingA : ratingA - ratingB;
      } else {
        const dateA = a.date_ajoutsystem ? new Date(a.date_ajoutsystem).getTime() : 0;
        const dateB = b.date_ajoutsystem ? new Date(b.date_ajoutsystem).getTime() : 0;
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      }
    });

    this.filteredDeliveredOrders = filtered;
    console.log('Filtered delivered orders:', this.filteredDeliveredOrders);
    this.filterDeliveryPersons();
  }

  filterCancelledOrders(): void {
    let filtered = [...this.cancelledOrders];

    if (this.cancelledGovernorateFilter) {
      const gov = this.cancelledGovernorateFilter.trim().toLowerCase();
      filtered = filtered.filter(order => 
        order.gouvernoratCmd?.trim().toLowerCase() === gov
      );
    }

    if (this.cancelledDateFilter) {
      const filterDate = new Date(this.cancelledDateFilter).toISOString().split('T')[0];
      filtered = filtered.filter(order => 
        order.date_ajoutsystem && 
        new Date(order.date_ajoutsystem).toISOString().split('T')[0] === filterDate
      );
    }

    filtered.sort((a, b) => {
      const sortBy = this.sortBy || 'date_livree';
      if (sortBy === 'date_livree') {
        const dateA = a.date_livree ? new Date(a.date_livree).getTime() : 0;
        const dateB = b.date_livree ? new Date(b.date_livree).getTime() : 0;
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        const dateA = a.date_ajoutsystem ? new Date(a.date_ajoutsystem).getTime() : 0;
        const dateB = b.date_ajoutsystem ? new Date(b.date_ajoutsystem).getTime() : 0;
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      }
    });

    this.filteredCancelledOrders = filtered;
    console.log('Filtered cancelled orders:', this.filteredCancelledOrders);
    this.filterDeliveryPersons();
  }

  filterDeliveryPersons(): void {
    const selectedGov = (this.deliveryGovernorateFilter || this.cancelledGovernorateFilter)?.trim().toLowerCase();
    if (selectedGov) {
      this.filteredDeliveryPersons = this.deliveryPersons.filter(
        livreur => livreur.gouvernorat?.trim().toLowerCase() === selectedGov
      );
    } else {
      this.filteredDeliveryPersons = [...this.deliveryPersons];
    }
    console.log('Filtered delivery persons:', this.filteredDeliveryPersons);
  }

  setRatingFilter(rating: number): void {
    this.ratingFilter = this.ratingFilter === rating ? null : rating;
    this.filterDeliveredOrders();
  }

  toggleSort(field: 'date_livree' | 'noteClient' | 'date_ajoutsystem'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'desc';
    }
    this.filterDeliveredOrders();
    this.filterCancelledOrders();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}