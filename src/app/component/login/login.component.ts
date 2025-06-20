

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllmyservicesService } from '../../services/allmyservices.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../models/auth-response';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotifserviceService } from 'src/app/services/notifservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  gouvernorat: string[] = [
    'Ariana',
    'Béja',
    'Ben Arous',
    'Bizerte',
    'Gabès',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kébili',
    'Le Kef',
    'Mahdia',
    'La Manouba',
    'Médenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis',
    'Zaghouan',
  ];

  loginForm: FormGroup;
  registerForm: FormGroup;
  rightPanelActive = false;
  selectedFile: File | null = null;
  submitted = false;
  showResetBubble = false;
  email = '';
  message = '';
  error = '';
  username: string = '';
  password: string = '';
  resultatlogin: any;

  constructor(
    private fb: FormBuilder,
    private compteService: AllmyservicesService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private notifService: NotifserviceService
  ) {
    this.registerForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      role: ['', [Validators.required]],
      gouvernorat: ['', [Validators.required]],
      photo: [null, [Validators.required]],
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  activateRegister() {
    this.rightPanelActive = true;
  }

  activateLogin() {
    this.rightPanelActive = false;
  }

  ngOnInit(): void {
    console.log(this.gouvernorat);
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'File size must be less than 5MB.',
          confirmButtonColor: '#4caf50',
        });
        return;
      }
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Only PNG and JPEG images are allowed.',
          confirmButtonColor: '#4caf50',
        });
        return;
      }
      this.selectedFile = file;
      this.registerForm.patchValue({ photo: file });
      this.registerForm.get('photo')?.markAsTouched();
    }
  }

  register(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#4caf50',
      });
      return;
    }

    const formData = new FormData();
    const form = this.registerForm.value;

    const requiredFields = [
      'firstname',
      'lastname',
      'email',
      'password',
      'address',
      'phone',
      'username',
      'role',
      'gouvernorat',
    ];

    for (const key of requiredFields) {
      if (!form[key]) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `Field ${key} is required.`,
          confirmButtonColor: '#4caf50',
        });
        return;
      }
      formData.append(key, form[key]);
    }

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Missing Photo',
        text: 'Please upload a photo.',
        confirmButtonColor: '#4caf50',
      });
      return;
    }

    console.log('Form data to send:', {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
      address: form.address,
      phone: form.phone,
      username: form.username,
      role: form.role,
      gouvernorat: form.gouvernorat,
      file: this.selectedFile ? this.selectedFile.name : null,
    });

    this.http.post('http://localhost:8762/User/register', formData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Account Created',
            text: 'Registration successful! Please check your email to confirm.',
            confirmButtonColor: '#4caf50',
          });
          this.registerForm.reset();
          this.selectedFile = null;
          this.submitted = false;
          this.rightPanelActive = false;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: res.message || 'An error occurred during registration.',
            confirmButtonColor: '#4caf50',
          });
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        console.log('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message,
          error: err.error,
        });
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.error?.message || 'An error occurred during registration.',
          confirmButtonColor: '#4caf50',
        });
      },
    });
  }

login() {
  console.log('🔐 Méthode de connexion déclenchée');

  if (this.loginForm.invalid) {
    console.warn('⚠️ Formulaire invalide !');
    Swal.fire({
      icon: 'error',
      title: 'Invalid Form',
      text: 'Please fill in all required fields.',
      confirmButtonColor: '#4caf50',
    });
    return;
  }

  const formData = new FormData();
  const username = this.loginForm.get('username')?.value;
  const password = this.loginForm.get('password')?.value;

  console.log('Données envoyées :', { username, password });

  formData.append('username', username);
  formData.append('password', password);

  this.compteService.signin(formData).subscribe({
    next: (res: AuthResponse) => {
      console.log('✅ Succès de connexion :', res);
      console.log('🆔 ID du partenaire connecté :', res.id); // Affiche l'iduser dans la console
      this.resultatlogin = res;

      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('role', res.role);
      localStorage.setItem('username', res.username);
      localStorage.setItem('email', res.email);
      localStorage.setItem('iduser', res.id.toString());
      this.notifService.connect(username);

      this.authService.currentUser = {
        iduser: res.id,
        username: res.username,
      };
      console.log('AuthService.currentUser défini :', this.authService.currentUser);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have been successfully logged in!',
        confirmButtonColor: '#4caf50',
      });

      const role = res.role;
      if (role === 'ROLE_Admin') {
        this.router.navigate(['/home']);
      } else if (role === 'ROLE_Client') {
        this.router.navigate(['/pageclient']);
      } else if (role === 'ROLE_Delivery Person') {
        this.router.navigate(['/livreur']);
      } else if (role === 'ROLE_partner') {
        this.router.navigate(['/partner']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      console.error('❌ Erreur de connexion :', err);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password.',
        confirmButtonColor: '#4caf50',
      });
    },
  });
}

  forgotPassword(): void {
    this.showResetBubble = true;
    this.email = '';
  }

  closeResetPassword(event?: Event): void {
    if (event?.target === event?.currentTarget || !event) {
      this.showResetBubble = false;
    }
  }

  showResetPassword(): void {
    this.showResetBubble = true;
    this.email = '';
  }

  resetPassword(): void {
    // Vérifier si l'email est vide
    if (!this.email) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#4caf50',
      });
      return;
    }
  
    // Vérifier si l'email a un format valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Incorrect email',
        confirmButtonColor: '#4caf50',
      });
      return;
    }
  
    // Appeler le service pour réinitialiser le mot de passe
    this.compteService.forgetpassword(this.email).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Email Sent',
          text: res.message || 'A password reset email has been sent. Please check your email.',
          confirmButtonColor: '#4caf50',
        });
        this.email = '';
        this.showResetBubble = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: err.error?.message || 'An error occurred while resetting the password.',
          confirmButtonColor: '#4caf50',
        });
      },
    });
  }
}