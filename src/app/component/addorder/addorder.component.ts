import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.css']
})
export class AddorderComponent implements OnInit {
  orderForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      dateCommande: ['', [Validators.required]],  // Date de la commande
      statut_commande: ['', [Validators.required]],  // Statut de la commande
      adresse_livraison: ['', [Validators.required]],  // Adresse de livraison
      total: ['', [Validators.required, Validators.min(0)]],  // Total de la commande
      articel_commande: ['', [Validators.required]],  // Article commandé
      remise: ['', [Validators.required, Validators.min(0)]],  // Remise
      fraisLivraison: ['', [Validators.required, Validators.min(0)]],  // Frais de livraison
      date_livraison_estimee: ['', [Validators.required]],  // Date estimée de livraison
      commentaires: ['', [Validators.required]],  // Commentaires
      ispaied: [false, [Validators.required]],  // Statut de paiement
      latitude: ['', [Validators.required]],  // Latitude de l'adresse
      longitude: ['', [Validators.required]],  // Longitude de l'adresse
      idProduct: ['', [Validators.required]],  // ID du produit
      iduser: ['', [Validators.required]],  // ID de l'utilisateur
    });
  }

  // Sélectionner une photo
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Soumettre le formulaire pour créer une commande
  addOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValues = this.orderForm.value;

    // Append form data values
    for (const key in formValues) {
      if (formValues[key]) {
        formData.append(key, formValues[key]);
      }
    }

    // Append selected file if any
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    // Extracting iduser and idProduct from the form
    const iduser = formValues.iduser;
    const idproduit = formValues.idProduct;

    // Construct the API URL dynamically
    const url = `http://localhost:8764/Commande/createUP/${iduser}/${idproduit}`;

    // Envoi de la requête POST
    this.http.post(url, formData).subscribe({
      next: (res: any) => {
        console.log("Réponse de l'API :", res);
        alert("Commande ajoutée avec succès ! ");
        if (res.status === 'success') {
          alert('Commande ajoutée avec succès !');

          this.orderForm.reset();
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de la commande :", err);
        alert(err.error?.message || "Erreur lors de l'ajout de la commande.");
      }
    });
  }
    
    
}
