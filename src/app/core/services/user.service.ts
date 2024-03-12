import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseResponse,
  UserResponse,
  UserSearch,
} from '../types/api-response.type';
import { Location } from '@angular/common';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.serverUrl}/users`;
  private user = <UserResponse>{};

  constructor(private http: HttpClient, private location: Location) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  set(user: UserResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  get(): UserResponse {
    if (!this.user.id)
      this.user = <UserResponse>(
        JSON.parse(<string>localStorage.getItem('user'))
      );
    return this.user;
  }

  getByUsername(
    username: string,
    successCallback: (
      response: HttpResponse<BaseResponse<UserResponse>>
    ) => void
  ): void {
    this.http
      .get<BaseResponse<UserResponse>>(`${this.baseUrl}?username=${username}`, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: successCallback.bind(this),
        error: () => {
          alert(
            'The requested user profile could not be found. Please check the username and try again.'
          );
          this.location.back();
        },
      });
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
