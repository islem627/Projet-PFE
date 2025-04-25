import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-updateadmin',
  templateUrl: './updateadmin.component.html',
  styleUrls: ['./updateadmin.component.css']
})
export class UpdateadminComponent implements OnInit {
  adminId: string | null = '';
  admin: any = {};
  originalUser: any = {}; // Ajouter cette ligne pour gérer l'original de l'utilisateur
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
    this.adminId = this.route.snapshot.paramMap.get('id');
    if (this.adminId) {
      this.getAdmins(this.adminId);
    }
  }

  getAdmins(id: string) {
    this.service.DetailsUser(id).subscribe({
      next: res => {
        this.admin = res;
        this.originalUser = { ...res }; // Initialiser `originalUser` ici
        this.editValues = { ...res }; // Initialiser les valeurs éditables
        console.log('Détails de l\'utilisateur:', this.admin);
              },
      error: err => console.error('Erreur lors du chargement de l\'utilisateur', err)
    });
  }

  cancelChanges() {
    // Réinitialiser tous les champs aux valeurs d'origine (avant modification)
    this.admin = { ...this.originalUser }; // Utiliser `originalUser` pour restaurer l'état initial
    this.isEditing = {}; // Réinitialiser l'état des champs en mode lecture
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.adminId) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    this.service.AjouterUser(this.adminId, formData).subscribe({
      next: () => {
        console.log('Photo de l\'utilisateur mise à jour');
        this.getAdmins(this.adminId!);
      },
      error: err => console.error('Erreur lors de la mise à jour de la photo', err)
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
    if (!this.adminId) return;

    this.admin[field] = this.editValues[field];

    const payload: any = {};
    payload[field] = this.admin[field];

    this.service.UpdateUser(this.adminId, payload).subscribe({
      next: () => {
        console.log(`${field} mis à jour avec succès`);
        this.getAdmins(this.adminId!);
        this.isEditing[field] = false;
      },
      error: err => console.error(`Erreur lors de la mise à jour du champ ${field}`, err)
    });
  }

  submitAll() {
    if (!this.adminId) return;

    this.service.UpdateUser(this.adminId, this.admin).subscribe({
      next: () => console.log('Utilisateur mis à jour avec succès'),
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
    if (this.admin[field] == newValue) return;

    this.admin[field] = (field === 'age' || field === 'phone') // Exemples de champs numériques, ajustez selon votre besoin
      ? parseFloat(newValue)
      : newValue;

    const payload: any = {};
    payload[field] = this.admin[field];

    if (!this.adminId) return;

    this.service.UpdateUser(this.adminId, payload).subscribe({
      next: () => console.log(`${field} mis à jour avec succès`),
      error: err => console.error(`Erreur lors de la mise à jour de ${field}`, err)
    });
  }
}
