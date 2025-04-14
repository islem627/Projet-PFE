import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-updateorder',
  templateUrl: './updateorder.component.html',
  styleUrls: ['./updateorder.component.css']
})
export class UpdateorderComponent implements OnInit {
  orderId: string | null = '';
  order: any = {};
  originalOrder: any = {};
  editingField: string | null = null;
  isEditing: { [key: string]: boolean } = {};
  editValues: any = {};

  
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
    private route: ActivatedRoute,
    private service: AllmyservicesService,
        private renderer: Renderer2
    
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.getOrderDetails(this.orderId);
    }
  }

  getOrderDetails(id: string) {
    this.service.Detailsdeorder(id).subscribe({
      next: res => {
        this.order = res;
        this.originalOrder = { ...res }; // Initialiser `originalProduct` ici
        this.editValues = { ...res }; // Initialiser les valeurs éditables
        console.log('Détails du produit:', this.order);
      },
      error: err => console.error('Erreur lors du chargement du produit', err)
    });
  }
  cancelChanges() {
    // Réinitialiser tous les champs aux valeurs d'origine (avant modification)
    this.order = { ...this.originalOrder }; // Utiliser `originalProduct` pour restaurer l'état initial
    this.isEditing = {}; // Réinitialiser l'état des champs en mode lecture
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.orderId) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    this.service.updateProduct(this.orderId, formData).subscribe({
      next: () => {
        console.log('Photo du produit mise à jour');
        this.getOrderDetails(this.orderId!);
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


  submitField(field: string): void {
    if (!this.orderId) return;

    const payload: any = {};
    payload[field] = this.order[field];

    this.service.updateorder(this.orderId, payload).subscribe({
      next: () => {
        console.log(`Champ "${field}" mis à jour avec succès`);
        this.getOrderDetails(this.orderId!);
        this.isEditing[field] = false;
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour du champ "${field}"`, err);
      }
    });
  }

  submitAll() {
    if (!this.orderId) return;

    this.service.updateProduct(this.orderId, this.order).subscribe({
      next: () => console.log('Commande mise à jour avec succès mis à jour avec succès'),
      error: err => console.error('Erreur lors de la mise à jour', err)
    });
  }

  onBlur(field: string, td: HTMLElement) {
    this.renderer.removeAttribute(td, 'contenteditable');
    this.editingField = null;

    const newValue = td.innerText.trim();
    if (this.order[field] == newValue) return;

    this.order[field] = (field === 'price' || field === 'quantity')
      ? parseFloat(newValue)
      : newValue;

    const payload: any = {};
    payload[field] = this.order[field];

    if (!this.orderId) return;

    this.service.updateProduct(this.orderId, payload).subscribe({
      next: () => console.log(`${field} mis à jour avec succès`),
      error: err => console.error(`Erreur lors de la mise à jour de ${field}`, err)
    });
  
  }
  





}
