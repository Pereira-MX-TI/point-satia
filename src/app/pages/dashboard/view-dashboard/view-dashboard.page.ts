import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { debounceTime, Subscription } from 'rxjs';
import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { MaterialComponents } from 'src/app/material/material.module';
import { Account } from 'src/app/models/authentication/account';
import { NavItem } from '../../../models/nav-item.model';
import { Location } from '@angular/common';

import { Location_route } from 'src/app/models/route/location_route.model';
import { LoginObservable } from 'src/app/observables/login.observable';
import { RouteObservable } from 'src/app/observables/route.observable';
import { RoutePipe } from 'src/app/pipes/route/route.pipe';
import { SummarizeWordPipe } from 'src/app/pipes/shared/summarize-word.pipe';
import { ListInformationService } from 'src/app/services/list-information.service';
import { Router, RouterLink } from '@angular/router';
import { Counter } from 'src/app/models/counter.model';
import { CounterObservable } from 'src/app/observables/counters.observable';
import { NetworkStatusService } from 'src/app/services/network-status.service';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.page.html',
  styleUrls: ['./view-dashboard.page.scss'],
  standalone: true,
  imports: [MaterialComponents, IonicModule, SummarizeWordPipe, RouterLink],
})
export class ViewDashboardPage implements OnInit, OnDestroy {
  public router: Router = inject(Router);
  public location: Location = inject(Location);

  networkStatusService: NetworkStatusService = inject(NetworkStatusService);
  counterObservable: CounterObservable = inject(CounterObservable);
  private routeObservable: RouteObservable = inject(RouteObservable);
  private loginObservable: LoginObservable = inject(LoginObservable);
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );

  listCounter: Array<Counter> = [];
  listSubscription: Subscription[];
  currentLocation: Location_route | null = null;
  dialog: Dialog = inject(Dialog);
  routePipe: RoutePipe = new RoutePipe();
  listNav: NavItem[] = [];
  search: string = '';
  online: boolean = true;

  totalRecords: {
    gps: number;
    photo: number;
  } | null = null;

  constructor() {
    this.listSubscription = initializeListSubscription(7);
  }

  ngOnInit(): void {
    this.subscriptionStatusNetwork();
    this.subscriptionRoute();
    this.subscriptionDataInput();
    this.subscriptionSearch();
    this.subscriptionCounter();
    this.subscriptionResetInput();
    this.subscriptionLogin();
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

  private subscriptionRoute(): void {
    this.listSubscription[1] = this.routeObservable.data$.subscribe(
      (res: Location_route | null) => {
        this.currentLocation = res;

        if (!this.currentLocation) return;

        const nameStore: string = `${this.currentLocation.name.replace(
          /\s+/g,
          ''
        )}-${this.currentLocation.id}`;
        this.counterObservable.checkLocalStoreData(nameStore);
      }
    );
  }

  private subscriptionDataInput(): void {
    this.listSubscription[2] = this.listInformationService.dataInput$
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
        value = value.toLowerCase();

        this.listCounter.forEach((itr: Counter) => {
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
  }

  private subscriptionSearch(): void {
    this.listSubscription[3] = this.listInformationService.search$.subscribe(
      (value: string) => {
        this.search = value;
        if (this.router.url === '/DashBoard/Counters/List') return;

        console.log('subscriptionSearch: ', value);
        console.log('listCounter: ', this.listCounter);

        this.listCounter.forEach((itr: Counter) => {
          if (itr.meter_serial === value) {
            console.log('done');

            this.router.navigate(['DashBoard/Counters/AddGpsAndPhoto'], {
              queryParams: {
                data: btoa(
                  JSON.stringify({
                    id: itr.id,
                    meter_serial: itr.meter_serial,
                  })
                ),
              },
            });

            return;
          }
        });
      }
    );
  }

  private subscriptionCounter(): void {
    this.listSubscription[4] = this.counterObservable.data$.subscribe(
      (res: Array<Counter> | null) => {
        if (!res) {
          this.listCounter = [];

          this.totalRecords = {
            photo: 0,
            gps: 0,
          };
          return;
        }

        this.listCounter = res;
        this.checkTotalRecords(res);
      }
    );
  }

  private subscriptionResetInput(): void {
    this.listSubscription[5] =
      this.listInformationService.resetInput$.subscribe(() => {
        this.search = '';
      });
    return;
  }

  private subscriptionLogin(): void {
    this.listSubscription[6] = this.loginObservable.data$.subscribe(
      (res: Account | null) => {
        this.listNav = [];
        if (!res) return;

        if (res.user.type_user.id == 1 && this.online) {
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

  checkTotalRecords(list: Array<Counter>): void {
    if (!this.currentLocation) return;

    this.totalRecords = {
      photo: 0,
      gps: 0,
    };

    list.forEach((itr: Counter) => {
      if (itr.photos != undefined && itr.photos.length == 0)
        this.totalRecords!.photo++;

      if (
        itr.gps != undefined &&
        itr.gps.latitude == 0 &&
        itr.gps.longitude == 0
      )
        this.totalRecords!.gps++;
    });
  }

  openSearchModal(): void {
    this.dialog.open<void>(SearchModalComponent, { data: this.search });
  }

  closeSession(): void {
    this.loginObservable.updateData(null);
  }
}
