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
  private user = <UserResponse>{};

  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  set(user: UserResponse): void {
    this.user = user;
  }

  get(): UserResponse {
    if (!this.user.id)
      this.user = <UserResponse>(
        JSON.parse(<string>localStorage.getItem('user'))
      );
    return this.user;
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

  follow(userId: string, callback: () => void): void {
    this.http
      .post<BaseResponse<null>>(`${this.baseUrl}/${userId}/follow`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          const user = this.get();
          user.followings.push(userId);
          localStorage.setItem('user', JSON.stringify(user));
          this.set(user);
          callback();
        },
      });
  }

  unfollow(userId: string, callback: () => void): void {
    this.http
      .post<BaseResponse<null>>(`${this.baseUrl}/${userId}/unfollow`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          const user = this.get();
          user.followings = this.user.followings.filter((id) => id !== userId);
          localStorage.setItem('user', JSON.stringify(user));
          this.set(user);
          callback();
        },
      });
  }
}
