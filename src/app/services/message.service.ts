import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8080/api/send-message';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    //
    const params = new HttpParams().set('message', message);  // Ajoute le paramètre 'message' à la requête

    return this.http.post(this.apiUrl, null, { params: { message } });
  }
}
