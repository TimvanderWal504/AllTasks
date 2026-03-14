import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { appConfig } from '../../shared/config/app.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(appConfig.api.auth.registerUrl, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(appConfig.api.auth.loginUrl, request);
  }

  storeTokens(response: AuthResponse): void {
    localStorage.setItem(appConfig.storage.accessTokenKey, response.accessToken);
    localStorage.setItem(appConfig.storage.refreshTokenKey, response.refreshToken);
  }

  requestPasswordReset(emailAddress: string): Observable<void> {
    return this.http.post<void>(appConfig.api.auth.requestPasswordResetUrl, { emailAddress });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(appConfig.api.auth.resetPasswordUrl, { token, newPassword });
  }
}
