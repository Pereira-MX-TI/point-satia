import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account } from '../../models/authentication/account';
import { LoginObservable } from '../../observables/login.observable';
import { CryptoService } from '../crypto.service';
import { ErrorHttpService } from '../error-http.service';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  subscriptionAccount: Subscription = new Subscription();
  url_api_client: string = '';
  url_api_global: string = '';

  constructor(
    private errorHttpService: ErrorHttpService,
    private loginObservable: LoginObservable,
    private httpClient: HttpClient,
    private cryptoService: CryptoService
  ) {
    this.subscriptionLogin();
    this.url_api_global = environment.API_URI;
  }

  private subscriptionLogin(): void {
    this.subscriptionAccount = this.loginObservable.data$.subscribe(
      (res: Account | null) => {
        if (!res) return;

        this.url_api_client = res.api.url;
      }
    );
  }

  login(dto: {
    email:string,
    password:string,
  }): Observable<any> {
    const body = { data: this.cryptoService.encrypted(dto) };

    return this.httpClient
      .post<any>(`${this.url_api_global}/auth/login`, body, {
        headers: { opc: '0' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }
}
