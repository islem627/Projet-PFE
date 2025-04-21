import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllmyservicesService } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private allMyServices: AllmyservicesService  // Injectez le service
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  forgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const { email } = this.forgotPasswordForm.value;

    // Appel de la méthode 'forgotPassword' du service
    this.allMyServices.forgotPassword(email)
      .subscribe({
        next: (res) => {
          alert('Un e-mail de réinitialisation vous a été envoyé.');
          // Vous pouvez rediriger vers la page de connexion ou afficher un message
        },
        error: (err) => {
          console.error('Erreur de demande de mot de passe oublié :', err);
          this.errorMessage = 'Une erreur est survenue lors de l\'envoi du mot de passe oublié.';
        }
      });
  }
}
