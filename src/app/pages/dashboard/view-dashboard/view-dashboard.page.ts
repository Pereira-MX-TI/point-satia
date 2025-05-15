import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { debounceTime, Subscription } from 'rxjs';
import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { MaterialComponents } from 'src/app/material/material.module';
import { Account } from 'src/app/models/authentication/account';
import { NavItem } from '../../../models/nav-item.model';

import { Location_route } from 'src/app/models/route/location_route.model';
import { LoginObservable } from 'src/app/observables/login.observable';
import { RouteObservable } from 'src/app/observables/route.observable';
import { RoutePipe } from 'src/app/pipes/route/route.pipe';
import { SummarizeWordPipe } from 'src/app/pipes/shared/summarize-word.pipe';
import { ListInformationService } from 'src/app/services/list-information.service';
import { Router, RouterLink } from '@angular/router';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';
import { Counter } from 'src/app/models/counter.model';
import { DataFilter } from 'src/app/models/DataFilterCounter.model';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.page.html',
  styleUrls: ['./view-dashboard.page.scss'],
  standalone: true,
  imports: [MaterialComponents, IonicModule, SummarizeWordPipe, RouterLink],
})
export class ViewDashboardPage implements OnInit, OnDestroy {
  private router: Router = inject(Router);

  private routeObservable: RouteObservable = inject(RouteObservable);
  private loginObservable: LoginObservable = inject(LoginObservable);
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);

  listSubscription: Subscription[];
  currentLocation: Location_route | null = null;
  dialog: Dialog = inject(Dialog);
  routePipe: RoutePipe = new RoutePipe();
  listNav: NavItem[] = [];
  totalRecords: {
    gps: number;
    photo: number;
  } | null = null;

  constructor() {
    this.listSubscription = initializeListSubscription(5);
  }

  ngOnInit(): void {
    this.subscriptionRoute();
    this.subscriptionLogin();
    this.subscriptionListInformation();
    this.subscriptionDataInput();
    this.checkTotalRecords();
    this.subscriptionSearch();
  }

  ngOnDestroy(): void {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  private subscriptionRoute(): void {
    this.listSubscription[0] = this.routeObservable.data$.subscribe(
      (res: Location_route | null) => (this.currentLocation = res)
    );
  }

  private subscriptionLogin(): void {
    this.listSubscription[1] = this.loginObservable.data$.subscribe(
      (res: Account | null) => {
        this.listNav = [];
        if (!res) return;

        if (res.user.type_user.id == 1) {
          this.listNav.push({
            url: '/DataBases',
            img: 'assets/db_api_icon.png',
            title: 'Base de datos',
          });
        }

        if (res.user.type_user.id == 1 || res.user.type_user.id == 6) {
          this.listNav.push({
            url: '/Routes',
            img: 'assets/route_icon.png',
            title: 'Ruta',
          });
        }

        this.listNav.push({
          url: '/DashBoard/Counters/List',
          img: 'assets/waterMeter_icon.png',
          title: 'Contadores',
        });

        this.listNav.push({
          url: '/DashBoard/Counters/Download',
          img: 'assets/download_icon.png',
          title: 'Descargar Datos',
        });

        this.listNav.push({
          url: '/DashBoard/Counters/Upload',
          img: 'assets/upload_icon.png',
          title: 'Subir Datos',
        });

        this.listNav.push({
          url: '/DashBoard/Counters/Delete',
          img: 'assets/delete_icon.png',
          title: 'Borrar Datos',
        });
      }
    );
  }

  private subscriptionListInformation(): void {
    this.listSubscription[2] =
      this.listInformationService.totalRecords$.subscribe(() =>
        this.checkTotalRecords()
      );
  }

  private subscriptionDataInput(): void {
    this.listSubscription[3] = this.listInformationService.dataInput$
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        if (this.router.url === '/DashBoard/Counters/List') return;

        if (!value || value.trim() == '') {
          this.listInformationService.autoComplete$.emit([]);
          return;
        }

        if (!this.currentLocation) {
          this.listInformationService.autoComplete$.emit([]);
          return;
        }

        const listWord: string[] = [];
        const nameStore: string = `route-${this.currentLocation?.id}`;

        this.ionicStorageService.get(nameStore).then((dataStore: any) => {
          if (!dataStore) return;
          const { list } = dataStore;

          list.forEach((itr: DataFilter) => {
            if (itr.meter_serial.toLowerCase().startsWith(value)) {
              listWord.push(itr.meter_serial);
            }

            if (itr.section.toLowerCase().startsWith(value)) {
              listWord.push(itr.section);
            }

            if (itr.address.toLowerCase().startsWith(value)) {
              listWord.push(itr.address);
            }
          });

          const uniqueListLowerCase: string[] = Array.from(
            new Set(listWord.map((word) => word.toLowerCase()))
          );

          this.listInformationService.autoComplete$.emit(uniqueListLowerCase);
        });
      });
  }

  private subscriptionSearch(): void {
    this.listSubscription[4] = this.listInformationService.search$.subscribe(
      (response: string) => {
        if (this.router.url === '/DashBoard/Counters/List') return;

        console.log(response);
      }
    );
  }

  checkTotalRecords(): void {
    if (!this.currentLocation) return;

    const nameStore: string = `route-${this.currentLocation.id}`;
    this.ionicStorageService.get(nameStore).then((dataStore: any) => {
      if (!dataStore) {
        this.totalRecords = null;
        return;
      }

      const { list } = dataStore;

      this.totalRecords = {
        photo: 0,
        gps: 0,
      };

      list.forEach((itr: Counter) => {
        if (itr.photos != undefined && itr.photos == 0)
          this.totalRecords!.photo++;

        if (
          itr.gps != undefined &&
          itr.gps.latitude == 0 &&
          itr.gps.longitude == 0
        )
          this.totalRecords!.gps++;
      });
    });
  }

  openSearchModal(): void {
    this.dialog.open<void>(SearchModalComponent);
  }

  closeSession(): void {
    this.loginObservable.updateData(null);
  }
}
