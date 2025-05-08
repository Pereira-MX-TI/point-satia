import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { Account } from '../models/authentication/account';

@Injectable({
  providedIn: 'root',
})
export class LoginObservable {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  private dataSubject = new BehaviorSubject<Account | null>(null);
  data$ = this.dataSubject.asObservable();

  checkLocalStoreData(): void {
    if (this.localStorageService.exist('cacc')) {
      const data: Account = this.localStorageService.view('cacc');
      this.dataSubject.next(data);
    }
  }

  updateData(data: Account | null): void {
    if (data) this.localStorageService.save('cacc', data);
    else {
      this.localStorageService.remove(['cacc', 'vLoc']);
      this.router.navigate(['/Authentication/Login']);
    }

    this.dataSubject.next(data);
  }

  getData(): Account | null {
    return this.dataSubject.value;
  }

  isMasterOrSuperAdminRol(): boolean {
    const account: Account | null = this.dataSubject.value;
    if (account) {
      return account.user.type_user.id == 1 || account.user.type_user.id == 6;
    }

    return false;
  }

  isMasterRol(): boolean {
    const account: Account | null = this.dataSubject.value;

    if (account) {
      return account.user.type_user.id == 1;
    }

    return false;
  }

  isSuperAdminRol(): boolean {
    const account: Account | null = this.dataSubject.value;

    if (account) {
      return account.user.type_user.id == 6;
    }

    return false;
  }
}
