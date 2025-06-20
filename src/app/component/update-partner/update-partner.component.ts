import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-update-partner',
  templateUrl: './update-partner.component.html',
  styleUrls: ['./update-partner.component.css']
})
export class UpdatePartnerComponent implements OnInit {
  partnerId: string | null = '';
  partner: any = {};
  originalpartner: any = {};
  editingField: string | null = null;
  editValues: any = {};
  isEditing: { [key: string]: boolean } = {};
  showSuccessAlert: boolean = false; // Variable pour contrôler l'alerte

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private service: AllmyservicesService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
    if (this.partnerId) {
      this.getpartnerDetails(this.partnerId);
    }
  }

  getpartnerDetails(id: string) {
    this.service.DetailsUser(id).subscribe({
      next: res => {
        this.partner = res;
        this.originalpartner = { ...res };
        this.editValues = { ...res };
        console.log('Détails de l\'utilisateur:', this.partner);
      },
      error: err => console.error('Erreur lors du chargement de l\'utilisateur', err)
    });
  }

  cancelChanges() {
    this.partner = { ...this.originalpartner };
    this.isEditing = {};
    this.showSuccessAlert = false; // Cacher l'alerte lors de l'annulation
  }

 onPhotoSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length || !this.partnerId) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file); // Nom 'file' pour correspondre à @RequestPart("file")

  this.service.UpdateUser(this.partnerId, formData).subscribe({
    next: () => {
      console.log('Photo de l\'utilisateur mise à jour');
      this.getpartnerDetails(this.partnerId!); // Recharger les détails de l'utilisateur
      this.showSuccessAlert = true; // Afficher l'alerte
      this.hideAlertAfterDelay(); // Cacher après 3 secondes
    },
    error: err => {
      console.error('Erreur lors de la mise à jour de la photo', err);
      // Optionnel : Afficher une alerte d'erreur
    }
  });
}

  toggleEdit(field: string, currentValue: any) {
    this.isEditing[field] = !this.isEditing[field];
    if (this.isEditing[field]) {
      this.editValues[field] = currentValue;
    } else {
      this.submitField(field);
    }
  }

  submitField(field: string) {
    if (!this.partnerId) return;

    this.partner[field] = this.editValues[field];

    const payload: any = {};
    payload[field] = this.partner[field];

    this.service.UpdateUser(this.partnerId, payload).subscribe({
      next: () => {
        console.log(`${field} mis à jour avec succès`);
        this.getpartnerDetails(this.partnerId!);
        this.isEditing[field] = false;
        this.showSuccessAlert = true; // Afficher l'alerte
        this.hideAlertAfterDelay(); // Cacher après 3 secondes
      },
      error: err => console.error(`Erreur lors de la mise à jour du champ ${field}`, err)
    });
  }

  submitAll() {
    if (!this.partnerId) return;

    this.service.UpdateUser(this.partnerId, this.partner).subscribe({
      next: () => {
        console.log('Utilisateur mis à jour avec succès');
        this.showSuccessAlert = true; // Afficher l'alerte
        this.hideAlertAfterDelay(); // Cacher après 3 secondes
      },
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
    if (this.partner[field] == newValue) return;

    this.partner[field] = (field === 'phone') // Ajusté pour ne vérifier que 'phone' comme champ numérique
      ? parseFloat(newValue)
      : newValue;

    const payload: any = {};
    payload[field] = this.partner[field];

    if (!this.partnerId) return;

    this.service.UpdateUser(this.partnerId, payload).subscribe({
      next: () => {
        console.log(`${field} mis à jour avec succès`);
        this.showSuccessAlert = true; // Afficher l'alerte
        this.hideAlertAfterDelay(); // Cacher après 3 secondes
      },
      error: err => console.error(`Erreur lors de la mise à jour de ${field}`, err)
    });
  }

  // Méthode pour cacher l'alerte après un délai
  hideAlertAfterDelay() {
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000); // Cacher après 3 secondes
  }

  // Méthode pour cacher l'alerte manuellement
  hideAlert() {
    this.showSuccessAlert = false;
  }
}