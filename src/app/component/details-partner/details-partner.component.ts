import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-details-partner',
  templateUrl: './details-partner.component.html',
  styleUrls: ['./details-partner.component.css']
})
export class DetailsPartnerComponent implements OnInit {
  partnerId: string | null = '';  // ID du partner depuis l'URL
  partner: any = {};  // Objet pour stocker les détails du partner
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du partner à partir de l'URL
    this.partnerId = this.route.snapshot.paramMap.get('id');
    if (this.partnerId) {
      this.getClientDetails(this.partnerId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getClientDetails(id: string) {
    this.service.DetailsUser(id).subscribe(
      (result) => {
        this.partner = result;  // Stockage des détails du partner
        console.log('Détails du partner:', this.partner);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du partner:', error);
      }
    );
  }
}