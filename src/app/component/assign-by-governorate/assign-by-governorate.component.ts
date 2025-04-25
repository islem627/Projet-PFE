/*import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-assign-by-governorate',
  templateUrl: './assign-by-governorate.component.html',
  styleUrls: ['./assign-by-governorate.component.css']
})
export class AssignByGovernorateComponent implements OnInit {
  selectedGovernorate: string = '';
  governorates: string[] = [];
  orders: any[] = [];
  filteredOrders: any[] = [];
  deliveryPersons: any[] = [];
  filteredDeliveryPersons: any[] = [];
  isLoading: boolean = false;

  constructor(private service: AllmyservicesService) {}

  ngOnInit(): void {
    this.loadGovernorates();
    this.loadOrders();
    this.loadDeliveryPersons();
  }

  loadGovernorates(): void {
    this.isLoading = true;
    this.service.getGovernorates().subscribe({
      next: (governorates) => {
        this.governorates = governorates;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading governorates:', err);
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.service.AllOrders().subscribe({
      next: (result) => {
        this.orders = result as any[] || [];
        this.filterByGovernorate(); // apply filter if already selected
      },
      error: (error) => {
        console.error("Error loading orders", error);
      }
    });
  }

  loadDeliveryPersons(): void {
    this.service.getLivreurs().subscribe({
      next: (result) => {
        this.deliveryPersons = result || [];
        this.filterByGovernorate(); // apply filter if already selected
      },
      error: (error) => {
        console.error("Error loading delivery persons", error);
      }
    });
  }

  filterByGovernorate(): void {
    if (this.selectedGovernorate) {
      const gov = this.selectedGovernorate.trim().toLowerCase();

      this.filteredOrders = this.orders.filter(order =>
        order.gouvernoratCmd?.trim().toLowerCase() === gov
      );

      this.filteredDeliveryPersons = this.deliveryPersons.filter(
        livreur =>
          livreur.gouvernorat?.trim().toLowerCase() === this.selectedGovernorate.trim().toLowerCase()
      );
      
      
    } else {
      this.filteredOrders = [...this.orders];
      this.filteredDeliveryPersons = [...this.deliveryPersons];
    }

    console.log("Selected Governorate:", this.selectedGovernorate);
    console.log("Filtered Orders:", this.filteredOrders);
    console.log("Filtered Delivery Persons:", this.filteredDeliveryPersons);
  }

  assignOrder(order: any, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const deliveryPersonId = Number(selectElement.value);
    if (deliveryPersonId) {
      this.service.assignOrder(order.id_commande, deliveryPersonId).subscribe({
        next: () => {
          console.log(`Order ${order.id_commande} assigned`);
          this.loadOrders();
          setTimeout(() => {
            this.filterByGovernorate(); // 🔁 Appliquer le filtre après le rechargement
          }, 200); // Légère attente pour que loadOrders() ait terminé
        },
        error: (err) => {
          console.error(`Error during assignment:`, err);
        }
      });
    } else {
      console.warn('No delivery person selected for order', order.id_commande);
    }
  }
  
}
*/
import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-assign-by-governorate',
  templateUrl: './assign-by-governorate.component.html',
  styleUrls: ['./assign-by-governorate.component.css']
})
export class AssignByGovernorateComponent implements OnInit {
  selectedGovernorate: string = '';
  governorates: string[] = [];
  orders: any[] = [];
  filteredOrders: any[] = [];
  deliveryPersons: any[] = [];
  filteredDeliveryPersons: any[] = [];
  isLoading: boolean = false;

  constructor(private service: AllmyservicesService) {}

  ngOnInit(): void {
    this.loadGovernorates();
    this.loadOrders();
    this.loadDeliveryPersons();
    console.log(this.filteredDeliveryPersons); 
 // Vérifie si les données sont bien présentes

  }
  today: Date = new Date();

  loadGovernorates(): void {
    this.isLoading = true;
    this.service.getGovernorates().subscribe({
      next: (governorates) => {
        this.governorates = governorates;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading governorates:', err);
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.service.AllOrders().subscribe({
      next: (result) => {
        this.orders = result as any[] || [];
        this.filterByGovernorate(); // apply filter if already selected
      },
      error: (error) => {
        console.error("Error loading orders", error);
      }
    });
  }

  loadDeliveryPersons(): void {
    this.service.getLivreurs().subscribe({
      next: (result) => {
        this.deliveryPersons = result || [];
        this.filterByGovernorate(); // apply filter if already selected
      },
      error: (error) => {
        console.error("Error loading delivery persons", error);
      }
    });
  }

  filterByGovernorate(): void {
    if (this.selectedGovernorate) {
      const gov = this.selectedGovernorate.trim().toLowerCase();

      this.filteredOrders = this.orders.filter(order =>
        order.gouvernoratCmd?.trim().toLowerCase() === gov
      );

      this.filteredDeliveryPersons = this.deliveryPersons.filter(
        livreur =>
          livreur.gouvernorat?.trim().toLowerCase() === this.selectedGovernorate.trim().toLowerCase()
      );
    } else {
      this.filteredOrders = [...this.orders];
      this.filteredDeliveryPersons = [...this.deliveryPersons];
    }

    console.log("Selected Governorate:", this.selectedGovernorate);
    console.log("Filtered Orders:", this.filteredOrders);
    console.log("Filtered Delivery Persons:", this.filteredDeliveryPersons);
  }

  assignOrder(orderId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;  // Récupérer la valeur sélectionnée
    
    if (selectedValue) {
      const personId = Number(selectedValue);  // S'assurer que la valeur est un nombre
      this.service.assignOrder(orderId, personId).subscribe({
        next: () => {
          alert(`Commande ${orderId} assignée avec succès`);
          this.loadOrders();  // Recharger les commandes après l'assignation
          setTimeout(() => this.filterByGovernorate(), 200);  // Filtrage par gouvernorat
        },
        error: (err) => {
          console.error('Erreur lors de l\'assignation:', err);
          alert('Une erreur est survenue lors de l\'assignation du livreur');
        }
      });
    } else {
      alert('Veuillez sélectionner un livreur.');
    }
  }
  
  
  
  
  
  
  
  
  
}
