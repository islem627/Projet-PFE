
import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  selectedGovernorate: string = '';
  governorates: string[] = [];
  orders: any[] = [];
  unassignedOrders: any[] = [];
  assignedOrders: any[] = [];
  deliveryPersons: any[] = [];
  filteredDeliveryPersons: any[] = [];
  isLoading: boolean = false;
  today: Date = new Date();
  dateAffectionMap: { [key: number]: string } = {};

  constructor(
    private service: AllmyservicesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const storedMap = localStorage.getItem('dateAffectionMap');
    this.dateAffectionMap = storedMap ? JSON.parse(storedMap) : {};
    this.loadGovernorates();
    this.loadOrders();
    this.loadDeliveryPersons();
  }

  loadGovernorates(): void {
    this.service.getGovernorates().subscribe({
      next: (governorates) => {
        this.governorates = governorates;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading governorates:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to load governorates.'
        });
      }
    });
  }

loadOrders(): void {
  this.service.AllOrders().subscribe({
    next: (result) => {
      this.orders = (result as any[] || []).map(order => {
        console.log(`Order ${order.id_commande}:`, {
          id_commande: order.id_commande,
          iduser: order.iduser,
          userDTO: order.userDTO,
          gouvernoratCmd: order.gouvernoratCmd,
          statut_commande: order.statut_commande,
          livreurId: order.livreurId,
          date_affection: order.date_affection
        });
        if (!order.userDTO || !order.userDTO.username || !order.userDTO.phone) {
          console.warn(`⚠️ Missing or incomplete userDTO for order ${order.id_commande}:`, order.userDTO);
        }
        let dateAffection = null;
        if (order.date_affection) {
          try {
            dateAffection = new Date(order.date_affection);
            if (isNaN(dateAffection.getTime())) {
              console.warn(`Invalid date_affection for order ${order.id_commande}: ${order.date_affection}`);
              dateAffection = null;
            } else {
              dateAffection.setHours(dateAffection.getHours() - 1);
              console.log(`Adjusted date_affection for order ${order.id_commande}: ${dateAffection.toISOString()}`);
            }
          } catch (e) {
            console.error(`Error parsing date_affection for order ${order.id_commande}:`, e);
          }
        }
        return {
          ...order,
          dateAffection
        };
      });
      console.log('📋 All orders loaded:', this.orders);
      this.filterByGovernorate();
    },
    error: (error) => {
      console.error('❌ Error loading orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to load orders.'
      });
    }
  });
}

loadDeliveryPersons(): void {
  this.service.AllLivreur().subscribe({
    next: (result: any[]) => {
      console.log('📥 Raw response from AllLivreur:', result);
      this.deliveryPersons = result || [];
      console.log('👥 Delivery persons loaded:', this.deliveryPersons);

      const loadOrdersPromises = this.deliveryPersons.map(livreur => {
        console.log(`🔍 Fetching orders for livreur ID: ${livreur.id}, Gouvernorat: ${livreur.gouvernorat}`);
        return this.service.AllcmdByIdLivreur(livreur.id.toString()).toPromise().then(
          (commandes) => {
            console.log(`📦 Orders for delivery person ${livreur.id}:`, commandes);
            const orderCount = (commandes || []).filter(order => {
              const statut = order.statut_commande ? order.statut_commande.trim() : '';
              const isActive = statut === 'IN_TRANSIT';
              console.log(`Order ${order.id_commande}: statut="${statut}", isActive=${isActive}`);
              return isActive;
            }).length;
            console.log(`Delivery person ${livreur.id}: orderCount=${orderCount}`);
            return { ...livreur, orderCount };
          },
          (error) => {
            console.error(`❌ Error loading orders for delivery person ${livreur.id}:`, error);
            return { ...livreur, orderCount: 0 };
          }
        );
      });

      Promise.all(loadOrdersPromises).then((updatedDeliveryPersons) => {
        this.deliveryPersons = updatedDeliveryPersons;
        console.log('👥 Delivery persons updated with orderCount:', this.deliveryPersons);
        this.filterByGovernorate();
      });
    },
    error: (error) => {
      console.error('❌ Error in loadDeliveryPersons:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        error: error.error
      });
      this.deliveryPersons = [];
      this.filterByGovernorate();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to load delivery persons.'
      });
    }
  });
}

  filterByGovernorate(): void {
    let filteredOrders = this.orders;

    if (this.selectedGovernorate) {
      const gov = this.selectedGovernorate.trim().toLowerCase();
      filteredOrders = this.orders.filter(order => {
        const gouvernorat = order.gouvernoratCmd ? order.gouvernoratCmd.trim().toLowerCase() : '';
        return gouvernorat === gov;
      });
      console.log('📍 Orders filtered by governorate:', filteredOrders);
    }

    this.unassignedOrders = filteredOrders
      .filter(order => {
        const isUnassigned = order.livreurId == null;
        const statut = order.statut_commande ? order.statut_commande.trim() : '';
        const isPending = statut === 'PENDING';
        console.log(`🔎 Order ${order.id_commande}: livreurId=${order.livreurId}, statut="${statut}", isUnassigned=${isUnassigned}, isPending=${isPending}`);
        return isUnassigned && isPending;
      })
      .map(order => ({ ...order, dateAffection: null }));
    console.log('🚚 Unassigned orders (PENDING):', this.unassignedOrders);

    this.assignedOrders = filteredOrders
      .filter(order => {
        const isAssigned = order.livreurId != null;
        console.log(`🔎 Order ${order.id_commande}: livreurId=${order.livreurId}, isAssigned=${isAssigned}`);
        return isAssigned;
      })
      .map(order => ({ ...order, dateAffection: order.dateAffection || null }));
    console.log('✅ Assigned orders:', this.assignedOrders);

    if (this.selectedGovernorate) {
      const gov = this.selectedGovernorate.trim().toLowerCase();
      this.filteredDeliveryPersons = this.deliveryPersons
        .filter(livreur => {
          const gouvernorat = livreur.gouvernorat ? livreur.gouvernorat.trim().toLowerCase() : '';
          return gouvernorat === gov;
        })
        .filter(livreur => livreur.orderCount < 8);
    } else {
      this.filteredDeliveryPersons = this.deliveryPersons.filter(livreur => livreur.orderCount < 8);
    }
    console.log('👷 Filtered delivery persons (< 8 orders):', this.filteredDeliveryPersons);
  }

