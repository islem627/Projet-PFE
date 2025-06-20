import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';



export interface Commande {
  id_commande: string;
  dateCommande: string;
  statut_commande: string;
  adresse_livraison: string;
  total: number;
  remise: number;
  iduser?: number;
  userDTO?: UserDTO;
  livreurId?: number;
  gouvernoratCmd?: string;
articel_commande?: string; // Matches backend  fraisLivraison?: number;
  date_livraison_estimee?: string;
  commentaires?: string;
isPaid?: boolean; // Corrected from ispaied 
  longitude?: number;
  idproduit?: number;
  productDTO?: ProductDTO;
  longueur_cm?: number;
  largeur_cm?: number;
  hauteur_cm?: number;
  poids_grammes?: number;
  enseigne?: string;
  destination_enseigne?: string;
  archived?: boolean;
  noteClient?: number;
  commentaireClient?: string;
  date_livree?: string;
  date_ajoutsystem?: string;
  date_affection?: string;
  date_expidetion?: string; // Added missing type
  idpartenaire?: string;
  deliveryOption?: string;
  fixe_temps?: string;
  fraisLivraison: number;
  latitude: String;
}

export interface UserDTO {
id?: number;
  username: string;
  phone: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  gouvernorat?: string;
  role?: string;
  disponible?: boolean;
  photo?: string;
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  dateAdded: string;
  photo: string | null;
  type: string;
  Disponible: boolean; // Corrected from disponiblity to match template
  quantity: number;
}



@Injectable({
  providedIn: 'root'
})
export class AllmyservicesService {
  private apiUrl = `${environment.baseUrlorder}/Commande`;
  private apiUrl2 = 'http://localhost:8080/api/orders';
  constructor(private http:HttpClient,
  
  ) {}
  private toLocalDateTimeFormat(date: Date): string {
    return date.toISOString().slice(0, 19);
  }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
   getCommande(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/getcmd/${id}`);
  }

    
   updateUserProfile_(formData: FormData, token: string, userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${environment.baseUrlUser}/User/update/${userId}`, formData, { headers }).pipe(
      tap((response) => console.log('Réponse updateUserProfile:', response)),
      catchError((error) => {
        console.error('Erreur updateUserProfile:', error);
        return throwError(() => new Error(error.error?.message || 'Échec de la mise à jour du profil'));
      })
    );
  }
  DetailsUserP(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${environment.baseUrlUser}/users/${userId}`, { headers });
  }


    AllcmdByIdLivreur2(idlivreur: string): Observable<Commande[]> {
      return this.http.get<Commande[]>(`${this.apiUrl}/livreur/${idlivreur}`, { headers: this.getHeaders() }).pipe(
        tap(data => console.log('Commandes livreur:', data)),
        catchError(err => {
          console.error('Erreur lors de la récupération des commandes:', err);
          return throwError(() => new Error('Erreur lors de la récupération des commandes'));
        })
      );
    }
  
    AllcmdByIdClient2(iduser: string): Observable<Commande[]> {
      return this.http.get<Commande[]>(`${this.apiUrl2}/user/${iduser}`, { headers: this.getHeaders() }).pipe(
        tap(data => console.log('Commandes client:', data)),
        catchError(err => {
          console.error('Erreur lors de la récupération des commandes:', err);
          return throwError(() => new Error('Erreur lors de la récupération des commandes'));
        })
      );
    }
  
    updateorder2(id: number, commande: Partial<Commande>): Observable<any> {
      return this.http.put(`${this.apiUrl2}/update/${id}`, commande, { headers: this.getHeaders() }).pipe(
        tap(data => console.log('Commande mise à jour:', data)),
        catchError(err => {
          console.error('Erreur lors de la mise à jour de la commande:', err);
          return throwError(() => new Error('Erreur lors de la mise à jour de la commande'));
        })
      );
    }


 
 //*********************service orders************************************ */


 AllOrderss(): Observable<Commande[]> {
  return this.http.get<Commande[]>(`${this.apiUrl}/getAll`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

 AllOrders()           
 {return this.http.get(`${environment.baseUrlorder}/Commande/getAll`)}//
 
  getOrdersByPartenaire(idpartenaire: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${environment.baseUrlorder}/Commande/partner/${idpartenaire}`);
  }

 deleteOneorder(id:String)
 {return this.http.delete(`${environment.baseUrlorder}/Commande/delete/${id}`)}

