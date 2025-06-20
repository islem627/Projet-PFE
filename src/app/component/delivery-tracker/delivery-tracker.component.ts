/*import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapDirectionsService, GoogleMap } from '@angular/google-maps';
import { map } from 'rxjs/operators';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
@Component({
    selector: 'app-delivery-tracker',
    template: `
        <div>
            <h2>Suivi des livreurs</h2>
            <mat-form-field>
                <mat-label>Sélectionner un livreur</mat-label>
                <mat-select [(value)]="selectedLivreurId" (selectionChange)="changeLivreur($event.value)">
                    <mat-option *ngFor="let livreur of livreurs" [value]="livreur.id">
                        Livreur {{ livreur.id }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
        </div>
        <google-map
            #map
            height="500px"
            width="100%"
            [center]="center"
            [zoom]="15"
        >
            <map-marker
                *ngFor="let position of livreurPositions"
                [position]="position"
                [title]="'Livreur ' + position.livreurId"
                [icon]="position.livreurId === selectedLivreurId ? { url: 'assets/marker-selected.png' } : { url: 'assets/marker.png' }"
            ></map-marker>
            <map-directions-renderer
                *ngIf="directionsResult"
                [directions]="directionsResult"
            ></map-directions-renderer>
        </google-map>
        <div *ngIf="routeInfo">
            <p>Distance: {{ routeInfo.distance }}</p>
            <p>Durée estimée: {{ routeInfo.duration }}</p>
        </div>
        <p *ngIf="error" style="color: red">{{ error }}</p>
    `,
    styles: [`
        mat-form-field {
            margin-bottom: 20px;
            width: 200px;
        }
        google-map {
            border: 1px solid #ccc;
        }
    `]
})
export class DeliveryTrackerComponent implements OnInit {
    @ViewChild('map') map: GoogleMap | undefined;
    @Input() destination = { lat: 48.8606, lng: 2.3376 }; // Point de livraison
    center = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
    livreurs = [{ id: '60' }, { id: '61' }]; // Liste statique, à dynamiser si besoin
    selectedLivreurId = '60';
    livreurPositions: { livreurId: string, lat: number, lng: number }[] = [];
    directionsResult: google.maps.DirectionsResult | undefined;
    routeInfo: { distance: string, duration: string } | undefined;
    error: string | undefined;
    private stompClient: Client;
    constructor(
        private http: HttpClient,
        private directionsService: MapDirectionsService
    ) {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: (str) => console.log(str)
        });
    }
    ngOnInit() {
        this.connectWebSocket();
        this.startGeolocation();
    }
    connectWebSocket() {
        this.stompClient.onConnect = (frame) => {
            console.log('WebSocket connected:', frame);
            this.error = undefined;
            this.livreurs.forEach(livreur => {
                this.stompClient.subscribe(`/topic/location/${livreur.id}`, (message) => {
                    const location = JSON.parse(message.body);
                    console.log('Received location for livreur', livreur.id, ':', location);
                    this.updateLivreurPosition(livreur.id, location.latitude, location.longitude);
                    if (livreur.id === this.selectedLivreurId) {
                        this.center = { lat: location.latitude, lng: location.longitude };
                        this.updateRoute();
                    }
                });
            });
        };
        this.stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            this.error = 'Erreur WebSocket: ' + frame.headers['message'];
        };
        this.stompClient.onWebSocketClose = () => {
            console.log('WebSocket closed, reconnecting...');
            this.error = 'Connexion WebSocket perdue, reconnexion en cours...';
        };
        this.stompClient.activate();
    }
    startGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.http
                        .post('http://localhost:8080/api/delivery/location', {
                            livreurId: this.selectedLivreurId,
                            latitude: pos.lat,
                            longitude: pos.lng,
                            timestamp: Date.now()
                        })
                        .subscribe({
                            next: () => console.log('Position sent to backend'),
                            error: (err) => {
                                console.error('HTTP error:', err);
                                this.error = 'Erreur envoi position: ' + err.message;
                            }
                        });
                    this.updateLivreurPosition(this.selectedLivreurId, pos.lat, pos.lng);
                    this.center = pos;
                    this.updateRoute();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.error = 'Erreur géolocalisation: ' + error.message;
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            this.error = 'Géolocalisation non supportée par le navigateur';
        }
    }
    updateLivreurPosition(livreurId: string, lat: number, lng: number) {
        const index = this.livreurPositions.findIndex(p => p.livreurId === livreurId);
        if (index >= 0) {
            this.livreurPositions[index] = { livreurId, lat, lng };
        } else {
            this.livreurPositions.push({ livreurId, lat, lng });
        }
    }
    changeLivreur(livreurId: string) {
        this.selectedLivreurId = livreurId;
        const pos = this.livreurPositions.find(p => p.livreurId === livreurId);
        if (pos) {
            this.center = { lat: pos.lat, lng: pos.lng };
            this.updateRoute();
        }
    }
    updateRoute() {
        const origin = this.livreurPositions.find(p => p.livreurId === this.selectedLivreurId);
        if (!origin) return;
        const request: google.maps.DirectionsRequest = {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: this.destination,
            travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsService
            .route(request)
            .pipe(map(response => response.result))
            .subscribe({
                next: (result) => {
                    if (result) {
                        this.directionsResult = result;
                        const route = result.routes[0].legs[0];
                        this.routeInfo = {
                            distance: route.distance.text,
                            duration: route.duration.text
                        };
                    }
                },
                error: (err) => {
                    console.error('Directions error:', err);
                    this.error = 'Erreur calcul itinéraire: ' + err.message;
                }
            });
    }
}
    */

   import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapDirectionsService, GoogleMap } from '@angular/google-maps';
