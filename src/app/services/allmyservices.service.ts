import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AllmyservicesService {

  constructor(private http:HttpClient) {}
 
 
 //*********************service orders************************************ */

 AllOrders()           
 {return this.http.get(`${environment.baseUrlorder}/Commande/getAll`)}//
 
 
 deleteOneorder(id:String)
 {return this.http.delete(`${environment.baseUrlorder}/Commande/delete/${id}`)}

 Detailsdeorder(id:String)
 {
   return this.http.get(`${environment.baseUrlorder}/Commande/getcmd/${id}`)
 }

 updateorder(id:String, data:any){
   return this.http.put(`${environment.baseUrlorder}/Commande/updatecmd/${id}`,data)
 }
 Ajoutorder(iduser: string, idproduit: string, data: any) {

  return this.http.post(`${environment.baseUrlorder}/Commande/createUP/${iduser}/${idproduit}`, data);
}


 AllcmdByIdProduct(id:String){
   return this.http.get(`${environment.baseUrlorder}/Commande/allByproductID/${id}`)
 }

 AllcmdByIdUser(id:String){
  return this.http.get(`${environment.baseUrlorder}/Commande/allByUserID/${id}`)
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

  
  

}
