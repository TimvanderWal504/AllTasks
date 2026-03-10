import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, RegisterRequest } from '../models/auth.models';
import { appConfig } from '../../shared/config/app.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(appConfig.api.auth.registerUrl, request);
  }

  storeTokens(response: AuthResponse): void {
    localStorage.setItem(appConfig.storage.accessTokenKey, response.accessToken);
    localStorage.setItem(appConfig.storage.refreshTokenKey, response.refreshToken);
  }
}
