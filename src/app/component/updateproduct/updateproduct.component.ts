import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.css']
})


export class UpdateproductComponent implements OnInit {
  productId: string | null = '';
  product: any = {};
  originalProduct: any = {}; // Ajouter cette ligne
  editingField: string | null = null;

  editValues: any = {};
  isEditing: { [key: string]: boolean } = {};

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private service: AllmyservicesService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.getProductDetails(this.productId);
    }
  }
  getProductDetails(id: string) {
    this.service.DetailsProduct(id).subscribe({
      next: res => {
        this.product = res;
        this.originalProduct = { ...res }; // Initialiser `originalProduct` ici
        this.editValues = { ...res }; // Initialiser les valeurs éditables
        console.log('Détails du produit:', this.product);
      },
      error: err => console.error('Erreur lors du chargement du produit', err)
    });
  }

  cancelChanges() {
    // Réinitialiser tous les champs aux valeurs d'origine (avant modification)
    this.product = { ...this.originalProduct }; // Utiliser `originalProduct` pour restaurer l'état initial
    this.isEditing = {}; // Réinitialiser l'état des champs en mode lecture
  }
  
  // Autres méthodes...


  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.productId) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    this.service.updateProduct(this.productId, formData).subscribe({
      next: () => {
        console.log('Photo du produit mise à jour');
        this.getProductDetails(this.productId!);
      },
      error: err => console.error('Erreur lors de la mise à jour de la photo', err)
    });
  }
//
  toggleEdit(field: string, currentValue: any) {
    this.isEditing[field] = !this.isEditing[field];
    if (this.isEditing[field]) {
      this.editValues[field] = currentValue;
    } else {
      this.submitField(field);
    }
  }

  submitField(field: string) {
    if (!this.productId) return;

    this.product[field] = this.editValues[field];

    const payload: any = {};
    payload[field] = this.product[field];

    this.service.updateProduct(this.productId, payload).subscribe({
      next: () => {
        console.log(`${field} mis à jour avec succès`);
        this.getProductDetails(this.productId!);
        this.isEditing[field] = false;
      },
      error: err => console.error(`Erreur lors de la mise à jour du champ ${field}`, err)
    });
  }

  submitAll() {
    if (!this.productId) return;

    this.service.updateProduct(this.productId, this.product).subscribe({
      next: () => console.log('Produit mis à jour avec succès'),
      error: err => console.error('Erreur lors de la mise à jour', err)
    });
  }

  startEditing(field: string, td: HTMLElement) {
    this.editingField = field;
    this.renderer.setAttribute(td, 'contenteditable', 'true');
    td.focus();
  }

  onBlur(field: string, td: HTMLElement) {
    this.renderer.removeAttribute(td, 'contenteditable');
    this.editingField = null;

    const newValue = td.innerText.trim();
    if (this.product[field] == newValue) return;

    this.product[field] = (field === 'price' || field === 'quantity')
      ? parseFloat(newValue)
      : newValue;

    const payload: any = {};
    payload[field] = this.product[field];

    if (!this.productId) return;

    this.service.updateProduct(this.productId, payload).subscribe({
      next: () => console.log(`${field} mis à jour avec succès`),
      error: err => console.error(`Erreur lors de la mise à jour de ${field}`, err)
    });
  
  }



}
