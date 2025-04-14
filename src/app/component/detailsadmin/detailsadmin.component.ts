import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-detailsadmin',
  templateUrl: './detailsadmin.component.html',
  styleUrls: ['./detailsadmin.component.css']
})
export class DetailsadminComponent implements OnInit {
  adminId: string | null = '';  // ID du admin depuis l'URL
  admin: any = {};  // Objet pour stocker les détails du admin
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du admin à partir de l'URL
    this.adminId = this.route.snapshot.paramMap.get('id');
    if (this.adminId) {
      this.getClientDetails(this.adminId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getClientDetails(id: string) {
    this.service.DetailsUser(id).subscribe(
      (result) => {
        this.admin = result;  // Stockage des détails du admin
        console.log('Détails du admin:', this.admin);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du admin:', error);
      }
    );
  }
}