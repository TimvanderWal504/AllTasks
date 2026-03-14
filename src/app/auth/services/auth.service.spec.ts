import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
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
    localStorage.clear();
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

  describe('login', () => {
    it('should send a POST request to the login endpoint with the provided credentials', () => {
      const request: LoginRequest = {
        email: 'user@example.com',
        password: 'Password1',
        rememberMe: false,
      };

      service.login(request).subscribe();

      const req = httpMock.expectOne(appConfig.api.auth.loginUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should return the AuthResponse on a successful login', () => {
      const request: LoginRequest = {
        email: 'user@example.com',
        password: 'Password1',
        rememberMe: false,
      };

      let result: AuthResponse | undefined;
      service.login(request).subscribe((response) => {
        result = response;
      });

      const req = httpMock.expectOne(appConfig.api.auth.loginUrl);
      req.flush(mockResponse);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate a 401 error to the caller when credentials are invalid', () => {
      const request: LoginRequest = {
        email: 'user@example.com',
        password: 'WrongPassword1',
        rememberMe: false,
      };

      let errorStatus: number | undefined;
      service.login(request).subscribe({
        error: (err) => {
          errorStatus = err.status;
        },
      });

      const req = httpMock.expectOne(appConfig.api.auth.loginUrl);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
      expect(errorStatus).toBe(401);
    });

    it('should propagate a 423 error to the caller when the account is locked', () => {
      const request: LoginRequest = {
        email: 'locked@example.com',
        password: 'Password1',
        rememberMe: false,
      };

      let errorStatus: number | undefined;
      service.login(request).subscribe({
        error: (err) => {
          errorStatus = err.status;
        },
      });

      const req = httpMock.expectOne(appConfig.api.auth.loginUrl);
      req.flush({ message: 'Account locked' }, { status: 423, statusText: 'Locked' });
      expect(errorStatus).toBe(423);
    });
  });
});
