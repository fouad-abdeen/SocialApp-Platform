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

  submitPost(content: string, callback: () => void, image?: string): void {
    const formData = new FormData();

    formData.append('content', content);
    if (image) formData.append('image', image);

    this.http
      .post(this.baseUrl, formData, {
        withCredentials: true,
        observe: 'response',
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
}
