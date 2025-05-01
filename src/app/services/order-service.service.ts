// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Commande {
  id_commande: number;
  dateCommande: string;
  statut_commande: string;
  adresse_livraison: string | null;
  total: number;
  articel_commande: string | null;
  remise: number;
  fraisLivraison: number;
  date_livraison_estimee: string | null;
  commentaires: string | null;
  ispaied: boolean;
  latitude: number;
  longitude: number;
  iduser: number;
  idproduit: number | null;
  livreurId: number | null;
  productDTO: any | null;
  userDTO: any | null;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8090/api/orders';

  constructor(private http: HttpClient) {}

  getOrdersByLivreurId(livreurId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/livreur/${livreurId}`);
  }

  getOrdersByUserId(userId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const formData = new FormData();
    formData.append('statut_commande', status);
    return this.http.put(`${this.apiUrl}/update/${orderId}`, formData);
  }
}