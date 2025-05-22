import { Component, inject } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { PermissionService } from './services/permission.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public platform: Platform = inject(Platform);
  permissionService: PermissionService = inject(PermissionService);

  constructor() {
    if (
      Capacitor.isNativePlatform() &&
      (this.platform.is('android') || this.platform.is('ios'))
    ) {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setBackgroundColor({ color: '#00000000' });
      this.showSplash();

      this.platform.ready().then(() => {
        this.requestPermissionsSequentially();
      });
    }
  }

  async showSplash() {
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  private async requestPermissionsSequentially() {
    await this.permissionService.checkRequestCameraPermission();
    await this.permissionService.checkAndRequestLocationPermission();
  }
}
