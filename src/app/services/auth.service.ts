import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../model/login';
import { RegisterRequest } from '../model/register-request';
import { CookieService } from 'ngx-cookie-service';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  mobileNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  username: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {

  }

  // REGISTER

  register(
    request: RegisterRequest
  ): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/auth/register`,
      request,
      {
        responseType: 'text'
      }
    );
  }

  // LOGIN

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      request
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.apiUrl}/auth/profile`
    );
  }

  updateProfile(
    request: UpdateProfileRequest
  ): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/auth/profile`,
      request
    );
  }

  changePassword(
    request: ChangePasswordRequest
  ): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/auth/change-password`,
      request,
      {
        responseType: 'text'
      }
    );
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/auth/forgot-password`,
      request,
      {
        responseType: 'text'
      }
    );
  }

  // SAVE TOKEN

  saveToken(token: string) {

    this.cookieService.set(
      'token',
      token,
      1,
      '/',
      '',
      false,
      'Lax'
    );
    this.authenticatedSubject.next(true);
  }

  // GET TOKEN

  getToken(): string {

    return this.cookieService.get(
      'token'
    );
  }

  // REMOVE TOKEN

  logout() {

    this.cookieService.delete(
      'token',
      '/'
    );

    this.cookieService.deleteAll();
    localStorage.removeItem('user');
    this.authenticatedSubject.next(false);
  }

  requestAdminAccess(): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/request-admin`, {}, { responseType: 'text' });
  }

  handleInvalidSession() {
    this.logout();
  }

  // CHECK LOGIN

  isLoggedIn(): boolean {

    return this.cookieService.check(
      'token'
    );
  }
}
