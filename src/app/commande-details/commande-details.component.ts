import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService, Commande } from '../services/allmyservices.service';

@Component({
  selector: 'app-commande-details',
  templateUrl: './commande-details.component.html',
  styleUrls: ['./commande-details.component.css']
})
export class CommandeDetailsComponent implements OnInit {
  commande: Commande | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: AllmyservicesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getCommande(id).subscribe({
        next: (data: Commande) => {
          this.commande = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la récupération des détails de la commande';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}