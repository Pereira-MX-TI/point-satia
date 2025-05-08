import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ListInformationService } from 'src/app/services/list-information.service';
import { SharePanelService } from 'src/app/services/panel-share.service';

@Component({
  selector: 'app-list-database',
  templateUrl: './list-database.page.html',
  styleUrls: ['./list-database.page.scss'],
  standalone:true,
  imports:[
    IonicModule,
    NavBarSimpleComponent,
    ListItemComponent
  ]
})
export class ListDatabasePage implements OnInit {

  private router: Router = inject(Router);

  private snackBar: MatSnackBar = inject(MatSnackBar);
  private loginObservable: LoginObservable = inject(LoginObservable);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  httpDataBaseService:HttpDataBaseService = inject(HttpDataBaseService);
  private dataListService: DataListService = inject(DataListService);
  private sharePanelService: SharePanelService = inject(
    SharePanelService
  );

  listSubscription: Subscription[];
  dataPage: DataPage;
  account: Account | null = null;
  totalRecords: boolean = true;
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
        head: 'Url',
        name: 'url',
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
    this.subscriptionQueryParams();
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

        this.changePagination({
          previousPageIndex: 0,
          length: 0,
          pageIndex: 0,
          pageSize: this.dataPage.dataPaginator.pageSize,
        });
      }
    );
  }

  private subscriptionLogin(): void {
    this.listSubscription[2] = this.loginObservable.data$.subscribe(
      (res: Account | null) => (this.account = res)
    );
  }

  private subscriptionQueryParams(): void {
    this.listSubscription[3] = this.activatedRoute.queryParams.subscribe(
      ({ pagination }) => {
        if (pagination) {
          this.dataPage.dataPaginator = JSON.parse(atob(pagination));
        }

        this.refresh();
      }
    );
  }

  changePagination(event: PageEvent): void {
    this.dataPage.dataPaginator = this.dataListService.updatePaginator(
      this.dataPage.dataPaginator,
      event
    );

    this.router.navigate(['/DataBases'], { queryParams: {
      pagination: btoa(JSON.stringify(this.dataPage.dataPaginator)),
    } });
  }

  refresh(): void {
    this.loading = true;
    this.httpDataBaseService
      .listDataBases({
        offset: this.dataPage.dataPaginator.offset,
        limit: this.dataPage.dataPaginator.limit,
        option: 'pagination',
        ...(this.totalRecords ? { totalRecords: true } : {}),
        ...(this.dataPage.dataPaginator.search === ''
          ? {}
          : { search: this.dataPage.dataPaginator.search }),
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ data }) => {
          const { list, totalRecords } = data;

          if (totalRecords) {
            this.dataPage.dataPaginator = this.dataListService.changePaginator(
              this.dataPage.dataPaginator,
              totalRecords
            );
          }

          this.dataPage = this.dataListService.updateDataList(
            this.dataPage,
            list,
            'tableDb'
          );

          this.totalRecords = false;
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

    // this.navigationService.navigatePage('DashBoard/Db/View');
  }

  changeSizePage(res: number): void {
    if (res == this.dataPage.dataPaginator.pageSize) return;

    this.sharePanelService.resetInput$.emit();
    this.dataPage.dataPaginator.search = '';
    this.dataPage = this.dataListService.buildDataList(res);

    this.changePagination({
      previousPageIndex: 0,
      length: 0,
      pageIndex: 0,
      pageSize: this.dataPage.dataPaginator.pageSize,
    });
  }

  resetAndRefresh(): void {

    this.sharePanelService.resetInput$.emit();
    this.dataPage.dataPaginator.search = '';
    this.dataPage = this.dataListService.buildDataList();
    this.totalRecords = true;

    this.changePagination({
      previousPageIndex: 0,
      length: 0,
      pageIndex: 0,
      pageSize: this.dataPage.dataPaginator.pageSize,
    });

    this.refresh();
  }
}
