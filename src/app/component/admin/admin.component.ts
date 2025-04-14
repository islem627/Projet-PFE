import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private service: AllmyservicesService , private router: Router) {}

  listAdmins: any[] = [];
  c: number = 1


  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins() {
    this.service.getAdmins().subscribe(
      (admins: any[]) => {
        console.log("Liste des admins :", admins);
        this.listAdmins = admins;
      },
      (error) => {
        console.error("Erreur lors de la récupération des admins", error);
      }
    );
  }
  
  
  detailsAdmin(id: string) {
    this.router.navigateByUrl("/detailsadmin/"+id)
  }

  updateAdmin(id: string) {
    alert("Mettre à jour l'admin: " + id);
  }

  deleteAdmin(id: string) {Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085D6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.service. deleteProduc(id).subscribe(
        (res)=>{console.log("suceess to delete: ", res) ;
          this.getAdmins() //apel au fonction de get all
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
  {console.log("in sercah button",this.listAdmins.filter(item =>typeof item.username === 'string' && item.nausernameme.toLowerCase().includes(this.searchText.toLowerCase()) ));
  this.listAdmins=this.listAdmins.filter(item =>typeof item.username === 'string' && item.username.toLowerCase().includes(this.searchText.toLowerCase()) );
  }

searchText: string = '';

}