import { trigger, transition, style, animate } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { Counter } from 'src/app/models/counter.model';
import { CounterObservable } from 'src/app/observables/counters.observable';
import { PermissionService } from 'src/app/services/permission.service';

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
export class AddGpsPhotoCounterPage
  implements OnInit, OnDestroy, AfterViewInit
{
  formGroup: FormGroup;
  private formBuilder: FormBuilder = inject(FormBuilder);
  private routeObservable: RouteObservable = inject(RouteObservable);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  counterObservable: CounterObservable = inject(CounterObservable);
  permissionService: PermissionService = inject(PermissionService);

  listCounter: Array<Counter> = [];
  files: AttachFile[] = [];
  listSubscription: Subscription[];
  currentLocation: Location_route | null = null;
  viewFormGps: boolean = false;
  viewFormPhotos: boolean = false;

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

    this.listSubscription = initializeListSubscription(3);
  }

  ngOnInit() {
    this.subscriptionQueryParams();
    this.subscriptionRoute();
    this.subscriptionCounter();
  }

  ngOnDestroy() {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.refresh(), 200);
  }

  private subscriptionQueryParams(): void {
    this.listSubscription[0] = this.activatedRoute.queryParams.subscribe(
      ({ data }) => {
        const { id, meter_serial } = JSON.parse(atob(data));

        this.formGroup.get('id')?.setValue(id, { emitEvent: false });
        this.formGroup
          .get('counter_serie')
          ?.setValue(meter_serial, { emitEvent: false });
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

  private subscriptionCounter(): void {
    this.listSubscription[2] = this.counterObservable.data$.subscribe(
      (res: Array<Counter> | null) => {
        if (!res) return;

        this.listCounter = res;
      }
    );
  }

  async myLocation() {
    try {
      const { latitude, longitude } = await this.permissionService.myLocation();

      this.formGroup.get('latitude')?.setValue(latitude, { emitEvent: false });
      this.formGroup.get('latitude')?.setValue(latitude, { emitEvent: false });

      this.formGroup
        .get('longitude')
        ?.setValue(longitude, { emitEvent: false });
      this.formGroup
        .get('longitude')
        ?.setValue(longitude, { emitEvent: false });

      this.updateGpsStore();
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  }

  refresh(): void {
    if (!this.currentLocation) return;

    const { id: counter_id } = this.formGroup.getRawValue();

    this.listCounter.forEach((itrCounter: Counter) => {
      if (itrCounter.id !== counter_id) return;

      const { address, section, gps, photos } = itrCounter;

      this.formGroup.get('section')?.setValue(section, { emitEvent: false });
      this.formGroup.get('address')?.setValue(address, { emitEvent: false });

      if (gps != undefined) {
        const { latitude, longitude } = gps;

        this.viewFormGps = true;
        if (latitude != 0 && longitude != 0) {
          this.formGroup
            .get('latitude')
            ?.setValue(latitude, { emitEvent: false });
          this.formGroup
            .get('longitude')
            ?.setValue(longitude, { emitEvent: false });
        }
      }

      if (photos != undefined) {
        this.viewFormPhotos = true;
        this.files = photos;
      }
    });
  }

  updateGpsStore(): void {
    if (!this.currentLocation) return;

    const nameStore: string = `${this.currentLocation.name.replace(
      /\s+/g,
      ''
    )}-${this.currentLocation.id}`;

    const {
      id: counter_id,
      latitude,
      longitude,
    } = this.formGroup.getRawValue();

    this.listCounter.forEach((itr: Counter) => {
      if (itr.id === counter_id && itr.gps) {
        itr.gps.latitude = latitude;
        itr.gps.longitude = longitude;
      }
    });

    this.counterObservable.updateData(nameStore, this.listCounter);
  }

  updatePhotosStore(list: Array<AttachFile>): void {
    if (!this.currentLocation) return;

    this.files = list;
    const nameStore: string = `${this.currentLocation.name.replace(
      /\s+/g,
      ''
    )}-${this.currentLocation.id}`;

    const { id: counter_id } = this.formGroup.getRawValue();

    this.listCounter.forEach((itr: Counter) => {
      if (itr.id === counter_id && itr.photos) {
        itr.photos = list;
      }
    });

    this.counterObservable.updateData(nameStore, this.listCounter);
  }
}
