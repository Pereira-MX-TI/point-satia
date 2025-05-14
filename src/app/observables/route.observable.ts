import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { Location_route } from '../models/route/location_route.model';
import { IonicStorageService } from '../services/ionic-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RouteObservable {
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);

  private dataSubject = new BehaviorSubject<Location_route | null>(null);
  data$ = this.dataSubject.asObservable();

  async checkLocalStoreData(): Promise<void> {
    const dataStore = await this.ionicStorageService.get('vLoc');

    if (!dataStore) return;

    const data: Location_route = dataStore;
    this.dataSubject.next(data);
  }

  updateData(data: Location_route | null): void {
    if (data) this.ionicStorageService.set('vLoc', data);
    else this.ionicStorageService.remove('vLoc');

    this.dataSubject.next(data);
  }

  getData(): Location_route | null {
    return this.dataSubject.value;
  }
}
