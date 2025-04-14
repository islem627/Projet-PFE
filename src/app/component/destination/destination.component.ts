import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

interface Destination {
  id: number;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  contactPhone: string;
  deliveryFee: number;
  status: 'Active' | 'Inactive';
  deliveryTime: string;
}

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  tunisianCities = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa'];
  currentDestination: Destination | null = null;
  isFormOpen = false;
  isEditMode = false;
  searchTerm = '';

  destinationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.destinationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['Tunis', Validators.required],
      address: ['', Validators.required],
      lat: [36.8065, [Validators.required, Validators.min(30), Validators.max(38)]],
      lng: [10.1815, [Validators.required, Validators.min(7), Validators.max(12)]],
      contactPhone: ['', [Validators.pattern(/^[0-9]{8}$/)]],
      deliveryFee: [10, [Validators.required, Validators.min(0)]],
      deliveryTime: ['2-3 days', Validators.required],
      status: ['Active']
    });
  }

  ngOnInit(): void {
    this.loadTunisianSampleData();
  }

  ngAfterViewInit(): void {
    this.initTunisiaMap();
  }

  private initTunisiaMap(): void {
    this.map = L.map('destinationMap').setView([34.0, 9.5], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (!this.isFormOpen) {
        this.openAddForm();
        this.destinationForm.patchValue({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    });

    this.plotDestinations();
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
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    this.filteredDestinations.forEach(dest => {
      const marker = L.marker([dest.lat, dest.lng], {
        icon: this.getMarkerIcon(dest.status)
      })
      .addTo(this.map)
      .bindPopup(`
        <b>${dest.name}</b><br>
        <small>${dest.city}</small><br>
        ${dest.address}<br>
        Fee: ${dest.deliveryFee} TND<br>
        Time: ${dest.deliveryTime}
      `);

      this.markers.push(marker);
    });
  }

  loadTunisianSampleData(): void {
    this.destinations = [
      {
        id: 1,
        name: 'Tunis Main Hub',
        city: 'Tunis',
        address: 'Zone Industrielle Charguia 1',
        lat: 36.8364,
        lng: 10.1633,
        contactPhone: '12345678',
        deliveryFee: 5,
        deliveryTime: '1-2 days',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Sfax Distribution Center',
        city: 'Sfax',
        address: 'Route de l\'Aéroport Km 2',
        lat: 34.7478,
        lng: 10.7663,
        contactPhone: '98765432',
        deliveryFee: 8,
        deliveryTime: '2-3 days',
        status: 'Active'
      }
    ];
    this.filteredDestinations = [...this.destinations];
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

  openEditForm(destination: Destination): void {
    this.isFormOpen = true;
    this.isEditMode = true;
    this.currentDestination = destination;
    this.destinationForm.patchValue(destination);
    this.map.setView([destination.lat, destination.lng], 12);
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
      
      this.destinations.push({
        id: newId,
        ...formData
      });
    }

    this.filterDestinations();
    this.closeForm();
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.destinationForm.reset();
  }

  filterDestinations(): void {
    if (!this.searchTerm) {
      this.filteredDestinations = [...this.destinations];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredDestinations = this.destinations.filter(dest =>
        dest.name.toLowerCase().includes(term) ||
        dest.city.toLowerCase().includes(term) ||
        dest.address.toLowerCase().includes(term)
      );
    }
    this.plotDestinations();
  }

  toggleStatus(id: number): void {
    const destination = this.destinations.find(d => d.id === id);
    if (destination) {
      destination.status = destination.status === 'Active' ? 'Inactive' : 'Active';
      this.filterDestinations();
    }
  }

  deleteDestination(id: number): void {
    if (confirm('Are you sure you want to delete this destination?')) {
      this.destinations = this.destinations.filter(d => d.id !== id);
      this.filterDestinations();
    }
  }
}