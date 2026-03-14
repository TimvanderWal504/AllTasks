import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { passwordStrengthValidator, passwordMatchValidator } from '../../validators/password.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly isEmailAlreadyInUse = signal(false);
  readonly hasServerError = signal(false);

  readonly registerForm: FormGroup = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  readonly isFormInvalid = computed(() => this.registerForm.invalid);

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.isEmailAlreadyInUse.set(false);
    this.hasServerError.set(false);

    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password }).subscribe({
      next: (response) => {
        this.authService.storeTokens(response);
        this.isSubmitting.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (error.status === 409) {
          this.isEmailAlreadyInUse.set(true);
        } else {
          this.hasServerError.set(true);
        }
      },
    });
  }
}
