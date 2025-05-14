import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { SharePanelService } from 'src/app/services/panel-share.service';
import { HttpRouteService } from 'src/app/services/route/http-route.service';
import { IonicModule } from '@ionic/angular';
import { ResponseListItem } from 'src/app/models/response-list-item.model';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';

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
export class ListRoutePage implements OnInit, OnDestroy {
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);
  private dataListService: DataListService = inject(DataListService);
  private httpRouteService: HttpRouteService = inject(HttpRouteService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  private router: Router = inject(Router);
  private sharePanelService: SharePanelService = inject(SharePanelService);
  private routeObservable: RouteObservable = inject(RouteObservable);
  private loginObservable: LoginObservable = inject(LoginObservable);

  columns: ColumnConfig[] = [];

  routePipe: RoutePipe = new RoutePipe();
  listSubscription: Subscription[];
  dataPage: DataPage;
  is_master: boolean;
  loading: boolean = true;
  totalRecords: boolean = true;

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
    this.refresh();
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

        this.httpRouteService
          .autoCompletedLocation({ word: value })
          .subscribe(({ data }) => {
            const listAutocompleted: string[] = Object.keys(data).map(
              (itr) => data[itr]
            );
            this.listInformationService.autoComplete$.emit(listAutocompleted);
          });
      });
  }

  private subscriptionSearch(): void {
    this.listSubscription[1] = this.listInformationService.search$.subscribe(
      (response: string) => {
        this.dataPage.dataPaginator.search = response;

        this.changePagination();
      }
    );
  }

  changePagination(): void {
    this.dataPage.dataPaginator.pageIndex++;

    this.refresh();
  }

  refresh(): void {
    this.httpRouteService
      .getLocations({
        offset: this.dataPage.dataPaginator.offset,
        limit: this.dataPage.dataPaginator.limit,
        option: 'pagination',
        ...(this.totalRecords ? { totalRecords: true } : {}),
        addLocation: true,
        ...(this.dataPage.dataPaginator.search === ''
          ? {}
          : { search: this.dataPage.dataPaginator.search }),
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ data }) => {
          const { totalRecords, list, addLocation } = data;

          if (totalRecords) {
            this.dataPage.dataPaginator = this.dataListService.changePaginator(
              this.dataPage.dataPaginator,
              totalRecords
            );
          }
          this.dataPage = this.dataListService.updateDataList(
            this.dataPage,
            list,
            'tableLocation'
          );
          this.dataPage.btnAction = { add: addLocation };
          this.totalRecords = false;
        },
        () => {
          this.snackBar.open('Error de carga', '', {
            duration: 2000,
            panelClass: ['snackBar_error'],
          });
        }
      );
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
    this.sharePanelService.resetInput$.emit();
    this.dataPage = this.dataListService.buildDataList();

    this.refresh();
  }
}
