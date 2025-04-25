import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

interface Destination {
  id: number;
  address: string;
  city: string;
  lat: number;
  lng: number;
  deliveryFee: number;
  deliveryTime: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private destinationMarkers: L.Marker[] = [];

  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];

  tunisianCities = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa'];

  currentDestination: Destination | null = null;
  isFormOpen = false;
  isEditMode = false;
  searchTerm = '';

  destinationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AllmyservicesService
  ) {
    this.destinationForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(3)]],
      city: ['Tunis', Validators.required],
      lat: [36.8065, [Validators.required]],
      lng: [10.1815, [Validators.required]],
      deliveryFee: [10, [Validators.required, Validators.min(0)]],
      deliveryTime: ['2-3 days', Validators.required],
      status: ['Active']
    });
  }



  ngOnInit(): void {
    this.loadDestinationsFromBackend();
  }



  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('destinationMap').setView([34.0, 9.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (!this.isFormOpen) {
        this.openAddForm(); // Open the form if not already open
        this.destinationForm.patchValue({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    });
  }

  private getMarkerIcon(status: 'Active' | 'Inactive'): L.Icon {
    return L.icon({
      iconUrl: `assets/images/marker/marker-icon-${status === 'Active' ? 'green' : 'red'}.png`,
      shadowUrl: 'assets/images/marker/marker-shadow.png',
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  }
  private plotDestinations(): void {
    if (!this.map) return;
    this.destinationMarkers.forEach(marker => marker.remove());
    this.destinationMarkers = [];
    this.filteredDestinations.forEach(dest => {
      const marker = L.marker([dest.lat, dest.lng], {
        icon: this.getMarkerIcon(dest.status)
      }).addTo(this.map)
      .bindPopup(
        `<b>${dest.address}</b><br>
         <small>${dest.city}</small><br>
         Fee: ${dest.deliveryFee} TND<br>
         Time: ${dest.deliveryTime}`
      );
      this.destinationMarkers.push(marker);
    });
    if (this.destinationMarkers.length > 0) {
      const group = new L.FeatureGroup(this.destinationMarkers);
      this.map.fitBounds(group.getBounds().pad(0.5));
    }
  }

  private loadDestinationsFromBackend(): void {
    this.service.AllOrderss().subscribe((data: any[]) => {
      this.destinations = data.map(cmd => ({
        id: cmd.id_commande,
        address: cmd.adresse_livraison || `Commande #${cmd.id_commande}`,
        city: cmd.adresse_livraison || 'Tunis',
        lat: cmd.latitude || 0,
        lng: cmd.longitude || 0,
        deliveryFee: cmd.total || 0,
        deliveryTime: '2-3 days',
        status: cmd.statut_commande === 'Paid' ? 'Active' : 'Inactive'
      }));
      this.filteredDestinations = [...this.destinations];
      this.plotDestinations();
    });
  }

  openAddForm(): void {
    this.isFormOpen = true;
    this.isEditMode = false;
    this.currentDestination = null;
    this.destinationForm.reset({
      lat: 36.8065,
      lng: 10.1815,
      city: 'Tunis',
      deliveryFee: 10,
      deliveryTime: '2-3 days',
      status: 'Active'
    });
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.destinationForm.reset();
  }

  openEditForm(destination: Destination): void {
    this.isFormOpen = true;
    this.isEditMode = true;
    this.currentDestination = destination;
    this.destinationForm.patchValue(destination);
    this.map.setView([destination.lat, destination.lng], 12);
  }

  deleteDestination(id: number): void {
    if (confirm('Are you sure you want to delete this destination?')) {
      this.destinations = this.destinations.filter(d => d.id !== id);
      this.filteredDestinations = [...this.destinations];
      this.plotDestinations(); // Re-plot markers after deletion
    }
  }

  handleSubmit(): void {
    if (this.destinationForm.invalid) return;
    const formData = this.destinationForm.value;

    if (this.isEditMode && this.currentDestination) {
      const index = this.destinations.findIndex(d => d.id === this.currentDestination!.id);
      this.destinations[index] = { ...this.currentDestination, ...formData };
    } else {
      const newId = this.destinations.length > 0
        ? Math.max(...this.destinations.map(d => d.id)) + 1
        : 1;
      this.destinations.push({ id: newId, ...formData });
    }

    this.filteredDestinations = [...this.destinations];
    this.closeForm();
  }

  filterDestinations(): void {
    if (this.searchTerm) {
      this.filteredDestinations = this.destinations.filter(dest =>
        dest.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        dest.city.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDestinations = [...this.destinations];
    }
    this.plotDestinations();
  }
}
