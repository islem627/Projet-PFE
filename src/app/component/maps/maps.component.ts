import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandeDTO } from 'src/app/models/CommandeDTO';
import { LocationDTO } from 'src/app/models/LocationDTO';
import { DeliveryService } from 'src/app/services/delivery.service';
import { WebsocketDeliveryService } from 'src/app/services/websocket-delivery.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {
  livreurId = 60;
  location: LocationDTO | null = null;
  route: CommandeDTO[] = [];
  center: google.maps.LatLngLiteral = { lat: 36.8064948, lng: 10.1815316 };
  zoom = 12;
  markers: any[] = [];
  polylineOptions: google.maps.PolylineOptions = { strokeColor: '#FF0000', strokeWeight: 5 };
  private wsSubscription: Subscription | undefined;

  constructor(
    private deliveryService: DeliveryService,
    private websocketService: WebsocketDeliveryService
  ) {}

  ngOnInit() {
    this.loadLocation();
    this.loadRoute();
    this.wsSubscription = this.websocketService.connectToLocationTopic(this.livreurId)
      .subscribe(location => {
        if (location) {
          this.location = location;
          this.updateMarkers();
        }
      });
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  loadLocation() {
    this.deliveryService.getLocation(this.livreurId).subscribe({
      next: (location) => {
        this.location = location;
        this.updateMarkers();
      },
      error: (err) => console.error('Error fetching location:', err)
    });
  }

  loadRoute() {
    this.deliveryService.getOptimizedRoute(this.livreurId).subscribe({
      next: (route) => {
        this.route = route;
        this.updateMarkers();
      },
      error: (err) => console.error('Error fetching route:', err)
    });
  }

  updateMarkers() {
    this.markers = [];
    if (this.location) {
      this.markers.push({
        position: { lat: this.location.latitude, lng: this.location.longitude },
        label: 'Livreur',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
    }
    this.route.forEach((point, index) => {
      this.markers.push({
        position: { lat: point.latitude, lng: point.longitude },
        label: `Point ${index + 1}`,
        title: point.adresse
      });
    });
  }

  getPolylinePath(): google.maps.LatLngLiteral[] {
    const path: google.maps.LatLngLiteral[] = [];
    if (this.location) {
      path.push({ lat: this.location.latitude, lng: this.location.longitude });
    }
    this.route.forEach(point => {
      path.push({ lat: point.latitude, lng: point.longitude });
    });
    return path;
  }
}