updateorder(id: string, data: Partial<Commande>): Observable<Commande> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    console.log('Sending PUT request with token:', token, 'and data:', data);
    return this.http.put<Commande>(`${environment.baseUrlorder}/Commande/updateCMD/${id}`, data, { headers });
  }
  

      AjouterCMD(data: FormData): Observable<any> {
        // No headers needed, as FormData sets 'multipart/form-data' with boundary automatically
        return this.http.post(`${environment.baseUrlorder}/commande/createE`, data).pipe(
          map(response => response),
          catchError(error => {
            console.error('Error creating commande:', error);
            return throwError(() => new Error(`Server error: ${error.status} - ${error.message}`));
          })
        );
      }

    
    getGovernorates(): Observable<string[]> {
      return this.http.get<string[]>(`${environment.baseUrlorder}/api/governorates`);
  }
  getGovernorateslivreur(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseUrlUser}/api/governorates`);
}
AllcmdByIdLivreur(idlivreur: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${environment.baseUrlorder}/Commande/allByLivreurID/${idlivreur}`, { headers });

  }


  AllcmdByIdClient(id: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${environment.baseUrlorder}/Commande/allByUserID/${id}`, { headers });
  
    }



  // Spécifie que cette méthode retourne un tableau de commandes
  getCommandesByClientId(clientId: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${environment.baseUrlorder}/Commande/allByUserID/${clientId}`);
  }

 Ajoutorder(iduser: string, idproduit: string, data: any) {

  return this.http.post(`${environment.baseUrlorder}/Commande/createUP/${iduser}/${idproduit}`, data);
}


 AllcmdByIdProduct(id:String){
   return this.http.get(`${environment.baseUrlorder}/Commande/allByproductID/${id}`)
 }


assignOrder(orderId: number, livreurId: number, dateAffection?: string): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  const body = {
    livreurId: livreurId,
    date_affection: dateAffection // Inclure date_affection si fourni
  };
  // Modifier l'URL pour supprimer livreurId de l'URL et l'inclure dans le corps
  return this.http.put(`/api/assign/${orderId}`, body, { headers });
}


getDeliveryPersons(id:String){
  return this.http.get(`${environment.baseUrlorder}/Commande/allByLivreurID/${id}`)
}


