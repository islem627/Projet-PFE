import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-detailsclient',
  templateUrl: './detailsclient.component.html',
  styleUrls: ['./detailsclient.component.css']
})
export class DetailsclientComponent implements OnInit {
  clientId: string | null = '';  // ID du client depuis l'URL
  client: any = {};  // Objet pour stocker les détails du client
  showPassword: boolean = false;

  constructor(private route: ActivatedRoute, private service: AllmyservicesService) {}

  ngOnInit(): void {
    // Récupérer l'ID du client à partir de l'URL
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.getClientDetails(this.clientId);  // Appel de la méthode pour récupérer les détails
    }
  }

  getClientDetails(id: string) {
    this.service.DetailsUser(id).subscribe(
      (result) => {
        this.client = result;  // Stockage des détails du client
        console.log('Détails du client:', this.client);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du client:', error);
      }
    );
  }
}
