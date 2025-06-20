/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  currentUser: { iduser: number; username: string } | null = null;

  getCurrentUserId(): string | null {
    return this.currentUser?.iduser?.toString() || null;
  }
 

  logout(headers?: HttpHeaders): Observable<any> {
    return this.http.get('http://localhost:8762/User/signout', { headers }).pipe(
      tap((response) => {
        console.log('Déconnexion réussie:', response);
      }),
      catchError((error) => {
        console.error('Erreur de déconnexion:', error);
        return throwError(() => error);
      })
    );
  }
}*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: {
    iduser: number;
    username: string;
    phone?: string;
    enseigne?: string;
    role?: string;
    address?: string;
    firstname?: string;
    lastname?: string;
  } | null = null;

  constructor(private http: HttpClient) {}



  
  getCurrentUserId(): string | null {
    return this.currentUser?.iduser?.toString() || null;
  }

  login(username: string, password: string): Promise<void> {
    return this.http.post<any>('http://localhost:8762/User/login', { username, password })
      .toPromise()
      .then(response => {
        this.currentUser = {
          iduser: response.iduser,
          username: response.username,
          phone: response.phone || response.telephone || response.mobile,
          enseigne: response.enseigne || response.storeName || response.brand || response.store,
          role: response.role,
          address: response.address,
          firstname: response.firstname,
          lastname: response.lastname
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
      });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}