import { Component } from '@angular/core';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(private service: AllmyservicesService) {}

  resetPassword() {
    this.service.forgetpassword(this.email).subscribe({
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
