import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { Account } from '../models/authentication/account';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private cryptoService: CryptoService) {}

  save(name: string, value: any): void {
    localStorage.setItem(name, this.cryptoService.encrypted(value));
  }

  view(key: string): any {
    return this.cryptoService.decrypted(localStorage.getItem(key));
  }

  get(key: string): any {
    return localStorage.getItem(key);
  }

  exist(key: string): boolean {
    return localStorage.getItem(key) != undefined;
  }

  remove(lisKey: Array<string>): void {
    lisKey.forEach((itrKey) => {
      localStorage.removeItem(itrKey);
    });
  }

  removeAllLogin(): void {
    const accountCurrent: Account = this.view('cacc');
    localStorage.clear();
    this.save('cacc', accountCurrent);
  }
}
