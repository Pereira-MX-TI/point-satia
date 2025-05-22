import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertController, IonicModule } from '@ionic/angular';
import { finalize, Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { Counter } from 'src/app/models/counter.model';
import { Location_route } from 'src/app/models/route/location_route.model';
import { CounterObservable } from 'src/app/observables/counters.observable';
import { RouteObservable } from 'src/app/observables/route.observable';
import { ListInformationService } from 'src/app/services/list-information.service';
import { NetworkStatusService } from 'src/app/services/network-status.service';
import { HttpRouteService } from 'src/app/services/route/http-route.service';

@Component({
  selector: 'app-upload-counter',
  templateUrl: './upload-counter.page.html',
  styleUrls: ['./upload-counter.page.scss'],
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
export class UploadCounterPage implements OnInit {
  currentLocation: Location_route | null = null;
  private routeObservable: RouteObservable = inject(RouteObservable);
  private alertController: AlertController = inject(AlertController);
  networkStatusService: NetworkStatusService = inject(NetworkStatusService);
  counterObservable: CounterObservable = inject(CounterObservable);
  private httpRouteService: HttpRouteService = inject(HttpRouteService);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  loading: boolean = false;
  online: boolean = true;
  listSubscription: Subscription[];
  listCounter: Array<Counter> = [];

  constructor() {
    this.listSubscription = initializeListSubscription(3);
  }

  ngOnInit() {
    this.subscriptionStatusNetwork();
    this.subscriptionCounter();
    this.subscriptionRoute();
  }

  ngOnDestroy(): void {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  subscriptionStatusNetwork() {
    this.listSubscription[0] =
      this.networkStatusService.networkStatus$.subscribe((status) => {
        this.online = status;
      });
  }

  private subscriptionCounter(): void {
    this.listSubscription[1] = this.counterObservable.data$.subscribe(
      (res: Array<Counter> | null) => {
        if (!res) {
          this.listCounter = [];
          return;
        }

        this.listCounter = res;
      }
    );
  }

  subscriptionRoute() {
    this.listSubscription[2] = this.routeObservable.data$.subscribe(
      (res: Location_route | null) => {
        this.currentLocation = res;
      }
    );
  }

  register(): void {
    if (!this.online) {
      this.presentAlert(
        'Offline',
        'Es necesario conexión a internet para la subida.'
      );
      return;
    }

    if (this.listCounter.length === 0) {
      this.presentAlert('Datos', 'No se tiene información descargada.');
      return;
    }

    const listNewData: Array<Counter> = this.checkDataStore();
    if (listNewData.length === 0) {
      this.presentAlert('Datos', 'No se ha almacenado nueva información.');
      return;
    }

    this.questionAlert(listNewData);
  }

  async questionAlert(list: Array<Counter>) {
    const alert = await this.alertController.create({
      header: 'Insertar',
      backdropDismiss: false,
      message: '¿Desea continuar con la inserción?',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.uploadData(list);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      backdropDismiss: false,
      message,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  checkDataStore(): Array<Counter> {
    return this.listCounter
      .filter(
        (itrCounter: Counter) =>
          (itrCounter.photos && itrCounter.photos.length > 0) ||
          (itrCounter.gps &&
            itrCounter.gps.latitude !== 0 &&
            itrCounter.gps.longitude !== 0)
      )
      .map((counter) => ({ ...counter }));
  }

  uploadData(list: Array<Counter>): void {
    if (!this.currentLocation) return;

    const nameStore: string = `${this.currentLocation.name.replace(
      /\s+/g,
      ''
    )}-${this.currentLocation.id}`;

    this.loading = true;

    this.httpRouteService
      .uploadPhotosAndGpsByRoute({
        route_id: this.currentLocation.id,
        list,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ data }) => {
          this.clearArrayCounter(data);
          this.counterObservable.updateData(nameStore, this.listCounter);

          this.presentAlert(
            'Carga',
            'Se ha subido toda la información correctamente'
          );
        },
        () => {
          this.snackBar.open('Error de carga', '', {
            duration: 2500,
            panelClass: 'snackBar_error',
          });
        }
      );
  }

  clearArrayCounter(
    list: { id: number | string; gps?: 'done'; photos?: 'done' }[]
  ): void {
    list.forEach((itr) => {
      const index = this.listCounter.findIndex(
        (item: Counter) => item.id === itr.id
      );

      if (index === -1) {
        return;
      }
      const item = this.listCounter[index];

      if (itr.photos === 'done' && 'photos' in item) {
        delete item.photos;
      }

      if (itr.gps === 'done' && 'gps' in item) {
        delete item.gps;
      }

      // Si el objeto ya no tiene ni photos ni gps, lo quitamos del array
      const hasPhotos = 'photos' in item;
      const hasGps = 'gps' in item;

      if (!hasPhotos && !hasGps) {
        this.listCounter.splice(index, 1);
      }
    });
  }
}
