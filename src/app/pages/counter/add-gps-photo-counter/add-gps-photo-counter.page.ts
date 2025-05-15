import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CarouselImageComponent } from 'src/app/components/carousel-image/carousel-image.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { MaterialComponents } from 'src/app/material/material.module';
import { AttachFile } from 'src/app/models/attach-file.model';
import { Location_route } from 'src/app/models/route/location_route.model';
import { RouteObservable } from 'src/app/observables/route.observable';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-add-gps-photo-counter',
  templateUrl: './add-gps-photo-counter.page.html',
  styleUrls: ['./add-gps-photo-counter.page.scss'],
  standalone: true,
  imports: [
    MaterialComponents,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselImageComponent,
  ],
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
export class AddGpsPhotoCounterPage implements OnInit, OnDestroy {
  formGroup: FormGroup;
  private formBuilder: FormBuilder = inject(FormBuilder);
  private routeObservable: RouteObservable = inject(RouteObservable);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public fileService: FileService = inject(FileService);

  files: AttachFile[] = [];
  listSubscription: Subscription[];
  currentLocation: Location_route | null = null;
  viewFormGps: boolean = false;
  constructor() {
    this.formGroup = this.formBuilder.group({
      id: [''],
      counter_serie: [''],
      section: [''],
      address: ['-'],

      gps_id: [''],
      latitude: ['-'],
      longitude: ['-'],
    });

    this.listSubscription = initializeListSubscription(2);
  }

  ngOnInit() {
    this.subscriptionQueryParams();
    this.subscriptionRoute();
  }

  ngOnDestroy() {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  private subscriptionQueryParams(): void {
    this.listSubscription[0] = this.activatedRoute.queryParams.subscribe(
      ({ data }) => {
        const { id, meter_serial, address, section, gps, photos } = JSON.parse(
          atob(data)
        );

        this.formGroup.get('id')?.setValue(id, { emitEvent: false });
        this.formGroup
          .get('counter_serie')
          ?.setValue(meter_serial, { emitEvent: false });
        this.formGroup.get('section')?.setValue(section, { emitEvent: false });
        this.formGroup.get('address')?.setValue(address, { emitEvent: false });

        if (gps) {
          this.viewFormGps = true;
          if (gps.latitude != 0 && gps.longitude != 0) {
          } else if (this.currentLocation) {
          }
        }
      }
    );
  }

  private subscriptionRoute(): void {
    this.listSubscription[1] = this.routeObservable.data$.subscribe(
      (res: Location_route | null) => {
        if (!res) return;

        this.currentLocation = res;
      }
    );
  }

  myLocation(): void {
    navigator.geolocation.getCurrentPosition((res: any) => {
      const { latitude, longitude } = res.coords;

      this.formGroup
        .get('longitude')
        ?.setValue(longitude, { emitEvent: false });
      this.formGroup.get('latitude')?.setValue(latitude, { emitEvent: false });
    });
  }
}
