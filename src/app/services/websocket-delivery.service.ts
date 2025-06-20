import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { LocationDTO } from '../models/LocationDTO';
@Injectable({
  providedIn: 'root'
})
export class WebsocketDeliveryService {
  private client: Client;
  private locationSubject = new BehaviorSubject<LocationDTO | null>(null);
  private wsUrl = 'http://localhost:8080/websocket';

  constructor() {
    this.client = Stomp.over(() => new SockJS(this.wsUrl));
    this.client.activate();
  }

  connectToLocationTopic(livreurId: number): Observable<LocationDTO | null> {
    this.client.onConnect = () => {
      this.client.subscribe(`/topic/location/${livreurId}`, (message) => {
        const location: LocationDTO = JSON.parse(message.body);
        this.locationSubject.next(location);
      });
    };
    return this.locationSubject.asObservable();
  }

  disconnect() {
    this.client.deactivate();
  }

}