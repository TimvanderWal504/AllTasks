import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.models';

const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: { id: '1', email: 'user@example.com', roles: ['user'] },
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'storeTokens']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a form with email and password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('should render a remember-me checkbox', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="checkbox"]')).toBeTruthy();
  });

  it('should mark the form as invalid when all fields are empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should mark the email field as invalid when given an incorrect format', () => {
    component.loginForm.controls['email'].setValue('not-an-email');
    expect(component.loginForm.controls['email'].invalid).toBeTrue();
  });

  it('should mark the email field as valid when given a correct email', () => {
    component.loginForm.controls['email'].setValue('user@example.com');
    expect(component.loginForm.controls['email'].valid).toBeTrue();
  });

  it('should mark the password field as invalid when it is empty', () => {
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.controls['password'].invalid).toBeTrue();
  });

  it('should mark the form as valid when email and password are filled correctly', () => {
    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('Password1');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should not call AuthService.login when the form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call AuthService.login with email, password and rememberMe when the form is submitted', () => {
    authServiceSpy.login.and.returnValue(of(mockAuthResponse));

    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('Password1');
    component.loginForm.controls['rememberMe'].setValue(false);
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password1',
      rememberMe: false,
    });
  });

  it('should store tokens after a successful login', () => {
    authServiceSpy.login.and.returnValue(of(mockAuthResponse));

    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('Password1');
    component.onSubmit();

    expect(authServiceSpy.storeTokens).toHaveBeenCalledWith(mockAuthResponse);
  });

  it('should set isSubmitting to false after the login request completes', () => {
    authServiceSpy.login.and.returnValue(of(mockAuthResponse));

    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('Password1');
    component.onSubmit();

    expect(component.isSubmitting()).toBeFalse();
  });

  it('should show a neutral error message on a 401 invalid-credentials response', () => {
    const errorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('WrongPassword1');
    component.onSubmit();

    expect(component.hasLoginError()).toBeTrue();
    expect(component.isAccountLocked()).toBeFalse();
  });

  it('should show an account-locked message after 5 failed attempts (423 response)', () => {
    const errorResponse = new HttpErrorResponse({ status: 423, statusText: 'Locked' });
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.controls['email'].setValue('locked@example.com');
    component.loginForm.controls['password'].setValue('Password1');
    component.onSubmit();

    expect(component.isAccountLocked()).toBeTrue();
    expect(component.hasLoginError()).toBeFalse();
  });

  it('should show a generic server error message for unexpected errors', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('Password1');
    component.onSubmit();

    expect(component.hasServerError()).toBeTrue();
    expect(component.hasLoginError()).toBeFalse();
    expect(component.isAccountLocked()).toBeFalse();
  });

  it('should reset error signals when a new login attempt is started', () => {
    const errorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.controls['email'].setValue('user@example.com');
    component.loginForm.controls['password'].setValue('WrongPassword1');
    component.onSubmit();

    expect(component.hasLoginError()).toBeTrue();

    authServiceSpy.login.and.returnValue(of(mockAuthResponse));
    component.onSubmit();

    expect(component.hasLoginError()).toBeFalse();
  });
});
