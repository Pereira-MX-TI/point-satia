import { trigger, transition, style, animate } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { NavBarSimpleComponent } from 'src/app/components/nav-bar-simple/nav-bar-simple.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { ColumnConfig } from 'src/app/models/column-config.model';
import { DataPage } from 'src/app/models/shared/dataPage';
import { LoginObservable } from 'src/app/observables/login.observable';
import { RouteObservable } from 'src/app/observables/route.observable';
import { RoutePipe } from 'src/app/pipes/route/route.pipe';
import { DataListService } from 'src/app/services/data-list.service';
import { ListInformationService } from 'src/app/services/list-information.service';
import { HttpRouteService } from 'src/app/services/route/http-route.service';
import { IonicModule } from '@ionic/angular';
import { ResponseListItem } from 'src/app/models/response-list-item.model';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';
import { NetworkStatusService } from 'src/app/services/network-status.service';
import { Location_route } from 'src/app/models/route/location_route.model';

@Component({
  selector: 'app-list-route',
  templateUrl: './list-route.page.html',
  styleUrls: ['./list-route.page.scss'],
  standalone: true,
  imports: [IonicModule, NavBarSimpleComponent, ListItemComponent],
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
export class ListRoutePage implements OnInit, AfterViewInit, OnDestroy {
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);
  private dataListService: DataListService = inject(DataListService);
  private httpRouteService: HttpRouteService = inject(HttpRouteService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  private router: Router = inject(Router);
  private routeObservable: RouteObservable = inject(RouteObservable);
  private loginObservable: LoginObservable = inject(LoginObservable);
  networkStatusService: NetworkStatusService = inject(NetworkStatusService);

  columns: ColumnConfig[] = [];

  routePipe: RoutePipe = new RoutePipe();
  listSubscription: Subscription[];
  dataPage: DataPage;
  is_master: boolean;
  loading: boolean = true;
  online: boolean = true;

  constructor() {
    this.columns = [
      {
        id: crypto.randomUUID(),
        head: '',
        name: 'logo',
        type: 'img',
        size: 3,
      },
      {
        id: crypto.randomUUID(),
        head: 'Nombre',
        name: 'name',
        type: 'text',
        size: 3,
      },
      {
        id: crypto.randomUUID(),
        head: '',
        name: 'btn',
        type: 'btn',
        size: 1,
        buttons: [{ icon: 'keyboard_arrow_right', operation: 'view' }],
      },
    ];

    this.dataPage = this.dataListService.buildDataList();
    this.is_master = this.loginObservable.isMasterRol();
    this.listSubscription = initializeListSubscription(3);
  }

  ngOnInit(): void {
    this.subscriptionDataInput();
    this.subscriptionSearch();
    this.subscriptionStatusNetwork();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.refresh();
    }, 500);
  }

  ngOnDestroy(): void {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  private subscriptionDataInput(): void {
    this.listSubscription[0] = this.listInformationService.dataInput$
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        if (!value || value.trim() == '') {
          this.listInformationService.autoComplete$.emit([]);
          return;
        }

        if (this.online) {
          this.httpRouteService
            .autoCompletedLocation({ word: value })
            .subscribe(({ data }) => {
              const listAutocompleted: string[] = Object.keys(data).map(
                (itr) => data[itr]
              );
              this.listInformationService.autoComplete$.emit(listAutocompleted);
            });

          return;
        }

        const listWord: string[] = [];

        this.ionicStorageService.get('routes').then(({ list }) => {
          list.forEach((itr: Location_route) => {
            if (itr.name.toLowerCase().startsWith(value)) {
              listWord.push(itr.name);
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
    this.listSubscription[1] = this.listInformationService.search$.subscribe(
      (response: string) => {
        this.loading = true;
        this.dataPage = this.dataListService.buildDataList();
        this.dataPage.dataPaginator.search = response;

        if (this.online) this.refresh();
        else this.searchOffline();
      }
    );
  }

  subscriptionStatusNetwork() {
    this.listSubscription[2] =
      this.networkStatusService.networkStatus$.subscribe((status) => {
        this.online = status;
      });
  }

  refresh(): void {
    if (this.online) {
      this.httpRouteService
        .getLocations({
          offset: this.dataPage.dataPaginator.offset,
          limit: this.dataPage.dataPaginator.limit,
          option: 'pagination',
          addLocation: true,
          ...(this.dataPage.dataPaginator.search === ''
            ? {}
            : { search: this.dataPage.dataPaginator.search }),
        })
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          ({ data }) => {
            const { list } = data;

            this.dataPage = this.dataListService.updateDataList(
              this.dataPage,
              list,
              'tableLocation'
            );

            this.ionicStorageService.set('routes', {
              list: this.dataPage.dataTable.dataSourceFilter,
            });
          },
          () => {
            this.snackBar.open('Error de carga', '', {
              duration: 2000,
              panelClass: 'snackBar_error',
            });
          }
        );

      return;
    }
    this.ionicStorageService.get('routes').then(({ list }) => {
      this.dataPage = this.dataListService.updateDataList(
        this.dataPage,
        list,
        'tableLocation'
      );

      this.loading = false;
    });
  }

  searchOffline(): void {
    this.loading = true;
    const listData: any[] = [];

    this.ionicStorageService.get('routes').then((dataStore: any) => {
      const { list } = dataStore;

      list.forEach((itr: Location_route) => {
        if (
          itr.name.toLowerCase().includes(this.dataPage.dataPaginator.search)
        ) {
          listData.push(itr);
        }
      });

      setTimeout(() => {
        this.dataPage = this.dataListService.updateDataList(
          this.dataPage,
          listData,
          'tableLocation'
        );

        this.loading = false;
      }, 1000);
    });
  }

  selectColumn({ data, operation }: ResponseListItem): void {
    if (operation !== 'view') {
      return;
    }
    this.routeObservable.updateData(data);

    const nameStore: string = atob(data.name);
    this.ionicStorageService.get(nameStore).then((dataStore: any) => {
      if (!dataStore) {
        this.router.navigateByUrl('DashBoard/Counters/Download');
        return;
      }

      this.router.navigateByUrl('DashBoard/Counters/List');
    });
  }

  resetAndRefresh(): void {
    this.listInformationService.resetInput$.emit();
    this.dataPage = this.dataListService.buildDataList();

    this.loading = true;
    this.refresh();
  }
}
