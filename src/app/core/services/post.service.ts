import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Post } from '@core/types/api-responses';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly baseUrl = `${environment.serverUrl}/posts`;

  constructor(private http: HttpClient) {}

  submit(
    content: string,
    callback: (response: HttpResponse<BaseResponse<Post>>) => void,
    image?: string
  ): void {
    const formData = new FormData();

    formData.append('content', content);
    if (image) formData.append('image', image);

    this.http
      .post<BaseResponse<Post>>(this.baseUrl, formData, {
        withCredentials: true,
        observe: 'response',
      })
      .subscribe({
        next: callback.bind(this),
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  like(postId: string, callback: () => void): void {
    this.http
      .post(`${this.baseUrl}/${postId}/like`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  unlike(postId: string, callback: () => void): void {
    this.http
      .delete(`${this.baseUrl}/${postId}/like`, {
        withCredentials: true,
      })
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  getTimelinePosts(
    callback: (response: HttpResponse<BaseResponse<Post[]>>) => void,
    lastPostId?: string
  ): void {
    this.http
      .get<BaseResponse<Post[]>>(
        `${this.baseUrl}?limit=5${
          lastPostId ? `&lastDocumentId=${lastPostId}` : ''
        }`,
        {
          withCredentials: true,
          observe: 'response',
        }
      )
      .subscribe({
        next: callback.bind(this),
      });
  }

  getUserPosts(
    userId: string,
    callback: (response: HttpResponse<BaseResponse<Post[]>>) => void,
    lastPostId?: string
  ): void {
    this.http
      .get<BaseResponse<Post[]>>(
        `${this.baseUrl}/${userId}?limit=5${
          lastPostId ? `&lastDocumentId=${lastPostId}` : ''
        }`,
        {
          withCredentials: true,
          observe: 'response',
        }
      )
      .subscribe({
        next: callback.bind(this),
      });
  }
}
