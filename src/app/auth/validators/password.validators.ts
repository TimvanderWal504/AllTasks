import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;

  if (!value) {
    return null;
  }

  if (value.length < 8) {
    return { passwordStrength: { tooShort: true } };
  }

  if (!/[A-Z]/.test(value)) {
    return { passwordStrength: { missingUppercase: true } };
  }

  if (!/[0-9]/.test(value)) {
    return { passwordStrength: { missingDigit: true } };
  }

  return null;
}

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (!password && !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};
