import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IonicStorageService } from '../services/ionic-storage.service';
import { Counter } from '../models/counter.model';

@Injectable({
  providedIn: 'root',
})
export class CounterObservable {
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);

  private dataSubject = new BehaviorSubject<Array<Counter> | null>(null);
  data$ = this.dataSubject.asObservable();

  async checkLocalStoreData(nameStore: string): Promise<void> {
    const dataStore = await this.ionicStorageService.get(nameStore);

    if (!dataStore) return;

    const data: Array<Counter> = dataStore;
    this.dataSubject.next(data);
  }

  updateData(nameStore: string, data: Array<Counter> | null): void {
    if (data) this.ionicStorageService.set(nameStore, data);
    else this.ionicStorageService.remove(nameStore);

    this.dataSubject.next(data);
  }

  clearData(): void {
    this.dataSubject.next(null);
  }

  getData(): Array<Counter> | null {
    return this.dataSubject.value;
  }
}
