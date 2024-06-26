import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginRequest,
  SignupRequest,
  UpdatePasswordRequest,
} from '../types/api-request.type';
import { BaseResponse, UserResponse } from '../types/api-response.type';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { UserService } from './user.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.serverUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private socketService: SocketService
  ) {}

  private handleAuthentication(
    response: HttpResponse<BaseResponse<UserResponse>>
  ): void {
    const user = <UserResponse>(response.body && response.body.data);
    this.userService.set(user);
    this.socketService.connect(user.id);
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
          this.userService.unset();
          this.socketService.disconnect();
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

  updatePassword(request: UpdatePasswordRequest, onSuccess: () => void): void {
    this.http
      .put<BaseResponse<null>>(`${this.baseUrl}/password`, request, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: () => {
          onSuccess();
          if (request.terminateAllSessions) {
            localStorage.removeItem('user');
            localStorage.removeItem('userExpiresAt');
            this.router.navigate(['/']);
          }
        },
        error: (errorResponse: HttpErrorResponse) =>
          alert(errorResponse.error.error.message),
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
