import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  listClients: any[] = []; // Correction : aligné avec le HTML

  constructor(private service: AllmyservicesService, private router : Router) {}
  c: number = 1


  ngOnInit(): void {
    this.getClientsList();
  }

  getClientsList() {
    this.service.getClients().subscribe(
      (result) => {
        console.log("Clients récupérés :", result);
        this.listClients = result; // Correction : utilisation de listClients
      },
      (error) => {
        console.error("Erreur lors de la récupération des clients", error);
      }
    );
  }

  detailsClient(id: string) {
    this.router.navigate(['/detailsclient', id]);  // Navigation vers la page des détails du client
  }
  

  updateClient(id: string) {
    this.router.navigate(['/updateuser', id]);  // Navigation vers la page des détails du client

  }


  deleteClient(id: string){Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085D6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.service. deleteOneUser(id).subscribe(
        (res)=>{console.log("suceess to delete: ", res) ;
          this.getClientsList() //apel au fonction de get all
        } ,
        (error)=>{console.log("error",error)}
      )
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });}
  search()
  {console.log("in sercah button",this.listClients.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) ));
  this.listClients=this.listClients.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) );
  }

searchText: string = '';

  
}
