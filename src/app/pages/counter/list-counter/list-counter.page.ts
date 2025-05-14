import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription, debounceTime, filter, finalize } from 'rxjs';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { ColumnConfig } from 'src/app/models/column-config.model';
import { ResponseListItem } from 'src/app/models/response-list-item.model';
import { Location_route } from 'src/app/models/route/location_route.model';
import { DataPage } from 'src/app/models/shared/dataPage';
import { RouteObservable } from 'src/app/observables/route.observable';
import { CounterPipe } from 'src/app/pipes/counter/counter.pipe';
import { DataListService } from 'src/app/services/data-list.service';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';
import { SharePanelService } from 'src/app/services/panel-share.service';

interface DataFilter {
  meter_serial: string;
  address: string;
  section: string;
}
@Component({
  selector: 'app-list-counter',
  templateUrl: './list-counter.page.html',
  styleUrls: ['./list-counter.page.scss'],
  standalone: true,
  imports: [IonicModule, ListItemComponent],
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
export class ListCounterPage implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private dataListService: DataListService = inject(DataListService);
  private sharePanelService: SharePanelService = inject(SharePanelService);
  private routeObservable: RouteObservable = inject(RouteObservable);
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);

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
    this.listSubscription = initializeListSubscription(3);

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

        const listWord: string[] = [];
        const nameStore: string = atob(this.currentLocation.name);

        this.ionicStorageService.get(nameStore).then((dataStore: any) => {
          const {
            gpsData: { list },
          } = dataStore;

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

          this.sharePanelService.autoComplete$.emit(uniqueListLowerCase);
        });
      });
  }

  private subscriptionSearch(): void {
    this.listSubscription[1] = this.sharePanelService.search$.subscribe(
      (response: string) => {
        this.dataPage.dataPaginator.search = response;
        this.search();
      }
    );
  }

  changePagination(): void {
    this.refresh();
  }

  refresh(): void {
    if (!this.currentLocation) return;

    const nameStore: string = atob(this.currentLocation.name);
    this.ionicStorageService.get(nameStore).then((dataStore: any) => {
      if (!dataStore) {
        this.loading = false;
        return;
      }

      const { list, totalRecords } = dataStore;

      setTimeout(() => {
        if (totalRecords) {
          this.dataPage.dataPaginator = this.dataListService.changePaginator(
            this.dataPage.dataPaginator,
            totalRecords
          );
        }
        this.dataPage = this.dataListService.updateDataList(
          this.dataPage,
          list,
          'tableGpsCounter'
        );

        this.loading = false;
      }, 1000);
    });
  }

  search(): void {
    if (!this.currentLocation) return;

    this.loading = true;
    const listData: any[] = [];
    const nameStore: string = atob(this.currentLocation.name);

    this.ionicStorageService.get(nameStore).then((dataStore: any) => {
      const {
        gpsData: { list },
      } = dataStore;

      list.forEach((itr: DataFilter) => {
        if (
          itr.meter_serial
            .toLowerCase()
            .includes(this.dataPage.dataPaginator.search) ||
          itr.section
            .toLowerCase()
            .includes(this.dataPage.dataPaginator.search) ||
          itr.address.toLowerCase().includes(this.dataPage.dataPaginator.search)
        ) {
          listData.push(itr);
        }
      });
      this.dataPage = this.dataListService.buildDataList();

      setTimeout(() => {
        this.dataPage.dataPaginator = this.dataListService.changePaginator(
          this.dataPage.dataPaginator,
          listData.length
        );

        this.dataPage = this.dataListService.updateDataList(
          this.dataPage,
          listData,
          'tableGpsCounter'
        );

        this.loading = false;
      }, 1000);
    });
  }

  selectColumn({ data, operation }: ResponseListItem): void {
    if (operation !== 'view') return;

    this.router.navigate(['DashBoard/Counters/AddGpsAndPhoto'], {
      queryParams: { data: btoa(JSON.stringify(data)) },
    });
  }

  resetAndRefresh(): void {
    this.sharePanelService.resetInput$.emit();
    this.dataPage = this.dataListService.buildDataList();

    this.loading = true;
    this.refresh();
  }
}
