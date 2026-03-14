import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator, passwordMatchValidator } from '../../validators/password.validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly isResetSuccessful = signal(false);
  readonly isTokenMissing = signal(false);
  readonly isTokenExpired = signal(false);
  readonly hasServerError = signal(false);

  readonly resetPasswordForm: FormGroup = this.formBuilder.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  private resetToken: string | null = null;

  ngOnInit(): void {
    this.resetToken = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (!this.resetToken) {
      this.isTokenMissing.set(true);
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || this.isTokenMissing()) {
      return;
    }

    this.resetErrorSignals();
    this.isSubmitting.set(true);

    const { password } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.resetToken!, password).subscribe({
      next: () => this.handleSuccess(),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private resetErrorSignals(): void {
    this.isTokenExpired.set(false);
    this.hasServerError.set(false);
  }

  private handleSuccess(): void {
    this.isSubmitting.set(false);
    this.isResetSuccessful.set(true);
  }

  private handleError(error: HttpErrorResponse): void {
    this.isSubmitting.set(false);
    if (error.status === 400) {
      this.isTokenExpired.set(true);
      return;
    }
    this.hasServerError.set(true);
  }
}