import { debounceTime, map } from 'rxjs/operators';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error-service.service';
@Component({
    selector: 'app-delivery-tracker',
    template: `
        <div>
            <h2>Suivi des livreurs</h2>
            <mat-form-field>
                <mat-label>Sélectionner un livreur</mat-label>
                <mat-select [(value)]="selectedLivreurId" (selectionChange)="changeLivreur($event.value)">
                    <mat-option *ngFor="let livreur of livreurs" [value]="livreur.id">
                        Livreur {{ livreur.id }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
        </div>
        <google-map
            #map
            height="500px"
            width="100%"
            [center]="center"
            [zoom]="15"
        >
            <map-advanced-marker
                *ngFor="let position of livreurPositions"
                [position]="position"
                [title]="'Livreur ' + position.livreurId"
                [content]="position.livreurId === selectedLivreurId ? selectedMarkerContent : defaultMarkerContent"
            ></map-advanced-marker>
            <map-directions-renderer
                *ngIf="directionsResult"
                [directions]="directionsResult"
            ></map-directions-renderer>
        </google-map>
        <div *ngIf="routeInfo">
            <p>Distance: {{ routeInfo.distance }}</p>
            <p>Durée estimée: {{ routeInfo.duration }}</p>
        </div>
        <p *ngIf="error" style="color: red">{{ error }}</p>
    `,
    styles: [`
        mat-form-field {
            margin-bottom: 20px;
            width: 200px;
        }
        google-map {
            border: 1px solid #ccc;
        }
    `]
})
export class DeliveryTrackerComponent implements OnInit {
    @ViewChild('map') map: GoogleMap | undefined;
    @Input() destination = { lat: 36.4576768, lng: 10.7216896 }; // Adapté à vos coordonnées
    center = { lat: 36.4576768, lng: 10.7216896 }; // Centre initial
    livreurs = [{ id: '60' }, { id: '61' }]; // Liste statique
    selectedLivreurId = '60';
    livreurPositions: { livreurId: string, lat: number, lng: number }[] = [];
    directionsResult: google.maps.DirectionsResult | undefined;
    routeInfo: { distance: string, duration: string } | undefined;
    error: string | undefined;
    selectedMarkerContent: HTMLElement;
    defaultMarkerContent: HTMLElement;
    private stompClient: Client;
    constructor(
        private http: HttpClient,
        private directionsService: MapDirectionsService,
    private toastr: ToastrService,
    private errorService: ErrorService
    ) {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: (str) => console.log(str)
        });
        // Créer des contenus personnalisés pour les marqueurs
        this.selectedMarkerContent = document.createElement('div');
        this.selectedMarkerContent.innerHTML = '<div style="background:red;width:20px;height:20px;border-radius:50%;"></div>';
        this.defaultMarkerContent = document.createElement('div');
        this.defaultMarkerContent.innerHTML = '<div style="background:blue;width:20px;height:20px;border-radius:50%;"></div>';
    }

   startGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    livreurId: this.selectedLivreurId,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: Date.now()
                };
                this.http.post('http://localhost:8080/api/delivery/location', location).subscribe({
                    next: () => console.log('Position envoyée:', location),
                    error: (err) => this.errorService.handleError(err, 'Envoi position')
                });
            },
            (error) => {
                this.error = this.errorService.handleError(error, 'Géolocalisation');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        this.error = this.errorService.handleError(new Error('Non supporté'), 'Géolocalisation');
    }
}



    private updateRouteSubject = new Subject<void>();
    ngOnInit() {
      
       /* this.connectWebSocket();
        this.startGeolocation();
        */
this.updateRouteSubject.pipe(debounceTime(500)).subscribe(() => {
        this.updateRoute();
    });
    this.http.get<{ id: string }[]>('http://localhost:8080/api/livreurs').subscribe({
});

        this.http.get<{ id: string }[]>('http://localhost:8080/api/livreurs').subscribe({
        next: (livreurs) => {
            this.livreurs = livreurs;
            this.selectedLivreurId = livreurs[0]?.id || '60';
            this.connectWebSocket();
            this.startGeolocation();
        },
        error: (err) => {
            console.error('Error fetching livreurs:', err);
            this.error = 'Erreur chargement livreurs: ' + err.message;
            this.livreurs = [{ id: '60' }, { id: '61' }]; // Fallback
            this.connectWebSocket();
            this.startGeolocation();
        }
    });


    }
    connectWebSocket() {
        this.stompClient.onConnect = (frame) => {
            console.log('WebSocket connected:', frame);
            this.error = undefined;
            this.livreurs.forEach(livreur => {
                this.stompClient.subscribe(`/topic/location/${livreur.id}`, (message) => {
                    const location = JSON.parse(message.body);
                    console.log('Received location for livreur', livreur.id, ':', location);
                    this.updateLivreurPosition(livreur.id, location.latitude, location.longitude);
                    if (livreur.id === this.selectedLivreurId) {
                        this.center = { lat: location.latitude, lng: location.longitude };
                        this.updateRoute();
                    }
                });
            });
        };
        this.stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            this.error = 'Erreur WebSocket: ' + frame.headers['message'];
        };
        this.stompClient.onWebSocketClose = () => {
            console.log('WebSocket closed, reconnecting...');
            this.error = 'Connexion WebSocket perdue, reconnexion en cours...';
        };
        this.stompClient.activate();
    }
  /*  startGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.http
                        .post('http://localhost:8080/api/delivery/location', {
                            livreurId: this.selectedLivreurId,
                            latitude: pos.lat,
                            longitude: pos.lng,
                            timestamp: Date.now()
                        })
                        .subscribe({
                            next: () => console.log('Position sent to backend'),
                            error: (err) => {
                                console.error('HTTP error:', err);
                                this.error = 'Erreur envoi position: ' + err.message;
                            }
                        });
                    this.updateLivreurPosition(this.selectedLivreurId, pos.lat, pos.lng);
                    this.center = pos;
                    this.updateRoute();
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.error = 'Erreur géolocalisation: ' + error.message;
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            this.error = 'Géolocalisation non supportée par le navigateur';
        }
    }*/
   /* updateLivreurPosition(livreurId: string, lat: number, lng: number) {
        const index = this.livreurPositions.findIndex(p => p.livreurId === livreurId);
        if (index >= 0) {
            this.livreurPositions[index] = { livreurId, lat, lng };
        } else {
            this.livreurPositions.push({ livreurId, lat, lng });
        }
    }*/

