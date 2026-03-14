import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly hasLoginError = signal(false);
  readonly isAccountLocked = signal(false);
  readonly hasServerError = signal(false);

  readonly loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.resetErrorSignals();
    this.isSubmitting.set(true);

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password, rememberMe }).subscribe({
      next: (response) => {
        this.authService.storeTokens(response);
        this.isSubmitting.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.handleLoginError(error);
      },
    });
  }

  private resetErrorSignals(): void {
    this.hasLoginError.set(false);
    this.isAccountLocked.set(false);
    this.hasServerError.set(false);
  }

  private handleLoginError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.hasLoginError.set(true);
      return;
    }

    if (error.status === 423) {
      this.isAccountLocked.set(true);
      return;
    }

    this.hasServerError.set(true);
  }
}
