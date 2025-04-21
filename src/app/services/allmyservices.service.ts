import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';


/*interface Commande {
  id: number;
  date: string;  // Utilise 'string' ou 'Date' selon ton format
  status: string;
  // Ajoute d'autres propriétés de la commande si nécessaire
}*/
interface Commande {
  id_commande: string;
  dateCommande: string;
  statut_commande: string;
  adresse_livraison: string;
  total: number;
  remise: number;
  iduser?: number;
  userDTO?: {
    photo?: string;
    id?: number;
    username?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AllmyservicesService {
  private apiUrl = `${environment.baseUrlorder}/Commande`;

  constructor(private http:HttpClient) {}
 
 
 //*********************service orders************************************ */


 AllOrderss(): Observable<Commande[]> {
  return this.http.get<Commande[]>(`${this.apiUrl}/getAll`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

 AllOrders()           
 {return this.http.get(`${environment.baseUrlorder}/Commande/getAll`)}//
 
 
 deleteOneorder(id:String)
 {return this.http.delete(`${environment.baseUrlorder}/Commande/delete/${id}`)}
/*
 Detailsdeorder(id:String)
 {
   return this.http.get(`${environment.baseUrlorder}/Commande/getcmd/${id}`)
 }*/

/* updateorder(id:String, data:any){
   return this.http.put(`${environment.baseUrlorder}/Commande/updatecmd/${id}`,data)
 }*/


   ///
   /*
   updateorder(id: string, data: any) {
    return this.http.put(`${environment.baseUrlorder}/Commande/updatecmd/${id}`, data);
  }*/

    updateorder(id: string, data: any): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      });
      return this.http.put(`${environment.baseUrlorder}/api/orders/update/${id}`, data, { headers });
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

 /*AllcmdByIdUser(id:String){
  return this.http.get(`${environment.baseUrlorder}/Commande/allByUserID/${id}`)
}
*/
 /*
AllcmdByIdUser(id: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${environment.baseUrlorder}/Commande/allByUserID/${id}`, { headers });
}*/


/*Detailsdeorderr(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  console.log('Token utilisé pour Detailsdeorder :', token);
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${environment.baseUrlorder}/Commande/getcmd/${id}`, { headers });
}*/




Detailsdeorder(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${environment.baseUrlorder}/Commande/getcmd/${id}`, { headers });
}

AllcmdByIdUser(iduser: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${environment.baseUrlorder}/Commande/allByUserID/${iduser}`, { headers });
}
//*********************service users************************************ */

  AllUsers()
  {return this.http.get(`${environment.baseUrlUser}/User/getall`)}

  deleteOneUser(id:string)
  {return this.http.delete(`${environment.baseUrlUser}/User/delete/${id}`)}



  DetailsUser(id:string)
  {return this.http.get(`${environment.baseUrlUser}/User/getuser/${id}`)}


  UpdateUser(id:string , data:any)
  {return this.http.put(`${environment.baseUrlUser}/User/update/${id}`,data)}

  AjouterUser(id:string , data:any)
  {return this.http.post(`${environment.baseUrlUser}/User/createPhoto/${id}`,data)}

  
  
  getAdmins() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => users.filter(user => user.role === "admin"))
    );
  }

  getClients() {
    return this.http.get<any[]>(`${environment.baseUrlUser}/User/getall`).pipe(
      map(users => {
        return users.filter(user => user.role.toLowerCase() === "client");
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
  
    forgotPassword(email: string) {
      return this.http.post(`${environment.baseUrlUser}/User/forgot-password`, { email });
    }
    resetPassword(token: string, newPassword: string) {
      return this.http.post(`${environment.baseUrlUser}/User/reset-password`, {
        token,
        newPassword
      });
    }


  

}
