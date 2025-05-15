import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { Location_route } from 'src/app/models/route/location_route.model';
import { RouteObservable } from 'src/app/observables/route.observable';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';
import { ListInformationService } from 'src/app/services/list-information.service';
import { NetworkStatusService } from 'src/app/services/network-status.service';
import { HttpRouteService } from 'src/app/services/route/http-route.service';

@Component({
  selector: 'app-delete-data-counter',
  templateUrl: './delete-data-counter.page.html',
  styleUrls: ['./delete-data-counter.page.scss'],
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
export class DeleteCounterPage {
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  private routeObservable: RouteObservable = inject(RouteObservable);
  private alertController: AlertController = inject(AlertController);
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);
  loading: boolean = false;
  currentLocation: Location_route | null = null;

  constructor() {
    this.currentLocation = this.routeObservable.getData();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminación',
      backdropDismiss: false,
      message: '¿Desea continuar con la eliminación?',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteStore();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteStore(): void {
    if (!this.currentLocation) return;
    const nameStore: string = `route-${this.currentLocation.id}`;

    this.ionicStorageService.remove(nameStore);
    this.listInformationService.totalRecords$.emit();
    this.successDeleteAlert();
  }

  async successDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminación',
      backdropDismiss: false,
      message: 'Se ha eliminado toda la información correctamente',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}
