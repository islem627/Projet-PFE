import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    username: '',
    email: '',
    phone: '',
    password: '',
    file: null as File | null // Typage explicite pour le fichier
  };
  showPasswordSection = false;

  constructor(private allmyservices: AllmyservicesService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Charger le profil de l'utilisateur au démarrage
  loadUserProfile(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user) {
      this.user.username = user.username || '';
      this.user.email = user.email || '';
      this.user.phone = user.phone || '';
      console.log('Utilisateur chargé depuis localStorage:', user);
    } else {
      console.error('Aucun utilisateur trouvé dans localStorage');
    }
  }

  // Méthode pour gérer le changement de fichier
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.user.file = event.target.files[0];
      console.log('Fichier sélectionné:', this.user.file);
    } else {
      this.user.file = null;
    }
  }

  // Méthode pour mettre à jour le profil
  updateProfile(): void {
    const token = localStorage.getItem('token');
    console.log('Token envoyé:', token); // Log pour déboguer

    if (!token) {
      alert('Utilisateur non authentifié. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }

    // Créer un FormData pour envoyer les données en multipart/form-data
    const formData = new FormData();
    // Envoyer uniquement les champs non vides
    if (this.user.username) formData.append('username', this.user.username);
    if (this.user.email) formData.append('email', this.user.email);
    if (this.user.phone) formData.append('phone', this.user.phone);
    if (this.user.file) formData.append('file', this.user.file);

    this.allmyservices.updateUserProfile(formData, token).subscribe(
      (response: any) => {
        console.log('Réponse du backend:', response);
        alert(response || 'Profil mis à jour avec succès.');
        // Mettre à jour localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          username: this.user.username,
          email: this.user.email,
          phone: this.user.phone
        }));
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        const errorMessage = error.error || 'Erreur lors de la mise à jour du profil.';
        alert(errorMessage);
      }
    );
  }

  // Méthode pour changer le mot de passe
  changePassword(): void {
    if (!this.user.password) {
      alert('Veuillez entrer un nouveau mot de passe.');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Token pour changement de mot de passe:', token);

    if (!token) {
      alert('Utilisateur non authentifié. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }

    // Envoyer le mot de passe via l'API updateProfile
    const formData = new FormData();
    formData.append('password', this.user.password);

    this.allmyservices.updateUserProfile(formData, token).subscribe(
      (response: any) => {
        console.log('Réponse du backend (mot de passe):', response);
        alert(response || 'Mot de passe modifié avec succès.');
        this.showPasswordSection = false;
        this.user.password = ''; // Réinitialiser le champ
      },
      (error) => {
        console.error('Erreur lors du changement de mot de passe:', error);
        const errorMessage = error.error || 'Erreur lors du changement de mot de passe.';
        alert(errorMessage);
      }
    );
  }
}