updateLivreurPosition(livreurId: string, lat: number, lng: number) {
    const index = this.livreurPositions.findIndex(p => p.livreurId === livreurId);
    const newPos = { livreurId, lat, lng };
    if (index >= 0) {
        const oldPos = this.livreurPositions[index];
        if (Math.abs(oldPos.lat - lat) < 0.0001 && Math.abs(oldPos.lng - lng) < 0.0001) {
            return; // Ignorer les petites variations
        }
        this.livreurPositions[index] = newPos;
    } else {
        this.livreurPositions.push(newPos);
    }
    this.toastr.success(`Nouvelle position pour Livreur ${livreurId}: ${lat}, ${lng}`);
    this.http.post('https://fcm.googleapis.com/fcm/send', {
        // ...
    }).subscribe({
        next: () => console.log('Notification sent'),
        error: (err) => console.error('Notification error:', err)
    });
    if (livreurId === this.selectedLivreurId) {
        this.center = { lat, lng };
        this.updateRouteSubject.next();
    }
}



    changeLivreur(livreurId: string) {
        this.selectedLivreurId = livreurId;
        const pos = this.livreurPositions.find(p => p.livreurId === livreurId);
        if (pos) {
            this.center = { lat: pos.lat, lng: pos.lng };
            this.updateRoute();
        }
    }
   /* updateRoute() {
        const origin = this.livreurPositions.find(p => p.livreurId === this.selectedLivreurId);
        if (!origin) return;
        const request: google.maps.DirectionsRequest = {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: this.destination,
            travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsService
            .route(request)
            .pipe(map(response => response.result))
            .subscribe({
                next: (result) => {
                    if (result) {
                        this.directionsResult = result;
                        const route = result.routes[0].legs[0];
                        this.routeInfo = {
                            distance: route.distance.text,
                            duration: route.duration.text
                        };
                    }
                },
                error: (err) => {
                    console.error('Directions error:', err);
                    this.error = 'Erreur calcul itinéraire: ' + err.message;
                }
            });
    }*/


updateRoute() {
    const origin = this.livreurPositions.find(p => p.livreurId === this.selectedLivreurId);
    if (!origin) return;
    const waypoints = [
        { location: { lat: 36.4580, lng: 10.7220 }, stopover: true } // Exemple adapté
    ];
    const request: google.maps.DirectionsRequest = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: this.destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsService
        .route(request)
        .pipe(map(response => response.result))
        .subscribe({
            next: (result) => {
                if (result) {
                    this.directionsResult = result;
                    const route = result.routes[0].legs[0];
                    this.routeInfo = {
                        distance: route.distance.text,
                        duration: route.duration.text
                    };
                }
            },
            error: (err) => {
                console.error('Directions error:', err);
                this.error = 'Erreur calcul itinéraire: ' + err.message;
            }
        });
}



}