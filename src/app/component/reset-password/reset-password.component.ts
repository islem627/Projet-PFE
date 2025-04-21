import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AllmyservicesService } from '../../services/allmyservices.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private service: AllmyservicesService,
    private route: ActivatedRoute  // Pour récupérer le token de l'URL
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Récupérer le token de l'URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.errorMessage = 'Aucun token de réinitialisation trouvé dans l\'URL.';
      }
    });
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { newPassword } = this.resetPasswordForm.value;
    const token = this.route.snapshot.queryParamMap.get('token');  // Récupérer le token de l'URL

    if (!token) {
      this.errorMessage = 'Token de réinitialisation manquant.';
      return;
    }

    // Appel de la méthode 'resetPassword' du service
    this.service.resetPassword(token, newPassword)
      .subscribe({
        next: (res) => {
          this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
        },
        error: (err) => {
          console.error('Erreur lors de la réinitialisation du mot de passe :', err);
          this.errorMessage = 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
        }
      });
  }
}
