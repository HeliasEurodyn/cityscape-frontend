import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LoadingService } from '../services/system/sofia/loading.service';
import { catchError, map } from 'rxjs/operators';
import { IGNORE_HTTP_LOADER_INTERCEPTOR } from 'app/constants/ignore-http-loader-interceptor';

@Injectable()
export class HttpRequestLoadingInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.context.get(IGNORE_HTTP_LOADER_INTERCEPTOR)) {
      return next.handle(request); // Skip the interceptor
    }
    this.loadingService.setLoading(true, request.url);
    return next.handle(request)
      .pipe(catchError((err) => {
        this.loadingService.setLoading(false, request.url);
        return throwError(err);
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, request.url);
        }
        return evt;
      }));
  }
}
