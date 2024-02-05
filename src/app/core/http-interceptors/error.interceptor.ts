import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An usnknown error occurred. Please try again later.';

    // client-side error
    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${errorResponse.error.message}`;
    }
    // network error
    else if (errorResponse.status === 0) {
      errorMessage =
        'A network error occurred. Please check your internet connection and try again.';
    }
    // server-side error
    else {
      if (errorResponse.error.error)
        errorMessage = errorResponse.error.error.message;
    }

    alert(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(this.handleError));
  }
}
