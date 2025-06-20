import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-updateorder',
  templateUrl: './updateorder.component.html',
  styleUrls: ['./updateorder.component.css']
})
export class UpdateorderComponent implements OnInit {
  orderId: string | null = '';
  order: Commande = {} as Commande;
  originalOrder: Commande = {} as Commande;
  editingField: string | null = null;
  isEditing: { [key: string]: boolean } = {};
  editValues: Partial<Commande> = {};
  showSuccessAlert: boolean = false; // Added for success alert

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
      next: (res: Commande) => {
        this.order = res;
        this.originalOrder = { ...res };
        this.editValues = { ...res };
        console.log('Détails de la commande:', this.order);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la commande', err);
        alert('Erreur lors du chargement de la commande: ' + err.message);
      }
    });
  }

  cancelChanges() {
    this.order = { ...this.originalOrder };
    this.isEditing = {};
    this.editValues = { ...this.originalOrder };
    this.showSuccessAlert = false; // Hide alert on cancel
  }

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

    const payload: Partial<Commande> = { [field]: this.order[field] };

    this.service.updateorder(this.orderId, payload).subscribe({
      next: (updatedOrder: Commande) => {
        console.log('Champ mis à jour:', updatedOrder);
        this.order = updatedOrder;
        this.originalOrder = { ...updatedOrder };
        this.isEditing[field] = false;
        this.showSuccessAlert = true; // Show success alert
        setTimeout(() => this.hideAlert(), 3000); // Auto-hide after 3 seconds
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour du champ "${field}"`, err);
        alert(`Erreur lors de la mise à jour du champ "${field}": ${err.message}`);
      }
    });
  }

  submitAll() {
    if (!this.orderId) return;

    this.service.updateorder(this.orderId, this.order).subscribe({
      next: (updatedOrder: Commande) => {
        console.log('Commande mis à jour avec succès:', updatedOrder);
        this.order = updatedOrder;
        this.originalOrder = { ...updatedOrder };
        this.isEditing = {};
        this.showSuccessAlert = true; // Show success alert
        setTimeout(() => this.hideAlert(), 3000); // Auto-hide after 3 seconds
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
        alert('Erreur lors de la mise à jour: ' + err.message);
      }
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
    if (this.order[field] === newValue) return;

    this.order[field] = (field === 'total' || field === 'remise' || field === 'fraisLivraison' ||
                        field === 'latitude' || field === 'longitude' || field === 'longueur_cm' ||
                        field === 'largeur_cm' || field === 'hauteur_cm' || field === 'poids_grammes' ||
                        field === 'noteClient')
      ? parseFloat(newValue)
      : newValue;

    const payload: Partial<Commande> = { [field]: this.order[field] };

    if (!this.orderId) return;

    this.service.updateorder(this.orderId, payload).subscribe({
      next: (updatedOrder: Commande) => {
        console.log(`${field} mis à jour avec succès`, updatedOrder);
        this.order = updatedOrder;
        this.originalOrder = { ...updatedOrder };
        this.showSuccessAlert = true; // Show success alert
        setTimeout(() => this.hideAlert(), 3000); // Auto-hide after 3 seconds
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour de ${field}`, err);
        alert(`Erreur lors de la mise à jour de ${field}: ${err.message}`);
      }
    });
  }

  hideAlert() {
    this.showSuccessAlert = false; // Hide the success alert
  }
}