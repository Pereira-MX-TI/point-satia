import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class IonicStorageService {
  private _storage: Storage | null = null;
  private _ready: Promise<void>;

  constructor(private storage: Storage, private cryptoService: CryptoService) {
    this._ready = this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async ensureReady(): Promise<void> {
    await this._ready;
  }

  set(key: string, value: any) {
    const stringValue = JSON.stringify(value); // <- convierte a texto
    const encrypted = this.cryptoService.encrypted(stringValue);
    this._storage?.set(key, encrypted);
  }

  async get(key: string) {
    await this.ensureReady();

    const dataStore = await this._storage?.get(key);

    if (dataStore) {
      const decrypted = this.cryptoService.decrypted(dataStore);
      try {
        return JSON.parse(decrypted); // <- convierte de vuelta a objeto
      } catch (e) {
        return decrypted; // si no era un objeto, devuelve como texto
      }
    }

    return null;
  }

  public remove(key: string) {
    return this._storage?.remove(key);
  }
}
