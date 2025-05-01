import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {
  commandeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private allMyServices: AllmyservicesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.commandeForm = this.fb.group({
      dateCommande: ['', Validators.required],
      adresse_livraison: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      articel_commande: [''],
      longueur_cm: [0],
      largeur_cm: [0],
      hauteur_cm: [0],
      poids_grammes: [0],
      gouvernoratCmd: [''],
      enseigne: [''],
      destination_enseigne: [''],
      iduser: [null, Validators.required],
      idproduit: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.commandeForm.invalid) {
      this.commandeForm.markAllAsTouched();
      return;
    }

    const commande: Commande = {
      ...this.commandeForm.value,
      statut_commande: 'PENDING' // Default status
    };

    this.allMyServices.AjouterCMD(commande).subscribe({
      next: (response) => {
        console.log('Commande créée avec succès', response);
        this.commandeForm.reset();
        alert('Commande créée avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande', error);
        alert('Erreur lors de la création de la commande : ' + error.message);
      }
    });
  }
}