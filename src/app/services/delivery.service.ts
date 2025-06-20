import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationDTO } from '../models/LocationDTO';
import { CommandeDTO } from '../models/CommandeDTO';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8080/api/delivery';

  constructor(private http: HttpClient) { }

  getLocation(livreurId: number): Observable<LocationDTO> {
    return this.http.get<LocationDTO>(`${this.apiUrl}/location/${livreurId}`);
  }

  getOptimizedRoute(livreurId: number): Observable<CommandeDTO[]> {
    return this.http.get<CommandeDTO[]>(`${this.apiUrl}/route/${livreurId}`);
  }

  postLocation(location: LocationDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/location`, location);
  }
}