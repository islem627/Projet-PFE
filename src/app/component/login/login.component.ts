import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompteService } from '../../compte.service';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  console.log("🔐 Login method triggered");

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
    next: (res) => {
      console.log("Succès de connexion :", res);
      this.resultatlogin = res;

      // ➕ Tu peux afficher des infos supplémentaires si tu veux
      // alert('Connexion réussie !');
      
      // Redirection après succès
      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error("Erreur de connexion :", err);
    }
  });
}
 
}

