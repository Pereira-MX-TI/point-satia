import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  decrypted(data: any): any {
    const bytes = CryptoJS.AES.decrypt(data, environment.KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  encrypted(info: any): any {
    return CryptoJS.AES.encrypt(
      JSON.stringify(info),
      environment.KEY
    ).toString();
  }
}
