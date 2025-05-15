import { Platform } from '@angular/cdk/platform';
import { inject, Injectable, NgZone } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService {
  private networkStatus = new BehaviorSubject<boolean>(true);
  public networkStatus$ = this.networkStatus.asObservable();
  platform: Platform = inject(Platform);
  ngZone: NgZone = inject(NgZone);

  constructor() {
    this.initializeNetworkMonitoring();
  }

  private async initializeNetworkMonitoring() {
    if (this.platform.ANDROID || this.platform.IOS) {
      const status = await Network.getStatus();
      this.networkStatus.next(status.connected);

      Network.addListener('networkStatusChange', (status) => {
        this.ngZone.run(() => {
          this.networkStatus.next(status.connected);
        });
      });
      return;
    }

    // Web
    this.networkStatus.next(navigator.onLine);

    window.addEventListener('online', () => {
      this.ngZone.run(() => {
        this.networkStatus.next(true);
      });
    });

    window.addEventListener('offline', () => {
      this.ngZone.run(() => {
        this.networkStatus.next(false);
      });
    });
  }
}
