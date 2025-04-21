import { Injectable } from '@angular/core';
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
}