import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../services/auth.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['requestPasswordReset']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('forgotPasswordForm validation', () => {
    it('should be invalid when the email field is empty', () => {
      component.forgotPasswordForm.controls['email'].setValue('');
      expect(component.forgotPasswordForm.invalid).toBeTrue();
    });

    it('should be invalid when the email format is incorrect', () => {
      component.forgotPasswordForm.controls['email'].setValue('not-an-email');
      expect(component.forgotPasswordForm.invalid).toBeTrue();
    });

    it('should be valid when a correctly formatted email address is entered', () => {
      component.forgotPasswordForm.controls['email'].setValue('user@example.com');
      expect(component.forgotPasswordForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should not call requestPasswordReset when the form is invalid', () => {
      component.forgotPasswordForm.controls['email'].setValue('');
      component.onSubmit();
      expect(authServiceSpy.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should call requestPasswordReset with the email address on valid submission', () => {
      authServiceSpy.requestPasswordReset.and.returnValue(of(undefined));
      component.forgotPasswordForm.controls['email'].setValue('user@example.com');
      component.onSubmit();
      expect(authServiceSpy.requestPasswordReset).toHaveBeenCalledWith('user@example.com');
    });

    it('should set isSubmitSuccessful to true and isSubmitting to false on success', () => {
      authServiceSpy.requestPasswordReset.and.returnValue(of(undefined));
      component.forgotPasswordForm.controls['email'].setValue('user@example.com');
      component.onSubmit();
      expect(component.isSubmitSuccessful()).toBeTrue();
      expect(component.isSubmitting()).toBeFalse();
    });

    it('should show the same success message regardless of whether the email address exists', () => {
      authServiceSpy.requestPasswordReset.and.returnValue(of(undefined));
      component.forgotPasswordForm.controls['email'].setValue('unknown@example.com');
      component.onSubmit();
      expect(component.isSubmitSuccessful()).toBeTrue();
    });

    it('should set hasServerError to true and isSubmitting to false when a server error occurs', () => {
      const serverError = new HttpErrorResponse({ status: 500 });
      authServiceSpy.requestPasswordReset.and.returnValue(throwError(() => serverError));
      component.forgotPasswordForm.controls['email'].setValue('user@example.com');
      component.onSubmit();
      expect(component.hasServerError()).toBeTrue();
      expect(component.isSubmitting()).toBeFalse();
    });

    it('should reset hasServerError before a new submission attempt', () => {
      authServiceSpy.requestPasswordReset.and.returnValue(of(undefined));
      component.hasServerError.set(true);
      component.forgotPasswordForm.controls['email'].setValue('user@example.com');
      component.onSubmit();
      expect(component.hasServerError()).toBeFalse();
    });
  });
});
