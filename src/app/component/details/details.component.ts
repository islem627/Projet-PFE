import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  orderId: string | null = '';  // ID du order depuis l'URL
  order: any = {};  // Objet pour stocker les détails du order
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du order à partir de l'URL
    this.orderId = this.route.snapshot.paramMap.get('id_commande');
    if (this.orderId) {
      this.getOrderDetails(this.orderId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getOrderDetails(id: string) {
    this.service.DetailsOrder(id).subscribe(
      (result) => {
        this.order = result;  // Stockage des détails du order
        console.log('Détails du order:', this.order);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du order:', error);
      }
    );
  }
}