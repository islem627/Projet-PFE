import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-addusers',
  templateUrl: './addusers.component.html',
  styleUrls: ['./addusers.component.css']
})
export class AddusersComponent implements OnInit {
  registerForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private compteService: AllmyservicesService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z]+$')]],
      lastname: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z]+$')]],
      role: ['', [Validators.required]],
      photo: [null]
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  register(): void {
    console.log('Form submitted');
    console.log(this.registerForm.value);
    console.log('Form submitted after ');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValues = this.registerForm.value;

    for (const key in formValues) {
      if (formValues[key]) {
        formData.append(key, formValues[key]);
      }
    }

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

   this.http.post('http://localhost:8762/User/register', formData).subscribe({
  next: (res: any) => {
    console.log("Réponse de l'API :", res);
    if (res.status === 'success') {
      alert('Inscription réussie !');
      this.registerForm.reset();
    }
  },
  error: (err) => {
    console.error("Erreur lors de l'inscription :", err);
    alert(err.error?.message || "Erreur lors de l'inscription.");
  }
});

  }
}
