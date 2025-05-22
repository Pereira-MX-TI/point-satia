import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { Location_route } from 'src/app/models/route/location_route.model';
import { CounterObservable } from 'src/app/observables/counters.observable';
import { RouteObservable } from 'src/app/observables/route.observable';
import { ListInformationService } from 'src/app/services/list-information.service';

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
export class DeleteCounterPage implements OnInit, OnDestroy {
  private routeObservable: RouteObservable = inject(RouteObservable);
  private alertController: AlertController = inject(AlertController);
  counterObservable: CounterObservable = inject(CounterObservable);

  loading: boolean = false;
  currentLocation: Location_route | null = null;
  listSubscription: Subscription[];

  constructor() {
    this.listSubscription = initializeListSubscription(2);
  }

  ngOnInit() {
    this.subscriptionRoute();
  }

  ngOnDestroy(): void {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  subscriptionRoute() {
    this.listSubscription[0] = this.routeObservable.data$.subscribe(
      (res: Location_route | null) => {
        this.currentLocation = res;
      }
    );
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
    const nameStore: string = `${this.currentLocation.name.replace(
      /\s+/g,
      ''
    )}-${this.currentLocation.id}`;

    this.counterObservable.updateData(nameStore, null);
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
