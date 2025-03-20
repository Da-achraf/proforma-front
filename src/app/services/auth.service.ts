import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom, Observable, of, tap } from 'rxjs';
import { API_URL_TOKEN } from '../core/api/api.config';
import { RoleEnum, User } from '../core/models/user/user.model';

const AUTH_TOKEN_NAME = 'TE_MI_AUTH_TOKEN';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseServerUrl = inject(API_URL_TOKEN);
  private userPayload: any;

  private userRoleSig = signal<RoleEnum | undefined>(undefined);
  readonly userRole = this.userRoleSig.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    this.userPayload = this.decodedToken();
    if (this.userPayload) {
      this.userRoleSig.set(this.userPayload.role);
    }
  }

  SignUpUser(User: any) {
    return this.http.post(this.baseServerUrl + '/User/CreateUser', User, {
      responseType: 'text',
    });
  }

  LoginUser(identifier: string, password: string) {
    return this.http
      .post(
        this.baseServerUrl + '/User/LoginUser',
        {
          Identifier: identifier,
          Password: password,
        },
        { responseType: 'text' }
      )
      .pipe(tap(console.log));
  }

  // JWT
  StoreToken(tokenValue: string) {
    if (isPlatformBrowser(this.platformId)) {
      // Check if the platform is browser
      localStorage.setItem(AUTH_TOKEN_NAME, tokenValue);
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      // Check if the platform is browser
      return localStorage.getItem(AUTH_TOKEN_NAME);
    }
    return null;
  }

  IsLogedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Check if the platform is browser
      return !!localStorage.getItem(AUTH_TOKEN_NAME);
    }
    return false;
  }

  SignOut() {
    if (isPlatformBrowser(this.platformId)) {
      // Check if the platform is browser
      localStorage.clear();
      this.router.navigateByUrl('/login').then(() => {
        window.location.reload(); // Reload the page after navigating to login
      });
    }
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken(); // This can be null

    // Check if the token is not null before decoding
    if (token) {
      return jwtHelper.decodeToken(token);
    } else {
      console.warn('No token found');
      return null; // Return null if there is no token
    }
  }

  getFullNameFromToken() {
    const userPayload = this.decodedToken(); // Call the method to get the most recent token payload
    if (userPayload) {
      return userPayload.unique_name;
    }
    return null; // Return null if there is no user payload
  }

  getRoleFromToken() {
    const userPayload = this.decodedToken(); // Call the method to get the most recent token payload
    if (userPayload) {
      return userPayload.role;
    }
    return null; // Return null if there is no user payload
  }

  getRoleFromTokenObs(): Observable<RoleEnum | undefined> {
    const userPayload = this.decodedToken();
    if (userPayload) {
      return of(userPayload.role);
    }
    return of(undefined);
  }

  getUserIdFromToken() {
    const userPayload = this.decodedToken(); // Call the method to get the most recent token payload
    if (userPayload) {
      return userPayload.id; // Assuming the ID field in your token is named 'id'
    }
    return null; // Return null if there is no user payload
  }

  getUserById(id: number) {
    const user$ = this.http.get<User>(`${this.baseServerUrl}/User/${id}`);
    return lastValueFrom(user$);
  }
}