assignOrder(orderId: number, event: Event): void {
  const target = event.target as HTMLSelectElement;
  const livreurId = Number(target.value);

  if (livreurId === 0) {
    Swal.fire('Error', 'Please select a valid delivery person.', 'error');
    return;
  }

  const date = new Date();
  const tunisOffset = 1 * 60; // UTC+1 in minutes
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const tunisDate = new Date(utcDate.getTime() + (tunisOffset * 60000));

  const year = tunisDate.getFullYear();
  const month = String(tunisDate.getMonth() + 1).padStart(2, '0');
  const day = String(tunisDate.getDate()).padStart(2, '0');
  const hours = String(tunisDate.getHours()).padStart(2, '0');
  const minutes = String(tunisDate.getMinutes()).padStart(2, '0');
  const seconds = String(tunisDate.getSeconds()).padStart(2, '0');
  const dateAffection = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+01:00`;
  console.log(`Date d'affectation envoyée : ${dateAffection}`);

  if (!dateAffection.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/)) {
    Swal.fire('Error', 'Invalid date format generated.', 'error');
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  });

  const params = new HttpParams().set('date_affection', dateAffection);

  const url = `http://localhost:8764/Commande/assignLivreur/${orderId}/${livreurId}`;
  this.http.put(url, null, { headers, params }).subscribe({
    next: (response) => {
      console.log('✅ Commande assignée:', response);
      Swal.fire('Success', 'Order assigned successfully.', 'success');

      // Increment orderCount for the assigned delivery person
      const livreurIndex = this.deliveryPersons.findIndex(p => p.id === livreurId);
      if (livreurIndex !== -1) {
        this.deliveryPersons[livreurIndex].orderCount = (this.deliveryPersons[livreurIndex].orderCount || 0) + 1;
        console.log(`📈 Incremented orderCount for livreur ${livreurId}:`, this.deliveryPersons[livreurIndex].orderCount);
      }

      // Refresh orders and filtered delivery persons
      this.loadOrders();
      this.filterByGovernorate();
    },
    error: (err) => {
      console.error('❌ Erreur d\'assignation:', {
        status: err.status,
        statusText: err.statusText,
        url: err.url,
        message: err.message,
        error: err.error
      });
      Swal.fire('Error', 'Failed to assign order.', 'error');
    }
  });
}

  getLivreurUsername(livreurId: number): string {
    const livreur = this.deliveryPersons.find(p => p.id === livreurId);
    return livreur ? livreur.username : 'Unknown';
  }
}