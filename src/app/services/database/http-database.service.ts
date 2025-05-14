import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, Subscription, catchError } from 'rxjs';
import { Account } from '../../models/authentication/account';
import { LoginObservable } from '../../observables/login.observable';
import { CryptoService } from '../crypto.service';
import { ErrorHttpService } from '../error-http.service';

@Injectable({
  providedIn: 'root',
})
export class HttpDataBaseService {
  subscriptionAccount: Subscription = new Subscription();
  url_api: string = '';
  constructor(
    private errorHttpService: ErrorHttpService,
    private loginObservable: LoginObservable,
    private httpClient: HttpClient,
    private cryptoService: CryptoService
  ) {
    this.subscriptionLogin();
  }

  private subscriptionLogin(): void {
    this.subscriptionAccount = this.loginObservable.data$.subscribe(
      (res: Account | null) => {
        if (!res) return;

        this.url_api = res.api.url;
      }
    );
  }

  autoCompletedDataBase(dto: { word: string }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/database/autoCompletedDataBase`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }

  autoCompletedGpsDataBase(dto: {
    word: string;
    filter: 'done' | 'fail';
  }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/database/autoCompletedGpsDataBase`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }

  listDataBases(dto: {
    search?: string;
    offset?: number;
    limit?: number;
    option: 'pagination' | 'complete';
    totalRecords?: boolean;
  }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/database/listDataBases`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }

  gpsDataBase(dto: {
    offset: number;
    limit: number;
    option: number;
    totalRecords?: boolean;
    search?: string;
    filter: 'done' | 'fail';
  }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/database/gpsDataBase`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }
}
