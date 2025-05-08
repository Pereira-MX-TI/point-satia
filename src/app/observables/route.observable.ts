import { BehaviorSubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Location_route } from '../models/route/location_route.model';

@Injectable({
  providedIn: 'root',
})
export class RouteObservable {
  private readonly localStorageService = inject(LocalStorageService);

  private dataSubject = new BehaviorSubject<Location_route | null>(null);
  data$ = this.dataSubject.asObservable();

  checkLocalStoreData(): void {
    if (this.localStorageService.exist('vLoc')) {
      const data: Location_route = this.localStorageService.view('vLoc');
      this.dataSubject.next(data);
    }
  }

  updateData(data: Location_route | null): void {
    if (data) this.localStorageService.save('vLoc', data);
    else this.localStorageService.remove(['vLoc']);

    this.dataSubject.next(data);
  }

  getData(): Location_route | null {
    return this.dataSubject.value;
  }
}
