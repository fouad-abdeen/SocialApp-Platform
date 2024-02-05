import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, SignupRequest } from '../types/api-requests';
import { BaseResponse, UserResponse } from '../types/api-responses';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.serverUrl;

  constructor(private http: HttpClient, private router: Router) {}

  private handleAuthentication(
    response: HttpResponse<BaseResponse<UserResponse>>
  ): void {
    const user = (response.body ?? {}).data;
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(data: LoginRequest): void {
    this.http
      .post<BaseResponse<UserResponse>>(`${this.baseUrl}/auth/login`, data, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: this.handleAuthentication.bind(this),
        complete: () => {
          this.router.navigate(['/home']);
        },
      });
  }

  signup(data: SignupRequest, onSuccess: () => void): void {
    this.http
      .post<BaseResponse<UserResponse>>(`${this.baseUrl}/auth/signup`, data, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: (value: HttpResponse<BaseResponse<UserResponse>>) => {
          this.handleAuthentication(value);
          onSuccess();
        },
      });
  }

  requestPasswordReset(email: string, onSuccess: () => void): void {
    this.http
      .get<BaseResponse<null>>(`${this.baseUrl}/auth/password`, {
        params: { email },
        observe: 'response',
      })
      .subscribe({
        next: onSuccess,
      });
  }

  resetPassword(password: string, token: string, onSuccess: () => void): void {
    this.http
      .post<BaseResponse<null>>(
        `${this.baseUrl}/auth/password`,
        { token, password },
        {
          observe: 'response',
        }
      )
      .subscribe({
        next: onSuccess,
      });
  }

  verifyEmailAddress(token: string, onSuccess: () => void): void {
    this.http
      .put<BaseResponse<null>>(
        `${this.baseUrl}/auth/email/verify?token=${token}`,
        {
          observe: 'response',
        }
      )
      .subscribe({
        next: onSuccess,
      });
  }
}
