import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    id: null as number | null,
    username: '',
    email: '',
    phone: '',
    password: '',
    firstname: '',
    lastname: '',
    address: '',
    gouvernorat: '',
    role: '',
    disponible: true,
    photo: '',
    file: null as File | null,
    filePreview: ''
  };
  showPasswordSection = false;
  imageError: boolean = false;
  baseImageUrl: string = `${environment.baseUrlUser}/files/`;

  constructor(
    private allmyservices: AllmyservicesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    console.log('loadUserProfile appelé');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.currentUser?.iduser) {
      console.log('AuthService currentUser:', this.authService.currentUser);
      this.user.id = this.authService.currentUser.iduser;
      this.fetchUserDetails();
    } else {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('localStorage currentUser:', user);
      if (user && user.id) {
        this.user.id = user.id;
        this.fetchUserDetails();
      } else {
        console.error('Aucun ID utilisateur trouvé');
        this.router.navigate(['/login']);
      }
    }
  }

  fetchUserDetails(): void {
    if (!this.user.id) {
      console.error('ID utilisateur manquant pour fetchUserDetails');
      this.router.navigate(['/login']);
      return;
    }

    console.log('fetchUserDetails appelé pour ID:', this.user.id);
    this.allmyservices.DetailsUser(this.user.id.toString()).subscribe(
      (response: any) => {
        console.log('Réponse DetailsUser:', response);
        this.user.id = response.id;
        this.user.username = response.username || '';
        this.user.email = response.email || '';
        this.user.phone = response.phone || '';
        this.user.firstname = response.firstname || '';
        this.user.lastname = response.lastname || '';
        this.user.address = response.address || '';
        this.user.gouvernorat = response.gouvernorat || '';
        this.user.role = response.role || response.roles?.[0] || 'USER';
        this.user.disponible = response.confirme ?? true;
        this.user.photo = response.photo ? response.photo.split('/').pop() : '';
        this.user.filePreview = this.user.photo ? `${this.baseImageUrl}${this.user.photo}` : '';
        console.log('Utilisateur chargé depuis API:', this.user);
        localStorage.setItem('currentUser', JSON.stringify({
          id: this.user.id,
          username: this.user.username,
          email: this.user.email,
          phone: this.user.phone,
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          address: this.user.address,
          gouvernorat: this.user.gouvernorat,
          role: this.user.role,
          disponible: this.user.disponible,
          photo: this.user.photo
        }));
        this.imageError = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l’utilisateur:', error);
        alert('Impossible de récupérer les informations de l’utilisateur. Veuillez vous reconnecter.');
        this.router.navigate(['/login']);
      }
    );
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(file.type)) {
        this.user.file = file;
        this.user.filePreview = URL.createObjectURL(file);
        console.log('Fichier sélectionné:', this.user.file);
        this.imageError = false;
      } else {
        console.error('Type de fichier invalide:', file.type);
        alert('Veuillez sélectionner une image (JPEG, PNG ou GIF).');
        this.user.file = null;
        this.user.filePreview = this.user.photo ? `${this.baseImageUrl}${this.user.photo}` : '';
      }
    } else {
      this.user.file = null;
      this.user.filePreview = this.user.photo ? `${this.baseImageUrl}${this.user.photo}` : '';
      console.log('Aucun fichier sélectionné');
    }
  }

  updateProfile(): void {
    console.log('updateProfile appelé, user:', this.user);
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
      console.error('Token manquant');
      alert('Utilisateur non authentifié. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.user.id) {
      console.error('ID utilisateur manquant');
      alert('ID utilisateur manquant. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    let fieldCount = 0;

    if (this.user.username) {
      formData.append('username', this.user.username);
      fieldCount++;
    }
    if (this.user.email) {
      formData.append('email', this.user.email);
      fieldCount++;
    }
    if (this.user.password) {
      formData.append('password', this.user.password);
      fieldCount++;
    }
    if (this.user.phone) {
      formData.append('phone', this.user.phone);
      fieldCount++;
    }
    if (this.user.firstname) {
      formData.append('firstname', this.user.firstname);
      fieldCount++;
    }
    if (this.user.lastname) {
      formData.append('lastname', this.user.lastname);
      fieldCount++;
    }
    if (this.user.address) {
      formData.append('address', this.user.address);
      fieldCount++;
    }
    if (this.user.gouvernorat) {
      formData.append('gouvernorat', this.user.gouvernorat);
      fieldCount++;
    }
    formData.append('confirme', this.user.disponible.toString());
    fieldCount++;

    if (this.user.file) {
      formData.append('file', this.user.file, this.user.file.name);
      console.log('Fichier ajouté à FormData:', this.user.file.name);
      fieldCount++;
    }

    if (fieldCount === 0) {
      console.warn('Aucune donnée à mettre à jour');
      alert('Veuillez modifier au moins un champ ou ajouter une photo.');
      return;
    }

    this.allmyservices.updateUserProfile_(formData, token, this.user.id).subscribe(
      (response: any) => {
        console.log('Réponse du backend:', response);
        alert('Profil mis à jour avec succès.');
        localStorage.setItem('currentUser', JSON.stringify({
          id: this.user.id,
          username: response.username || this.user.username,
          email: response.email || this.user.email,
          phone: response.phone || this.user.phone,
          firstname: response.firstname || this.user.firstname,
          lastname: response.lastname || this.user.lastname,
          address: response.address || this.user.address,
          gouvernorat: response.gouvernorat || this.user.gouvernorat,
          role: response.role || this.user.role,
          disponible: response.confirme ?? this.user.disponible,
          photo: response.photo || this.user.photo
        }));
        this.user.password = '';
        this.user.file = null;
        this.user.photo = response.photo || this.user.photo;
        this.user.filePreview = this.user.photo ? `${this.baseImageUrl}${this.user.photo}` : '';
        this.showPasswordSection = false;
        this.imageError = false;
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        const errorMessage = error.error?.message || error.message || 'Erreur lors de la mise à jour du profil.';
        alert(errorMessage);
      }
    );
  }

  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.user.password = '';
    }
    console.log('showPasswordSection:', this.showPasswordSection);
  }

  onImageError(): void {
    this.imageError = true;
    console.error('Erreur de chargement de l\'image:', this.user.photo);
    this.user.filePreview = '';
  }
}