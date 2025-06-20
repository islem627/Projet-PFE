import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addusers',
  templateUrl: './addusers.component.html',
  styleUrls: ['./addusers.component.css']
})
export class AddusersComponent implements OnInit {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  submitted = false;
  gouvernorat: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  constructor(
    private fb: FormBuilder,
    private compteService: AllmyservicesService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      lastname: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      role: ['', [Validators.required]],
      gouvernorat: ['', [Validators.required]],
      photo: [null, [Validators.required]] // Photo is required
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Validate file size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'File size must be less than 5MB.',
          confirmButtonColor: '#4caf50'
        });
        return;
      }
      // Validate file type (PNG or JPEG)
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Only PNG and JPEG images are allowed.',
          confirmButtonColor: '#4caf50'
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
    console.log('Form submitted', this.registerForm.value);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    const formData = new FormData();
    const form = this.registerForm.value;

    // Define required fields
    const requiredFields = [
      'firstname', 'lastname', 'email', 'password', 'address',
      'phone', 'username', 'role', 'gouvernorat'
    ];

    // Check for missing fields
    for (const key of requiredFields) {
      if (!form[key]) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `Field ${key} is required.`,
          confirmButtonColor: '#4caf50'
        });
        return;
      }
      formData.append(key, form[key]);
    }

    // Check for photo
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name); // Use 'file' to match backend
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Missing Photo',
        text: 'Please upload a photo.',
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    // Log form data for debugging
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
      file: this.selectedFile ? this.selectedFile.name : null
    });

    this.http.post('http://localhost:8762/User/register', formData).subscribe({
      next: (res: any) => {
        console.log('Réponse de l\'API :', res);
        if (res.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Account Created',
            text: 'Registration successful! Please check your email to confirm.',
            confirmButtonColor: '#4caf50'
          });
          this.registerForm.reset();
          this.selectedFile = null;
          this.submitted = false;
          this.router.navigate(['/']); // Redirect to home
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: res.message || 'An error occurred during registration.',
            confirmButtonColor: '#4caf50'
          });
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        console.log('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message,
          error: err.error
        });
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.error?.message || 'An error occurred during registration.',
          confirmButtonColor: '#4caf50'
        });
      }
    });
  }
}