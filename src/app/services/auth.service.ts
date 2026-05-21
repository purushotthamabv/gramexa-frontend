import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../model/login';
import { RegisterRequest } from '../model/register-request';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

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
  }

  // CHECK LOGIN

  isLoggedIn(): boolean {

    return this.cookieService.check(
      'token'
    );
  }
}
