import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detaisorder',
  templateUrl: './detaisorder.component.html',
  styleUrls: ['./detaisorder.component.css']
})
export class DetaisorderComponent implements OnInit {
  orderId: string | null = '';  // ID de la commande récupéré depuis l'URL
  order: any = {};  // Objet pour stocker les détails de la commande
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService , private router : Router) {}

  ngOnInit(): void {
    // Récupérer l'ID de la commande à partir de l'URL
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.getOrderDetails(this.orderId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getOrderDetails(id: string) {
    this.service.Detailsdeorder(id).subscribe(
      (result) => {
        if (result) {
          this.order = result;  // Stockage des détails de la commande
          console.log('Détails de la commande:', this.order);
        } else {
          // Gestion de l'erreur si aucune donnée n'est renvoyée
          Swal.fire('Erreur', 'Aucune commande trouvée avec cet ID', 'error');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de la commande:', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la récupération des détails', 'error');
      }
    );
  }
}
