import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private service: AllmyservicesService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

      this.productForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required]],
        price: ['', [Validators.required, Validators.min(0)]],
        dateAdded: ['', [Validators.required]],
        photo: [null, [Validators.required]],  // Ajout de la validation obligatoire pour le champ photo
        type: ['', [Validators.required]],
        disponiblity: [false],
        quantity: [0, [Validators.required, Validators.min(0)]]
    
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  
    addProduct(): void {
      console.log('Product form submitted');
      console.log(this.productForm.value);
    
      if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        return;
      }
    
      const formData = new FormData();
      const formValues = this.productForm.value;
    
      // Ajouter chaque champ du formulaire au FormData
      for (const key in formValues) {
        if (formValues[key] !== null && formValues[key] !== undefined) {
          if (key === 'dateAdded') {
            formData.append(key, formValues[key]);
          } else {
            formData.append(key, formValues[key]);
          }
        }
      }
    
      // Ajouter le fichier photo sous forme de base64 ou fichier normal
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);  // Utilisation de 'file' au lieu de 'photo'
      } else if (this.productForm.value.photo) {
        formData.append('file', this.productForm.value.photo);  // Envoi du base64, si nécessaire
      }
    
      // Envoi du formulaire au backend
      this.http.post('http://localhost:8763/product/createPhoto', formData).subscribe({
        next: (res: any) => {
          console.log("Réponse de l'API :", res);
          alert('Produit ajouté avec succès !');

          if (res.status === 'success') {
            alert('Produit ajouté avec succès !');
            this.productForm.reset();
          }
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout du produit :", err);
          alert(err.error?.message || "Erreur lors de l'ajout du produit.");
        }
      });
    }
    
  }