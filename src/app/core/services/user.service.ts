import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, UserResponse, UserSearch } from '../types/api-responses';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.serverUrl}/users`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  getCurrentProfile(): UserResponse {
    return <UserResponse>JSON.parse(localStorage.getItem('user') ?? 'null');
  }

  search(
    usernameQuery: string,
    lastDocumentId: string | undefined,
    searchCallback: (response: HttpResponse<BaseResponse<UserSearch[]>>) => void
  ): void {
    this.http
      .get<BaseResponse<UserSearch[]>>(
        `${this.baseUrl}/search?usernameQuery=${usernameQuery}&limit=5${
          lastDocumentId ? `&lastDocumentId=${lastDocumentId}` : ''
        }`,
        {
          withCredentials: true,
          observe: 'response',
        }
      )
      .subscribe({
        next: searchCallback.bind(this),
      });
  }
}
