import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription, debounceTime, finalize } from 'rxjs';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { NavBarSimpleComponent } from 'src/app/components/nav-bar-simple/nav-bar-simple.component';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { Account } from 'src/app/models/authentication/account';
import { ColumnConfig } from 'src/app/models/column-config.model';
import { ResponseListItem } from 'src/app/models/response-list-item.model';
import { DataPage } from 'src/app/models/shared/dataPage';
import { LoginObservable } from 'src/app/observables/login.observable';
import { DatabasePipe } from 'src/app/pipes/data-base/database.pipe';
import { DataListService } from 'src/app/services/data-list.service';
import { HttpDataBaseService } from 'src/app/services/database/http-database.service';
import { SharePanelService } from 'src/app/services/panel-share.service';

@Component({
  selector: 'app-list-database',
  templateUrl: './list-database.page.html',
  styleUrls: ['./list-database.page.scss'],
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
export class ListDatabasePage implements OnInit, OnDestroy {
  private router: Router = inject(Router);

  private snackBar: MatSnackBar = inject(MatSnackBar);
  private loginObservable: LoginObservable = inject(LoginObservable);
  httpDataBaseService: HttpDataBaseService = inject(HttpDataBaseService);
  private dataListService: DataListService = inject(DataListService);
  private sharePanelService: SharePanelService = inject(SharePanelService);

  listSubscription: Subscription[];
  dataPage: DataPage;
  account: Account | null = null;
  loading: boolean = true;
  columns: ColumnConfig[] = [];
  databasePipe: DatabasePipe = new DatabasePipe();

  constructor() {
    this.columns = [
      {
        id: crypto.randomUUID(),
        head: 'Base de datos',
        name: 'database',
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
  }

  ngOnInit(): void {
    this.subscriptionDataInput();
    this.subscriptionSearch();
    this.subscriptionLogin();
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

        this.httpDataBaseService
          .autoCompletedDataBase({ word: value })
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

  private subscriptionLogin(): void {
    this.listSubscription[2] = this.loginObservable.data$.subscribe(
      (res: Account | null) => (this.account = res)
    );
  }

  changePagination(): void {
    this.dataPage.dataPaginator.pageIndex++;

    this.refresh();
  }

  refresh(): void {
    this.httpDataBaseService
      .listDataBases({
        offset: this.dataPage.dataPaginator.offset,
        limit: this.dataPage.dataPaginator.limit,
        option: 'pagination',
        ...(this.dataPage.dataPaginator.search === ''
          ? {}
          : { search: this.dataPage.dataPaginator.search }),
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ data }) => {
          const { list, totalRecords } = data;

          this.dataPage = this.dataListService.updateDataList(
            this.dataPage,
            list,
            'tableDb'
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

    if (!this.account) return;

    this.loginObservable.updateData({
      ...this.account,
      api: data,
    });

    this.router.navigateByUrl('Routes');
  }

  resetAndRefresh(): void {
    this.sharePanelService.resetInput$.emit();
    this.dataPage = this.dataListService.buildDataList();

    this.refresh();
  }
}
