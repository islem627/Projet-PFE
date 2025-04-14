import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-detailsproduct',
  templateUrl: './detailsproduct.component.html',
  styleUrls: ['./detailsproduct.component.css']
})
export class DetailsproductComponent implements OnInit {
  productId: string | null = '';  // ID du product depuis l'URL
  product: any = {};  // Objet pour stocker les détails du product
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du product à partir de l'URL
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.getProductDetails(this.productId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getProductDetails(id: string) {
    this.service.DetailsProduct(id).subscribe(
      (result) => {
        this.product = result;
        console.log('Détails du produit:', this.product);  // Vérifie la structure ici
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du produit:', error);
      }
    );
  }
  
}
