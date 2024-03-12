import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Comment } from '@core/types/api-response.type';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly baseUrl = `${environment.serverUrl}/comments`;

  constructor(private http: HttpClient) {}

  like(commentId: string, callback: () => void): void {
    this.http
      .post(`${this.baseUrl}/${commentId}/like`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  unlike(commentId: string, callback: () => void): void {
    this.http
      .delete(`${this.baseUrl}/${commentId}/like`, {
        withCredentials: true,
      })
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  reply(commentId: string, content: string, callback: () => void): void {
    this.http
      .post(
        `${this.baseUrl}/${commentId}/reply`,
        { content },
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  update(commentId: string, content: string, callback: () => void): void {
    this.http
      .patch(
        `${this.baseUrl}/${commentId}`,
        { content },
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  delete(commentId: string, callback: () => void): void {
    this.http
      .delete(`${this.baseUrl}/${commentId}`, {
        withCredentials: true,
      })
      .subscribe({
        next: callback,
        error: (errorResponse: HttpErrorResponse) => {
          alert(errorResponse.error.error.message);
        },
      });
  }

  getCommentsOfPost(
    postId: string,
    callback: (response: HttpResponse<BaseResponse<Comment[]>>) => void,
    lastCommentId?: string
  ): void {
    this.http
      .get<BaseResponse<Comment[]>>(
        `${this.baseUrl}?postId=${postId}&limit=5${
          lastCommentId ? `&lastDocumentId=${lastCommentId}` : ''
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

  getRepliesOfComment(
    commentId: string,
    callback: (response: HttpResponse<BaseResponse<Comment[]>>) => void,
    lastReplyId?: string
  ): void {
    this.http
      .get<BaseResponse<Comment[]>>(
        `${this.baseUrl}/${commentId}/replies?limit=10${
          lastReplyId ? `&lastDocumentId=${lastReplyId}` : ''
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
