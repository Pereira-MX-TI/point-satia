import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IonicStorageService } from '../services/ionic-storage.service';
import { Router } from '@angular/router';
import { Account } from '../models/authentication/account';

@Injectable({
  providedIn: 'root',
})
export class LoginObservable {
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);
  private readonly router: Router = inject(Router);

  private dataSubject = new BehaviorSubject<Account | null>(null);
  data$ = this.dataSubject.asObservable();

  async checkLocalStoreData(): Promise<void> {
    const dataStore = await this.ionicStorageService.get('cacc');

    if (!dataStore) return;

    const data: Account = dataStore;
    this.dataSubject.next(data);
  }

  updateData(data: Account | null): void {
    if (data) {
      this.ionicStorageService.set('cacc-offline', data);
      this.ionicStorageService.set('cacc', data);
    } else {
      this.ionicStorageService.remove('cacc');
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
