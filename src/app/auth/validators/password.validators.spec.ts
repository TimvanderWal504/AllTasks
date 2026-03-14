import { FormControl, FormGroup } from '@angular/forms';
import {
  passwordStrengthValidator,
  passwordMatchValidator,
} from './password.validators';

describe('passwordStrengthValidator', () => {
  it('should return null when password meets all requirements', () => {
    const control = new FormControl('Password1');
    expect(passwordStrengthValidator(control)).toBeNull();
  });

  it('should return an error when password is shorter than 8 characters', () => {
    const control = new FormControl('Pass1');
    const result = passwordStrengthValidator(control);
    expect(result).toEqual({ passwordStrength: { tooShort: true } });
  });

  it('should return an error when password has no uppercase character', () => {
    const control = new FormControl('password1');
    const result = passwordStrengthValidator(control);
    expect(result).toEqual({ passwordStrength: { missingUppercase: true } });
  });

  it('should return an error when password has no digit', () => {
    const control = new FormControl('Password');
    const result = passwordStrengthValidator(control);
    expect(result).toEqual({ passwordStrength: { missingDigit: true } });
  });

  it('should return null when control value is empty (let required handle it)', () => {
    const control = new FormControl('');
    expect(passwordStrengthValidator(control)).toBeNull();
  });
});

describe('passwordMatchValidator', () => {
  function buildGroup(password: string, confirmPassword: string): FormGroup {
    return new FormGroup(
      {
        password: new FormControl(password),
        confirmPassword: new FormControl(confirmPassword),
      },
      { validators: passwordMatchValidator }
    );
  }

  it('should return null when password and confirmPassword match', () => {
    const group = buildGroup('Password1', 'Password1');
    expect(group.errors).toBeNull();
  });

  it('should return a passwordMismatch error when passwords do not match', () => {
    const group = buildGroup('Password1', 'Different1');
    expect(group.errors).toEqual({ passwordMismatch: true });
  });

  it('should return null when both passwords are empty', () => {
    const group = buildGroup('', '');
    expect(group.errors).toBeNull();
  });
});
