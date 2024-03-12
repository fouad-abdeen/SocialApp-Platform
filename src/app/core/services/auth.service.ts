import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, SignupRequest } from '../types/api-request.type';
import { BaseResponse, UserResponse } from '../types/api-response.type';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.serverUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  private handleAuthentication(
    response: HttpResponse<BaseResponse<UserResponse>>
  ): void {
    const user = <UserResponse>(response.body && response.body.data);
    this.userService.set(user);
  }

  login(data: LoginRequest): void {
    this.http
      .post<BaseResponse<UserResponse>>(`${this.baseUrl}/login`, data, {
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

  logout(): void {
    this.http
      .get<BaseResponse<null>>(`${this.baseUrl}/logout`, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          localStorage.removeItem('user');
          localStorage.removeItem('userExpiresAt');
          this.router.navigate(['/']);
        },
      });
  }

  signup(data: SignupRequest, onSuccess: () => void): void {
    this.http
      .post<BaseResponse<UserResponse>>(`${this.baseUrl}/signup`, data, {
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
      .get<BaseResponse<null>>(`${this.baseUrl}/password`, {
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
        `${this.baseUrl}/password`,
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
      .put<BaseResponse<null>>(`${this.baseUrl}/email/verify?token=${token}`, {
        observe: 'response',
      })
      .subscribe({
        next: onSuccess,
      });
  }

  getAuthenticatedUser(
    callback: (response: HttpResponse<BaseResponse<UserResponse>>) => void
  ) {
    this.http
      .get<BaseResponse<UserResponse>>(`${this.baseUrl}/user`, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: callback.bind(this),
      });
  }
}
