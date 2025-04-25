import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-detailslivreur',
  templateUrl: './detailslivreur.component.html',
  styleUrls: ['./detailslivreur.component.css']
})
export class DetailslivreurComponent implements OnInit {
  LivreurId: string | null = '';  // ID du Livreur depuis l'URL
  Livreur: any = {};  // Objet pour stocker les détails du Livreur
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du Livreur à partir de l'URL
    this.LivreurId = this.route.snapshot.paramMap.get('id');
    if (this.LivreurId) {
      this.getLivreurDetails(this.LivreurId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getLivreurDetails(id: string) {
    this.service.DetailsUser(id).subscribe(
      (result) => {
        this.Livreur = result;  // Stockage des détails du Livreur
        console.log('Détails du Livreur:', this.Livreur);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du Livreur:', error);
      }
    );
  }
}

