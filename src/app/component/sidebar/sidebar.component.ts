import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent 
implements OnInit {

  usernameUserConnected: String = '';
  roleUserConnected: String = '';
isUserConnected: String = '';
 user:any

  constructor(

    private service: AllmyservicesService,
    private router: Router,
     ) {
 
  }

  ngOnInit(): void {
    this.usernameUserConnected = localStorage.getItem('username');
    this.roleUserConnected = localStorage.getItem('role');
    this.isUserConnected = localStorage.getItem('iduser');

     // Sauvegarde des données dans le localStorage
    



    if (this.isUserConnected) {
      this.getClientDetails();  // Appel de la méthode pour récupérer les détails
    }
  }

  getClientDetails() {
    this.service.DetailsUser(this.isUserConnected).subscribe(
      (result) => {
        this.user = result;  // Stockage des détails du user
        console.log('Détails du user:', this.user);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du user:', error);
      }
    );
  }
  }

  
