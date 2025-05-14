import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertController, IonicModule } from '@ionic/angular';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { Location_route } from 'src/app/models/route/location_route.model';
import { RouteObservable } from 'src/app/observables/route.observable';
import { ListInformationService } from 'src/app/services/list-information.service';
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
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );

  currentLocation: Location_route | null;
  private routeObservable: RouteObservable = inject(RouteObservable);
  private alertController: AlertController = inject(AlertController);
  loading: boolean = false;

  constructor() {
    this.currentLocation = this.routeObservable.getData();
  }

  ngOnInit() {}

  register(): void {
    this.loading = true;
    if (!this.currentLocation) return;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Descarga',
      backdropDismiss: false,
      message: 'Se ha subido toda la información correctamente',
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
}
