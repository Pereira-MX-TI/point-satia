import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { LoginObservable } from '../observables/login.observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorHttpService {
  constructor(private loginObservable: LoginObservable) {}

  getError(error: HttpErrorResponse) {
    if (!environment.production) console.log(error);
    if (error.status == 401) {
      this.loginObservable.updateData(null);
      return throwError('Usuario no autorizado');
    }

    return throwError({ status: error.status, message: error.message });
  }
}
