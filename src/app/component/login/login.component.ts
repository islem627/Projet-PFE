/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompteService } from '../../compte.service';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';  // Le chemin relatif dépend de la structure des dossiers

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  rightPanelActive = false;
  username: string = '';
  password: string = '';
  resultatlogin: any ;
  selectedFile: File | null = null;
  submitted = false;


  constructor(private fb: FormBuilder, private compteService: AllmyservicesService , private router :Router  ,private http: HttpClient // ✅ Ajouter cette dépendance
  ) {
    
    this.registerForm = this.fb.group({
      firstname: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.pattern('^[a-zA-Z]+$')  // Permet uniquement des lettres (majuscule et minuscule)
      ]],
      lastname: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      username: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      role: ['', [Validators.required]]
    });
  }
  activateRegister() {
    this.rightPanelActive = true;
  }
    activateLogin() {

    this.rightPanelActive = false;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    
    });
    }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


    register(): void {
      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        return;
      }
  
      const formData = new FormData();
      const form = this.registerForm.value;
  
      for (const key in form) {
        formData.append(key, form[key]);
      }
  
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }
    
      // Envoi vers backend
      this.http.post('http://localhost:8762/User/register', formData).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            console.log(' Utilisateur enregistré avec succès :', res);
            alert('Inscription réussie !');
            this.registerForm.reset();
          } else {
            alert(res.message || "Une erreur s'est produite.");
          }
        },
        error: (err) => {
          console.error(' Erreur lors de l’inscription :', err);
          alert(err.error?.message || "Erreur lors de l'inscription.");
        }
      });
    }
    
login() {
  console.log("🔐 Méthode de connexion déclenchée");

  // Vérification que le formulaire est valide
  if (this.loginForm.invalid) {
    console.warn("⚠️ Formulaire invalide !");
    return;
  }

  // Création d'un FormData à partir des valeurs du formulaire
  const formData = new FormData();
  const username = this.loginForm.get('username')?.value;
  const password = this.loginForm.get('password')?.value;

  console.log("Données envoyées :", { username, password });

  // Ajout des données au FormData
  formData.append('username', username);
  formData.append('password', password);

  // Appel à la méthode de connexion dans le service
  this.compteService.signin(formData).subscribe({
    next: (res: AuthResponse) => {
      console.log("✅ Succès de connexion :", res);
      this.resultatlogin = res;

      // Sauvegarde des données dans le localStorage
      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('role', res.role);
      localStorage.setItem('username', res.username);
      localStorage.setItem('email', res.email);

      // Récupération du rôle pour rediriger l'utilisateur vers la page appropriée
      const role = res.role;

      // Redirection en fonction du rôle de l'utilisateur
      if (role === 'ROLE_admin') {
        this.router.navigate(['/home']);
      } else if (role === 'ROLE_client') {
        this.router.navigate(['/pageclient']);
      } else if (role === 'ROLE_livreur') {
        this.router.navigate(['/livreur']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      console.error("❌ Erreur de connexion :", err);
      alert("Nom d'utilisateur ou mot de passe incorrect");
    }
  });
}


}
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';
import { AuthService } from '../../services/auth.service'; // Ajouter cette importation
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent 
implements OnInit {
  gouvernorat: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  selectedGovernorate: string;

  loginForm: FormGroup;
  registerForm: FormGroup;
  rightPanelActive = false;
  username: string = '';
  password: string = '';
  resultatlogin: any;
  selectedFile: File | null = null;
  submitted = false;
  email: string = '';
  message: string = '';
  error: string = '';
  showResetBubble: boolean = false; // Déclarer showResetBubble

  
  
  constructor(
    private fb: FormBuilder,
    private compteService: AllmyservicesService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService, 
    private toastr : ToastrService  ) {
      
    this.registerForm = this.fb.group({
      firstname: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      lastname: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z]+$')
      ]],
      role: ['', [Validators.required]],
      gouvernorat: ['', [Validators.required]],
      photo: [null]
    });

  }

  activateRegister() {
    this.rightPanelActive = true;
  }

  activateLogin() {
    this.rightPanelActive = false;
  }


  ngOnInit(): void {
   
      console.log(this.gouvernorat);  // Vérifie que la liste des gouvernorats est correctement initialisée
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

 onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


    /*onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string; // Stocker l'URL de l'image
        };
        reader.readAsDataURL(file);
      }
    }*/

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const form = this.registerForm.value;

    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.http.post('http://localhost:8762/User/register', formData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          console.log('Utilisateur enregistré avec succès :', res);
          alert('Inscription réussie !');
          this.registerForm.reset();
        } else {
          alert(res.message || "Une erreur s'est produite.");
        }
      },
      error: (err) => {
        console.error('Erreur lors de l’inscription :', err);
        alert(err.error?.message || "Erreur lors de l'inscription.");
      }
    });
  }

  login() {
    console.log("🔐 Méthode de connexion déclenchée");

    if (this.loginForm.invalid) {
      console.warn("⚠️ Formulaire invalide !");
      return;
    }

    const formData = new FormData();
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    console.log("Données envoyées :", { username, password });

    formData.append('username', username);
    formData.append('password', password);

    this.compteService.signin(formData).subscribe({
      next: (res: AuthResponse) => {
        console.log("✅ Succès de connexion :", res);
        this.resultatlogin = res;

        // Sauvegarde des données dans le localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('iduser', res.id.toString()); // Ajouter iduser

        // Mettre à jour AuthService.currentUser
        this.authService.currentUser = {
          iduser: res.id,
          username: res.username
        };
        console.log('AuthService.currentUser défini :', this.authService.currentUser);

        const role = res.role;

        if (role === 'ROLE_admin') {
          this.router.navigate(['/home']);
        } else if (role === 'ROLE_client') {
          this.router.navigate(['/pageclient']);
        } else if (role === 'ROLE_livreur') {
          this.router.navigate(['/livreur']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error("❌ Erreur de connexion :", err);
        alert("Nom d'utilisateur ou mot de passe incorrect");
      }
    });
  }
 
  forgotPassword(): void {
    this.showResetBubble = true; // Afficher la bulle
    this.email = ''; // Réinitialiser le champ
    this.message = null;
    this.error = null;
  }

  closeResetPassword(event?: Event): void {
    if (event?.target === event?.currentTarget || !event) {
      this.showResetBubble = false; // Fermer la bulle
    }
  }


  showResetPassword(): void {
    this.showResetBubble = true; // Afficher la bulle
    this.email = ''; // Réinitialiser le champ
    this.message = null;
    this.error = null;
  }
  resetPassword(): void {
    this.compteService.forgetpassword(this.email).subscribe({
      next: (res) => {
        this.message = res.message || 'Un email a été envoyé avec le nouveau mot de passe.';
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la réinitialisation du mot de passe.';
        this.message = '';
      }
    });
  }
  
}

