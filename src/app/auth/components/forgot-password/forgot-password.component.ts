import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly isSubmitSuccessful = signal(false);
  readonly hasServerError = signal(false);

  readonly forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.hasServerError.set(false);
    this.isSubmitting.set(true);

    const { email } = this.forgotPasswordForm.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => this.handleSuccess(),
      error: () => this.handleError(),
    });
  }

  private handleSuccess(): void {
    this.isSubmitting.set(false);
    this.isSubmitSuccessful.set(true);
  }

  private handleError(): void {
    this.isSubmitting.set(false);
    this.hasServerError.set(true);
  }
}
