import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseResponse,
  UserResponse,
  UserSearch,
} from '../types/api-response.type';
import { Location } from '@angular/common';
import { environment } from '@env/environment';
import { ProfileEditRequest } from '@core/types/api-request.type';

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

  getFollowers(
    callback: (response: HttpResponse<BaseResponse<UserResponse[]>>) => void,
    userId?: string,
    lastDocumentId?: string
  ): void {
    this.http
      .get<BaseResponse<UserResponse[]>>(
        `${this.baseUrl}/followers?limit=10${
          userId ? `&userId=${userId}` : ''
        }${lastDocumentId ? `&lastDocumentId=${lastDocumentId}` : ''}`,
        { withCredentials: true, observe: 'response' }
      )
      .subscribe({
        next: callback.bind(this),
      });
  }

  getFollowings(
    callback: (response: HttpResponse<BaseResponse<UserResponse[]>>) => void,
    userId?: string,
    lastDocumentId?: string
  ): void {
    this.http
      .get<BaseResponse<UserResponse[]>>(
        `${this.baseUrl}/followings?limit=10${
          userId ? `&userId=${userId}` : ''
        }${lastDocumentId ? `&lastDocumentId=${lastDocumentId}` : ''}`,
        { withCredentials: true, observe: 'response' }
      )
      .subscribe({
        next: callback.bind(this),
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
          const followings = [...user.followings, userId];
          this.set({ ...user, followings });
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
          const followings = this.user.followings.filter((id) => id !== userId);
          this.set({ ...user, followings });
          callback();
        },
      });
  }

  updateAvatar(
    avatar: File,
    successCallback: () => void,
    errorCallback: () => void
  ): void {
    const formData = new FormData();
    formData.append('avatar', avatar);
    this.http
      .post<BaseResponse<{ fileId: string }>>(
        `${this.baseUrl}/avatar`,
        formData,
        {
          withCredentials: true,
          observe: 'response',
        }
      )
      .subscribe({
        next: (response) => {
          const user = this.get();
          const avatar = <string>(response.body && response.body.data.fileId);
          this.set({ ...user, avatar });
          successCallback();
        },
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
          errorCallback();
        },
      });
  }

  deleteAvatar(callback: () => void): void {
    this.http
      .delete<BaseResponse<null>>(`${this.baseUrl}/avatar`, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          const user = this.get();
          this.set({ ...user, avatar: '' });
          callback();
        },
      });
  }

  editProfile(
    profile: ProfileEditRequest,
    successCallback: (
      response: HttpResponse<BaseResponse<UserResponse>>
    ) => void,
    errorCallback: () => void
  ): void {
    this.http
      .patch<BaseResponse<UserResponse>>(`${this.baseUrl}/profile`, profile, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: successCallback.bind(this),
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
          errorCallback();
        },
      });
  }
}
