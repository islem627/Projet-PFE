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

  // Récupérer les détails de la commande
  getOrderDetails(id: string) {
    this.service.Detailsdeorder(id).subscribe({
      next: res => {
        this.order = res;
        this.originalOrder = { ...res }; // Sauvegarder l'état original
        this.editValues = { ...res }; // Initialiser les valeurs éditables
        console.log('Détails de la commande:', this.order);
      },
      error: err => console.error('Erreur lors du chargement de la commande', err)
    });
  }

  // Annuler les modifications et revenir aux valeurs originales
  cancelChanges() {
    this.order = { ...this.originalOrder };
    this.isEditing = {};
  }



  // Activer le mode édition pour un champ spécifique
  toggleEdit(field: string, currentValue: any) {
    this.isEditing[field] = !this.isEditing[field];
    if (this.isEditing[field]) {
      this.editValues[field] = currentValue;
    } else {
      this.submitField(field);
    }
  }
  

  // Soumettre la mise à jour pour un champ spécifique
  submitField(field: string): void {
    if (!this.orderId) return;
  
    const payload = { [field]: this.order[field] };
  
    this.service.updateorder(this.orderId, payload).subscribe({
      next: (updatedOrder) => {
        console.log('Commande mise à jour:', updatedOrder);
        this.order = updatedOrder; // Update the order object with the new values
        this.isEditing[field] = false; // Mark the field as not editing
        this.getOrderDetails(this.orderId!);  // Fetch the updated order details
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour du champ "${field}"`, err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }
  
  

  // Soumettre toutes les modifications
  submitAll() {
    if (!this.orderId) return;
    this.service.updateorder(this.orderId, this.order).subscribe({
      next: () => console.log('Commande mis à jour avec succès'),
      error: err => console.error('Erreur lors de la mise à jour', err)
    });

  }
  startEditing(field: string, td: HTMLElement) {
    this.editingField = field;
    this.renderer.setAttribute(td, 'contenteditable', 'true');
    td.focus();
  }


  // Gérer la sortie du mode édition
  onBlur(field: string, td: HTMLElement) {
    this.renderer.removeAttribute(td, 'contenteditable');
    this.editingField = null;
  
    const newValue = td.innerText.trim();
    if (this.order[field] == newValue) return;
  
    this.order[field] = (field === 'total' || field === 'remise')
      ? parseFloat(newValue)
      : newValue;
  
    const payload: any = {};
    payload[field] = this.order[field];
  
    if (!this.orderId) return;
  
    this.service.updateorder(this.orderId, payload).subscribe({
      next: () => console.log(`${field} mis à jour avec succès`, this.order),
      error: err => console.error(`Erreur lors de la mise à jour de ${field}`, err)
    });
  }
  
  
}
