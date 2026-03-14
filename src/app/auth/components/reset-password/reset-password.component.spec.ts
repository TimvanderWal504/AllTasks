import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';

function buildActivatedRoute(token: string | null) {
  return {
    snapshot: { queryParamMap: { get: (key: string) => (key === 'token' ? token : null) } },
  };
}

describe('ResetPasswordComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['resetPassword']);
  });

  describe('with a valid token in the query parameters', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ResetPasswordComponent, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: ActivatedRoute, useValue: buildActivatedRoute('valid-token') },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ResetPasswordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    describe('resetPasswordForm validation', () => {
      it('should be invalid when both password fields are empty', () => {
        component.resetPasswordForm.controls['password'].setValue('');
        component.resetPasswordForm.controls['confirmPassword'].setValue('');
        expect(component.resetPasswordForm.invalid).toBeTrue();
      });

      it('should be invalid when the password does not meet strength requirements', () => {
        component.resetPasswordForm.controls['password'].setValue('weakpw');
        component.resetPasswordForm.controls['confirmPassword'].setValue('weakpw');
        expect(component.resetPasswordForm.invalid).toBeTrue();
      });

      it('should be invalid when the passwords do not match', () => {
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password2');
        expect(component.resetPasswordForm.invalid).toBeTrue();
      });

      it('should be valid when password meets strength requirements and both passwords match', () => {
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password1');
        expect(component.resetPasswordForm.valid).toBeTrue();
      });
    });

    describe('token handling', () => {
      it('should read the reset token from the query parameters on init', () => {
        expect(component.isTokenMissing()).toBeFalse();
      });
    });

    describe('onSubmit', () => {
      it('should not call resetPassword when the form is invalid', () => {
        component.resetPasswordForm.controls['password'].setValue('');
        component.onSubmit();
        expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
      });

      it('should not call resetPassword when isTokenMissing is true', () => {
        component.isTokenMissing.set(true);
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password1');
        component.onSubmit();
        expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
      });

      it('should call resetPassword with the token and new password on valid submission', () => {
        authServiceSpy.resetPassword.and.returnValue(of(undefined));
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password1');
        component.onSubmit();
        expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('valid-token', 'Password1');
      });

      it('should set isResetSuccessful to true and isSubmitting to false on success', () => {
        authServiceSpy.resetPassword.and.returnValue(of(undefined));
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password1');
        component.onSubmit();
        expect(component.isResetSuccessful()).toBeTrue();
        expect(component.isSubmitting()).toBeFalse();
      });

      it('should set isTokenExpired to true when the server responds with a 400 error', () => {
        const expiredError = new HttpErrorResponse({ status: 400 });
        authServiceSpy.resetPassword.and.returnValue(throwError(() => expiredError));
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password1');
        component.onSubmit();
        expect(component.isTokenExpired()).toBeTrue();
        expect(component.isSubmitting()).toBeFalse();
      });

      it('should set hasServerError to true when the server responds with a 500 error', () => {
        const serverError = new HttpErrorResponse({ status: 500 });
        authServiceSpy.resetPassword.and.returnValue(throwError(() => serverError));
        component.resetPasswordForm.controls['password'].setValue('Password1');
        component.resetPasswordForm.controls['confirmPassword'].setValue('Password1');
        component.onSubmit();
        expect(component.hasServerError()).toBeTrue();
        expect(component.isSubmitting()).toBeFalse();
      });
    });
  });

  describe('with no token in the query parameters', () => {
    it('should set isTokenMissing to true when no token is present in the query parameters', async () => {
      await TestBed.configureTestingModule({
        imports: [ResetPasswordComponent, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: ActivatedRoute, useValue: buildActivatedRoute(null) },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(ResetPasswordComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.isTokenMissing()).toBeTrue();
    });
  });
});
