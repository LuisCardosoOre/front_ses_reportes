import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { statusErrors } from './error.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        let message: string;
        /*
        if (err.error?.message) {
          message = err.error.message;
        } else {
          message = `Error Code: ${err.status}\n Message: ${err.message}`;
        }*/
        if (err.error?.message) {
          message = err.error.message;
        } else {
          message = statusErrors.get(err.status) || err.error;
        }
        this.messageService.add({severity: 'error', summary: 'Error Interno', detail: message, life: 3000});

        return throwError(() => err);
      })
    );
  }
}
