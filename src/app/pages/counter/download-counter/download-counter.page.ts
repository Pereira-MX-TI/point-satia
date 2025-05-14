import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertController, IonicModule } from '@ionic/angular';
import { finalize, zip } from 'rxjs';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { Location_route } from 'src/app/models/route/location_route.model';
import { RouteObservable } from 'src/app/observables/route.observable';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';
import { ListInformationService } from 'src/app/services/list-information.service';
import { HttpRouteService } from 'src/app/services/route/http-route.service';

@Component({
  selector: 'app-download-counter',
  templateUrl: './download-counter.page.html',
  styleUrls: ['./download-counter.page.scss'],
  standalone: true,
  imports: [IonicModule, LoadingComponent],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.5s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DownloadCounterPage implements OnInit {
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  private httpRouteService: HttpRouteService = inject(HttpRouteService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  currentLocation: Location_route | null;
  private routeObservable: RouteObservable = inject(RouteObservable);
  private alertController: AlertController = inject(AlertController);
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);

  loading: boolean = false;

  constructor() {
    this.currentLocation = this.routeObservable.getData();
  }

  ngOnInit() {}

  register(): void {
    this.loading = true;
    if (!this.currentLocation) return;

    zip(
      this.httpRouteService.gpsCounterByRoute({
        filter: 'fail',
        route_id: this.currentLocation.id,
        option: 0,
      }),
      this.httpRouteService.photosCounterByRoute({
        route_id: this.currentLocation.id,
        option: 0,
      })
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any[]) => {
          const nameStore: string = atob(this.currentLocation!.name);
          const { list: gpsListSimple } = res[0].data;
          const { list: photoListSimple } = res[1].data;

          this.ionicStorageService.get(nameStore).then((dataStore: any) => {
            if (dataStore) {
              this.checkAndSaveStore(
                nameStore,
                gpsListSimple,
                photoListSimple,
                dataStore
              );
            } else {
              this.saveStore(nameStore, gpsListSimple, photoListSimple);
            }
          });
        },
        () => {
          this.snackBar.open('Error de carga', '', {
            duration: 2500,
            panelClass: ['snackBar_error'],
          });
        }
      );
  }

  checkAndSaveStore(
    nameStore: string,
    gpsListSimple: Array<any>,
    photoListSimple: Array<any>,
    dataStore: any
  ): void {
    const {
      gpsData: { list: gpsListStore },
      photoData: { list: photoListStore },
    } = dataStore;

    const gpsListComplete: any[] = gpsListSimple.map((itrGps) => ({
      id: itrGps.water_meter_id,
      meter_serial: itrGps.meter_serial,
      section: itrGps.section,
      address: itrGps.address,
      gps: {
        id: itrGps.gps_id,
        latitude: 0,
        longitude: 0,
      },
    }));

    const photoListComplete: any[] = photoListSimple.map((itrPhoto) => ({
      id: itrPhoto.water_meter_id,
      meter_serial: itrPhoto.meter_serial,
      section: itrPhoto.section,
      address: itrPhoto.address,
      photos: 0,
    }));

    const gpsListToAdd = gpsListComplete
      .filter(
        (item) => !gpsListStore.some((stored: any) => stored.id === item.id)
      )
      .map((item) => ({ ...item }));

    const photoListToAdd = photoListComplete
      .filter(
        (item) => !photoListStore.some((stored: any) => stored.id === item.id)
      )
      .map((item) => ({ ...item }));

    const list: Array<any> = this.mergeList(
      [...gpsListStore, ...gpsListToAdd],
      [...photoListStore, ...photoListToAdd]
    );

    this.ionicStorageService.set(nameStore, {
      list,
      gpsTotalRecords: gpsListComplete.length,
      photoTotalRecords: photoListComplete.length,
    });

    this.presentAlert();
  }

  saveStore(
    nameStore: string,
    gpsListSimple: Array<any>,
    photoListSimple: Array<any>
  ): void {
    const gpsListComplete: any[] = gpsListSimple.map((itrGps) => ({
      id: itrGps.water_meter_id,
      meter_serial: itrGps.meter_serial,
      section: itrGps.section,
      address: itrGps.address,
      gps: {
        id: itrGps.gps_id,
        latitude: 0,
        longitude: 0,
      },
    }));

    const photoListComplete: any[] = photoListSimple.map((itrPhoto) => ({
      id: itrPhoto.water_meter_id,
      meter_serial: itrPhoto.meter_serial,
      section: itrPhoto.section,
      address: itrPhoto.address,
      photos: 0,
    }));

    const list: Array<any> = this.mergeList(gpsListComplete, photoListComplete);

    console.log(list);

    this.ionicStorageService.set(nameStore, {
      list,
      gpsTotalRecords: gpsListComplete.length,
      photoTotalRecords: photoListComplete.length,
    });

    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Descarga',
      backdropDismiss: false,
      message: 'Se ha descargado toda la información correctamente',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            this.listInformationService.totalRecords$.emit();
          },
        },
      ],
    });

    await alert.present();
  }

  mergeList(gpsList: any[], photoList: any[]): Array<any> {
    const combinedMap = new Map<number, any>();

    // Primero agregamos todos los elementos de gpsListComplete al mapa
    for (const gpsItem of gpsList) {
      combinedMap.set(gpsItem.id, { ...gpsItem }); // Clonamos para evitar mutación
    }

    // Luego iteramos sobre photoListComplete y combinamos si ya existe, o agregamos nuevo
    for (const photoItem of photoList) {
      const existingItem = combinedMap.get(photoItem.id);

      if (existingItem) {
        // Combinar: mantenemos datos de ambos
        combinedMap.set(photoItem.id, {
          ...existingItem,
          ...photoItem,
          gps: existingItem.gps, // aseguramos no sobreescribir gps si photoItem no lo tiene
          photos: photoItem.photos, // aseguramos agregar las fotos
        });
      } else {
        combinedMap.set(photoItem.id, { ...photoItem });
      }
    }

    // Convertimos a arreglo final
    return Array.from(combinedMap.values());
  }
}
