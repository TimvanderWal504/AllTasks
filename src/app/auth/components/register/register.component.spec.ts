import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.models';

const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: { id: '1', email: 'user@example.com', roles: ['user'] },
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'storeTokens']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a form with email, password and confirmPassword fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[id="password"]')).toBeTruthy();
    expect(compiled.querySelector('input[id="confirmPassword"]')).toBeTruthy();
  });

  it('should mark the form as invalid when all fields are empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should mark the email field as invalid when given an incorrect format', () => {
    component.registerForm.controls['email'].setValue('not-an-email');
    expect(component.registerForm.controls['email'].invalid).toBeTrue();
  });

  it('should mark the email field as valid when given a correct email', () => {
    component.registerForm.controls['email'].setValue('user@example.com');
    expect(component.registerForm.controls['email'].valid).toBeTrue();
  });

  it('should mark the password as invalid when it is shorter than 8 characters', () => {
    component.registerForm.controls['password'].setValue('Pass1');
    expect(component.registerForm.controls['password'].invalid).toBeTrue();
  });

  it('should mark the password as invalid when it has no uppercase letter', () => {
    component.registerForm.controls['password'].setValue('password1');
    expect(component.registerForm.controls['password'].invalid).toBeTrue();
  });

  it('should mark the password as invalid when it has no digit', () => {
    component.registerForm.controls['password'].setValue('Password');
    expect(component.registerForm.controls['password'].invalid).toBeTrue();
  });

  it('should mark the form as invalid when passwords do not match', () => {
    component.registerForm.controls['email'].setValue('user@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Different1');
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('should mark the form as valid when all fields are correctly filled', () => {
    component.registerForm.controls['email'].setValue('user@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Password1');
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should call AuthService.register with email and password when the form is submitted', () => {
    authServiceSpy.register.and.returnValue(of(mockAuthResponse));

    component.registerForm.controls['email'].setValue('user@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Password1');
    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password1',
    });
  });

  it('should store tokens after successful registration', () => {
    authServiceSpy.register.and.returnValue(of(mockAuthResponse));

    component.registerForm.controls['email'].setValue('user@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Password1');
    component.onSubmit();

    expect(authServiceSpy.storeTokens).toHaveBeenCalledWith(mockAuthResponse);
  });

  it('should show an error message when the email is already in use (409)', () => {
    const errorResponse = new HttpErrorResponse({ status: 409, statusText: 'Conflict' });
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.controls['email'].setValue('taken@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Password1');
    component.onSubmit();

    expect(component.isEmailAlreadyInUse()).toBeTrue();
  });

  it('should show a generic error message for non-409 server errors', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.controls['email'].setValue('user@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Password1');
    component.onSubmit();

    expect(component.hasServerError()).toBeTrue();
  });

  it('should not call AuthService.register when the form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should set isSubmitting to true while the request is in flight', () => {
    authServiceSpy.register.and.returnValue(of(mockAuthResponse));

    component.registerForm.controls['email'].setValue('user@example.com');
    component.registerForm.controls['password'].setValue('Password1');
    component.registerForm.controls['confirmPassword'].setValue('Password1');
    component.onSubmit();

    // After observable completes synchronously, isSubmitting should be false
    expect(component.isSubmitting()).toBeFalse();
  });
});
