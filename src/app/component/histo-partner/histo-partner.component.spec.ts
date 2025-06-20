import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

interface UserDTO {
  username: string;
  phone: string;
}

interface Commande {
  id_commande: string;
  iduser: string;
  userDTO: UserDTO;
  gouvernoratCmd: string;
  livreurId: string | null;
  idpartenaire: string | null; // Ajout de idpartenaire
  date_ajoutsystem: string | null;
  date_livree: string | null;
  statut_commande: string | null;
  noteClient: number | null;
}

interface DeliveryPerson {
  id: number;
  username: string;
  phone: string;
  gouvernorat: string;
}

@Component({
  selector: 'app-histo-partner',
  templateUrl: './histo-partner.component.html',
  styleUrls: ['./histo-partner.component.css']
})
export class HistoPartnerComponent implements OnInit {
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
  isLoading: boolean = false;
  today: Date = new Date();
  sortBy: 'date_livree' | 'noteClient' | 'date_ajoutsystem' = 'date_livree';
  sortDirection: 'asc' | 'desc' = 'desc';
  idpartenaire: string | null = null;

  constructor(private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer idpartenaire depuis localStorage
    this.idpartenaire = localStorage.getItem('idpartenaire');
    console.log('Partenaire ID:', this.idpartenaire);
    
    if (!this.idpartenaire) {
      console.error('Aucun idpartenaire trouvé dans localStorage');
      alert('Erreur : Veuillez vous connecter en tant que partenaire.');
      return;
    }

    this.loadGovernorates();
    this.loadOrders();
    this.loadDeliveryPersons();
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
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    if (this.idpartenaire) {
      this.service.getOrdersByPartenaire(this.idpartenaire).subscribe({
        next: (result) => {
          const orders = result as Commande[] || [];
          console.log('Raw orders from API for partenaire:', orders);
          
          this.deliveredOrders = orders.filter(order => 
            order.statut_commande?.trim().toUpperCase() === 'DELIVERED'
          );
          this.cancelledOrders = orders.filter(order => 
            order.statut_commande?.trim().toUpperCase() === 'CANCELLED'
          );
          
          console.log('Delivered orders:', this.deliveredOrders);
          console.log('Cancelled orders:', this.cancelledOrders);
          
          this.filterDeliveredOrders();
          this.filterCancelledOrders();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders for partenaire:', error);
          alert('Erreur lors du chargement des commandes.');
          this.isLoading = false;
        }
      });
    } else {
      console.error('No partenaire ID available');
      this.isLoading = false;
    }
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
      if (this.sortBy === 'date_livree') {
        const dateA = a.date_livree ? new Date(a.date_livree).getTime() : 0;
        const dateB = b.date_livree ? new Date(b.date_livree).getTime() : 0;
        return this.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (this.sortBy === 'noteClient') {
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

  assignOrder(orderId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    
    if (selectedValue) {
      const personId = Number(selectedValue);
      this.service.assignOrder(Number(orderId), personId).subscribe({
        next: () => {
          alert(`Order ${orderId} assigned successfully`);
          this.loadOrders();
          setTimeout(() => {
            this.filterDeliveredOrders();
            this.filterCancelledOrders();
          }, 200);
        },
        error: (err) => {
          console.error('Error assigning order:', err);
          alert('An error occurred while assigning the delivery person');
        }
      });
    } else {
      alert('Please select a delivery person.');
    }
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
  }
}