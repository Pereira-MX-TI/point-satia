import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoService } from '../services/crypto.service';
import { LoginObservable } from '../observables/login.observable';
import { Account } from '../models/authentication/account';

export const TokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const cryptoService = inject(CryptoService);
  const loginObservable = inject(LoginObservable);

  const account: Account | null = loginObservable.getData();
  const opc = Number(request.headers.get('opc'));

  let modifiedRequest = request;

  if (opc === 0) {
    modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  } else if (opc === 1) {
    if (account) {
      const encryptedInfo = btoa(cryptoService.encrypted(account.api)).replace(
        /\//g,
        '~'
      );

      modifiedRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${account.token}`,
          info: encryptedInfo,
        },
      });
    } else {
      modifiedRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    }
  }

  modifiedRequest = modifiedRequest.clone({
    headers: modifiedRequest.headers.delete('opc'),
  });

  return next(modifiedRequest);
};
