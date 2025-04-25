import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livreurs',
  templateUrl: './livreurs.component.html',
  styleUrls: ['./livreurs.component.css']
})
export class LivreursComponent implements OnInit {
  listLivreur: any[] = []; // Correction : aligné avec le HTML

  constructor(private service: AllmyservicesService, private router : Router) {}
  c: number = 1


  ngOnInit(): void {
    this.getLivreursList();
  }

  getLivreursList() {
    this.service.getLivreurs().subscribe(
      (result) => {
        console.log("Livreurs récupérés :", result);
        this.listLivreur = result; // Correction : utilisation de listLivreur
      },
      (error) => {
        console.error("Erreur lors de la récupération des Livreurs", error);
      }
    );
  }

  detailsLivreur(id: string) {
    this.router.navigate(['/detailslivreur', id]);  // Navigation vers la page des détails du Livreur
  }
  

  updateLivreur(id: string) {
    this.router.navigate(['/updatelivreur', id]);  // Navigation vers la page des détails du Livreur

  }


  deleteLivreur(id: string){Swal.fire({
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
          this.getLivreursList() //apel au fonction de get all
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
  {console.log("in sercah button",this.listLivreur.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) ));
  this.listLivreur=this.listLivreur.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) );
  }

searchText: string = '';

  
}

