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
export class HttpRouteService {
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

  autoCompletedLocation(dto: { word: string }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/locations/autoCompletedLocation`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }

  autoCompletedGpsCounterByRoute(dto: {
    filter: 'done' | 'fail';
    word: string;
    route_id: number | string;
  }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/locations/autoCompletedGpsCounterByRoute`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }

  getLocations(dto: {
    offset?: number;
    limit?: number;
    option: 'pagination' | 'complete';
    totalRecords?: boolean;
    addLocation: boolean;
    search?: string;
  }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/locations/getLocations`, {
        params,
        headers: { opc: '1' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHttpService.getError(error);
        })
      );
  }

  gpsCounterByRoute(dto: {
    filter: 'done' | 'fail';
    offset?: number;
    limit?: number;
    option: 0 | 1;
    totalRecords?: boolean;
    search?: string;
    route_id: number | string;
  }): Observable<any> {
    let params = new HttpParams();
    params = params.append(
      'data',
      btoa(this.cryptoService.encrypted(dto)).replace(new RegExp('/', 'g'), '~')
    );

    return this.httpClient
      .get<any>(`${this.url_api}/locations/gpsCounterByRoute`, {
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
