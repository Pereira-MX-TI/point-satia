// import { inject, Injectable } from '@angular/core';
// import { Geolocation } from '@capacitor/geolocation';
// import { Platform, AlertController } from '@ionic/angular';
// import { Capacitor } from '@capacitor/core';
// import {
//   Camera,
//   PermissionStatus,
//   CameraResultType,
//   CameraSource,
// } from '@capacitor/camera';

// @Injectable({
//   providedIn: 'root',
// })
// export class PermissionService {
//   platform: Platform = inject(Platform);
//   alertController: AlertController = inject(AlertController);

//   private permissionLocationGranted = false;
//   private permissionCameraGranted = false;

//   constructor() {}

//   async checkAndRequestLocationPermission(): Promise<boolean> {
//     if (
//       Capacitor.isNativePlatform() &&
//       (this.platform.is('android') || this.platform.is('ios'))
//     ) {
//       try {
//         const permStatus = await Geolocation.checkPermissions();

//         if (permStatus.location === 'granted') {
//           this.permissionLocationGranted = true;
//           return true;
//         }

//         const requested = await Geolocation.requestPermissions();

//         if (requested.location === 'granted') {
//           this.permissionLocationGranted = true;
//           return true;
//         }
//         return false;
//       } catch (error) {
//         console.error('Error al solicitar permisos de ubicación:', error);
//         return false;
//       }
//     }

//     return true;
//   }

//   async checkRequestCameraPermission(): Promise<boolean> {
//     if (
//       Capacitor.isNativePlatform() &&
//       (this.platform.is('android') || this.platform.is('ios'))
//     ) {
//       try {
//         const status: PermissionStatus = await Camera.checkPermissions();
//         if (status.camera === 'granted') {
//           this.permissionCameraGranted = true;
//           return true;
//         }

//         const requested: PermissionStatus = await Camera.requestPermissions();
//         if (requested.camera === 'granted') {
//           this.permissionCameraGranted = true;
//           return true;
//         }
//         return false;
//       } catch (error) {
//         console.error('Error al solicitar permisos de cámara:', error);
//         return false;
//       }
//     }

//     return true;
//   }

//   async myLocation() {
//     if (!this.permissionLocationGranted) {
//       await this.showPermissionDeniedAlert('ubicación');
//       throw new Error('Permiso de ubicación no concedido');
//     }
//     try {
//       const coordinates = await Geolocation.getCurrentPosition();
//       const { latitude, longitude } = coordinates.coords;
//       return { latitude, longitude };
//     } catch (error) {
//       console.error('Error al obtener ubicación:', error);
//       throw error;
//     }
//   }

//   async myPhoto() {
//     if (!this.permissionCameraGranted) {
//       await this.showPermissionDeniedAlert('cámara');
//       throw new Error('Permiso de cámara no concedido');
//     }
//     try {
//       return await Camera.getPhoto({
//         quality: 60,
//         allowEditing: false,
//         resultType: CameraResultType.DataUrl,
//         source: CameraSource.Camera,
//       });
//     } catch (error) {
//       console.error('Error al abrir cámara:', error);
//       throw error;
//     }
//   }

//   private async showPermissionDeniedAlert(item: string) {
//     const alert = await this.alertController.create({
//       header: 'Permiso denegado',
//       message: `El permiso de ${item} ha sido denegado. Por favor, habilítalo manualmente en la configuración del dispositivo para usar esta función.`,
//       buttons: ['Aceptar'],
//     });
//     await alert.present();
//   }
// }

import { inject, Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform, AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import {
  Camera,
  PermissionStatus,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  platform: Platform = inject(Platform);
  alertController: AlertController = inject(AlertController);

  async checkAndRequestLocationPermission(): Promise<boolean> {
    if (
      Capacitor.isNativePlatform() &&
      (this.platform.is('android') || this.platform.is('ios'))
    ) {
      try {
        const permStatus = await Geolocation.checkPermissions();

        if (permStatus.location === 'granted') {
          return true;
        }

        const requested = await Geolocation.requestPermissions();
        return requested.location === 'granted';
      } catch (error) {
        console.error('Error al solicitar permisos de ubicación:', error);
        return false;
      }
    }

    return true; // En web
  }

  async checkRequestCameraPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true; // En web no se requiere
    }

    try {
      let status: PermissionStatus = await Camera.checkPermissions();

      if (status.camera !== 'granted') {
        status = await Camera.requestPermissions();
      }

      const granted =
        status.camera === 'granted' || status.photos === 'granted';
      return granted;
    } catch (error) {
      console.error('Error al solicitar permisos de cámara:', error);
      return false;
    }
  }

  async myLocation() {
    const hasPermission = await this.checkAndRequestLocationPermission();

    if (!hasPermission) {
      await this.showPermissionDeniedAlert('ubicación');
      throw new Error('Permiso de ubicación no concedido');
    }

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;
      return { latitude, longitude };
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      throw error;
    }
  }

  async myPhoto() {
    const hasPermission = await this.checkRequestCameraPermission();

    if (!hasPermission) {
      await this.showPermissionDeniedAlert('cámara');
      throw new Error('Permiso de cámara no concedido');
    }

    try {
      return await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
    } catch (error) {
      console.error('Error al abrir cámara:', error);
      throw error;
    }
  }

  private async showPermissionDeniedAlert(item: string) {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: `El permiso de ${item} ha sido denegado. Por favor, habilítalo manualmente en la configuración del dispositivo para usar esta función.`,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
