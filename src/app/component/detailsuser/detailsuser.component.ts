import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-detailsuser',
  templateUrl: './detailsuser.component.html',
  styleUrls: ['./detailsuser.component.css']
})
export class DetailsuserComponent implements OnInit {
  userId: string | null = '';  // ID du user depuis l'URL
  user: any = {};  // Objet pour stocker les détails du user
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du user à partir de l'URL
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getClientDetails(this.userId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getClientDetails(id: string) {
    this.service.DetailsUser(id).subscribe(
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