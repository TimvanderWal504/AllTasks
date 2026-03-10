import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse, RegisterRequest } from '../models/auth.models';
import { appConfig } from '../../shared/config/app.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse: AuthResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: { id: '1', email: 'user@example.com', roles: ['user'] },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should send a POST request to the register endpoint and return an AuthResponse', () => {
      const request: RegisterRequest = {
        email: 'user@example.com',
        password: 'Password1',
      };

      service.register(request).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(appConfig.api.auth.registerUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should propagate HTTP errors to the caller', () => {
      const request: RegisterRequest = {
        email: 'taken@example.com',
        password: 'Password1',
      };

      let errorReceived = false;
      service.register(request).subscribe({
        error: () => {
          errorReceived = true;
        },
      });

      const req = httpMock.expectOne(appConfig.api.auth.registerUrl);
      req.flush({ message: 'Email already in use' }, { status: 409, statusText: 'Conflict' });
      expect(errorReceived).toBeTrue();
    });
  });

  describe('storeTokens', () => {
    it('should store the access token and refresh token in localStorage', () => {
      service.storeTokens(mockResponse);
      expect(localStorage.getItem(appConfig.storage.accessTokenKey)).toBe('mock-access-token');
      expect(localStorage.getItem(appConfig.storage.refreshTokenKey)).toBe('mock-refresh-token');
    });
  });
});