AllcmdByIdUser(iduser: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${environment.baseUrlorder}/Commande/allByUserID/${iduser}`, { headers });
}
//*********************service users************************************ */

  AllUsers()
  {return this.http.get(`${environment.baseUrlUser}/User/getall`)}

  
  
 AllLivreur(): Observable<any[]> {
    const url = `${environment.baseUrlUser}/User/getall-delivery-persons`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    console.log('📤 Sending AllLivreur request to:', url);
    return this.http.get<any[]>(url, { headers }).pipe(
      tap(response => console.log('📥 AllLivreur response:', response)),
      catchError(error => {
        console.error('❌ AllLivreur error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        return of([]);
      })
    );
  }

  deleteOneUser(id:string)
  {return this.http.delete(`${environment.baseUrlUser}/User/delete/${id}`)}



  DetailsUser(id:String)
  {return this.http.get(`${environment.baseUrlUser}/User/getuser/${id}`)}
  
DetailsOrder(id: String): Observable<Commande> {
    return this.http.get<Commande>(`${environment.baseUrlorder}/Commande/getcmd/${id}`);
  }

  UpdateUser(id:string , data:any)
  {return this.http.put(`${environment.baseUrlUser}/User/update/${id}`,data)}

  AjouterUser(id:string , data:any)
  {return this.http.post(`${environment.baseUrlUser}/User/createPhoto/${id}`,data)}

   Detailsdeorder(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${environment.baseUrlorder}/Commande/getcmd/${id}`, { headers });
  }
  
  getAdmins() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => users.filter(user => user.role === "Admin"))
    );
  }

  getClients() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => {
        return users.filter(user => user.role.toLowerCase() === "client");
      })
    );
  }
  getLivreurs() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => {
        return users.filter(user => user.role.toLowerCase() === "Livreur");
      })
    );
  }
   getDellliveryPerson() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => {
        return users.filter(user => user.role.toLowerCase() === "Delivery Person");
      })
    );
  }


   getPartners() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => {
        return users.filter(user => user.role.toLowerCase() === "partner");
      })
    );
  }
  

    signin(data: FormData) {
      return this.http.post('http://localhost:8762/User/signin', data);
    }
    
    register(data: FormData) {
      return this.http.post('http://localhost:8762/User/register', data);
    }
    signup() {
      
      return this.http.get('http://localhost:8762/User/signout',{ responseType: 'text' } );
    }
  
    

  //*********************service users************************************ */

  AllProducts()           
  {return this.http.get(`${environment.baseUrlproduct}/product/getall`)}//
  
  
  deleteProduc(id:String)
  {return this.http.delete(`${environment.baseUrlproduct}/product/delete/${id}`)}

  DetailsProduct(id:String)
  {
    return this.http.get(`${environment.baseUrlproduct}/product/getOne/${id}`)
  }

  updateProduct(id:String, data:any){
    return this.http.put(`${environment.baseUrlproduct}/product/updateProduct/${id}`,data)
  }
  AjoutProduct(idprod:String, data:any)
  {
    return this.http.post(`${environment.baseUrlproduct}/product/createPhoto/${idprod}`,data)
  }


  
  updateUserProfile(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Ne pas définir Content-Type manuellement pour multipart/form-data
    return this.http.put(this.apiUrl, formData, { headers });
  }
  
  forgetpassword(email: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrlUser}/User/resetpassword?email=${email}`,
      null // aucun corps, car l'email est envoyé dans l'URL
    );
  }
    resetPassword(token: string, newPassword: string) {
      return this.http.post(`${environment.baseUrlUser}/User/reset-password`, {
        token,
        newPassword
      });
    }
   

  


  // Archive a command
archiveCommande(id: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/archive/${id}`, {});
}

// Unarchive a command
unarchiveCommande(id: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/unarchive/${id}`, {});
}

// Fetch active commands for a user
getActiveCommandes(iduser: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/client/${iduser}/active`);
}

// Fetch archived commands for a user
getArchivedCommandes(iduser: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/client/${iduser}/archived`);
}

evaluateCommande(id: string, noteClient: number, commentaireClient: string, userId: number): Observable<any> {
  const payload = {
    noteClient: noteClient * 1.0, // Convert to float
    commentaireClient,
    userId
  };
  return this.http.put(`${this.apiUrl}/evaluate/${id}`, payload);
}
    
assignLivreurToCommande(idcommande: number, idlivreur: number, dateAffection: Date): Observable<any> {
  const url = `${this.apiUrl}/assignLivreur/${idcommande}/${idlivreur}`;

  const body = new HttpParams()
    .set('date_affection', dateAffection.toISOString()); // format ISO pour LocalDateTime

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this.http.put<any>(url, body.toString(), { headers });
}





getActiveCommandesByLivreur(idlivreur: string): Observable<Commande[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return this.http.get<Commande[]>(`${environment.baseUrlorder}/livreur/${idlivreur}/active`, { headers });
}
getArchivedCommandesByLivreur(idlivreur: string): Observable<Commande[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return this.http.get<Commande[]>(`${environment.baseUrlorder}/livreur/${idlivreur}/archived`, { headers });
}

assignLivreurToCommandeP(orderId: number, livreurId: number, date: Date): Observable<any> {
  const dateAffection = this.toLocalDateTimeFormat(date);
  const url = `${environment.baseUrlorder}/Commande/assignLivreur/${orderId}/${livreurId}`;
  console.log(`Requête PUT: ${url}?date_affection=${dateAffection}`);

  const params = new HttpParams().set('date_affection', dateAffection);

  return this.http.put(url, null, { params });
}

 AllUsersP(): Observable<any[]> {
    const url = `${environment.baseUrlUser}/User/getall`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    console.log('📤 Sending AllLUSERSS request to:', url);
    return this.http.get<any[]>(url, { headers }).pipe(
      tap(response => console.log('📥 AllLusers response:', response)),
      catchError(error => {
        console.error('❌ AllUsers error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        return of([]);
      })
    );
  }

}
