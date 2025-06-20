import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  deliveryForm: FormGroup;
  fixe_tempss: string[] = ['Morning', 'Midday', 'Afternoon'];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.deliveryForm = this.fb.group({
      id_commande: ['', [Validators.required, Validators.min(1)]],
      date_livraison_estimee: ['', Validators.required],
      fixe_temps: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Pas de pré-remplissage depuis l'URL pour simplifier
  }

 onSubmit(): void {
  if (this.deliveryForm.valid) {
    Swal.fire({
      title: 'Confirmer la modification ?',
      text: 'Voulez-vous vraiment modifier cette commande ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const idCommande = this.deliveryForm.value.id_commande;
        const formData = {
          id_commande: idCommande,
          date_livraison_estimee: this.formatDate(this.deliveryForm.value.date_livraison_estimee),
          deliveryOption: this.deliveryForm.value.fixe_temps
        };

        const url = `http://localhost:8764/Commande/updateCMD/${idCommande}`;
        this.http.put(url, formData).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès',
              text: 'Commande modifiée avec succès !',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.deliveryForm.reset();
              this.router.navigate(['/partner/history']);
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erreur',
              text: 'Échec de la modification. Veuillez vérifier les données.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  } else {
    Swal.fire({
      title: 'Formulaire invalide',
      text: 'Veuillez remplir tous les champs requis.',
      icon: 'warning',
      confirmButtonColor: '#f39c12'
    });
  }
}


  formatDate(date: string): string {
    // Convertir YYYY-MM-DD en ISO 8601 pour le backend
    const d = new Date(date);
    return d.toISOString();
    // Si le backend attend YYYY-MM-DD, utilise :
    // return date;
  }
}