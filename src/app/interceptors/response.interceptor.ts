import {
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CryptoService } from '../services/crypto.service';

export const ResponseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cryptoService = new CryptoService();
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.body && event.body.data) {
        const decryptedData = cryptoService.decrypted(event.body.data);
        return event.clone({
          body: { ...event.body, ...decryptedData },
        });
      }
      return event;
    })
  );
};
