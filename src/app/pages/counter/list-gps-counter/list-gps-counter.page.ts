import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription, debounceTime, finalize } from 'rxjs';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { Account } from 'src/app/models/authentication/account';
import { ColumnConfig } from 'src/app/models/column-config.model';
import { ResponseListItem } from 'src/app/models/response-list-item.model';
import { Location_route } from 'src/app/models/route/location_route.model';
import { DataPage } from 'src/app/models/shared/dataPage';
import { LoginObservable } from 'src/app/observables/login.observable';
import { RouteObservable } from 'src/app/observables/route.observable';
import { CounterPipe } from 'src/app/pipes/counter/counter.pipe';
import { DatabasePipe } from 'src/app/pipes/data-base/database.pipe';
import { DataListService } from 'src/app/services/data-list.service';
import { HttpDataBaseService } from 'src/app/services/database/http-database.service';
import { SharePanelService } from 'src/app/services/panel-share.service';
import { HttpRouteService } from 'src/app/services/route/http-route.service';

@Component({
  selector: 'app-list-gps-counter',
  templateUrl: './list-gps-counter.page.html',
  styleUrls: ['./list-gps-counter.page.scss'],
  standalone: true,
  imports: [IonicModule, ListItemComponent],
})
export class ListGpsCounterPage implements OnInit, OnDestroy {
  private router: Router = inject(Router);

  private snackBar: MatSnackBar = inject(MatSnackBar);
  private httpRouteService: HttpRouteService = inject(HttpRouteService);
  private dataListService: DataListService = inject(DataListService);
  private sharePanelService: SharePanelService = inject(SharePanelService);
  private routeObservable: RouteObservable = inject(RouteObservable);

  currentLocation: Location_route | null;

  listSubscription: Subscription[];
  dataPage: DataPage;
  loading: boolean = true;
  columns: ColumnConfig[] = [];
  counterPipe: CounterPipe = new CounterPipe();

  constructor() {
    this.columns = [
      {
        id: crypto.randomUUID(),
        head: 'Contador',
        name: 'meter_serial',
        type: 'text',
        size: 3,
      },
      {
        id: crypto.randomUUID(),
        head: 'Ubicación',
        name: 'address',
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
    this.listSubscription = initializeListSubscription(4);

    this.currentLocation = this.routeObservable.getData();
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
    this.listSubscription[0] = this.sharePanelService.dataInput$
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        if (!value || value.trim() == '') {
          this.sharePanelService.autoComplete$.emit([]);
          return;
        }

        if (!this.currentLocation) {
          this.sharePanelService.autoComplete$.emit([]);
          return;
        }

        this.httpRouteService
          .autoCompletedGpsCounterByRoute({
            filter: 'fail',
            word: value,
            route_id: this.currentLocation?.id,
          })
          .subscribe(({ data }) => {
            const listAutocompleted: string[] = Object.keys(data).map(
              (itr) => data[itr]
            );
            this.sharePanelService.autoComplete$.emit(listAutocompleted);
          });
      });
  }

  private subscriptionSearch(): void {
    this.listSubscription[1] = this.sharePanelService.search$.subscribe(
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
    if (!this.currentLocation) return;

    this.httpRouteService
      .gpsCounterByRoute({
        filter: 'fail',
        route_id: this.currentLocation.id,
        offset: this.dataPage.dataPaginator.offset,
        limit: this.dataPage.dataPaginator.limit,
        option: 1,
        ...(this.dataPage.dataPaginator.search === ''
          ? {}
          : { search: this.dataPage.dataPaginator.search }),
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ data }) => {
          const { list } = data;
          console.log(list);
          this.dataPage = this.dataListService.updateDataList(
            this.dataPage,
            list,
            'tableCounter'
          );
        },
        () => {
          this.snackBar.open('Error de carga', '', {
            duration: 2500,
            panelClass: ['snackBar_error'],
          });
        }
      );
  }

  selectColumn({ data, operation }: ResponseListItem): void {
    if (operation !== 'view') return;
  }

  resetAndRefresh(): void {
    this.sharePanelService.resetInput$.emit();
    this.dataPage = this.dataListService.buildDataList();

    this.refresh();
  }
}
