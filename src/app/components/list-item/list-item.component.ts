import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { initializeListSubscription } from '../../functions/subscription-list.function';
import { ColumnConfig } from '../../models/column-config.model';
import { SummarizeWordPipe } from '../../pipes/shared/summarize-word.pipe';
import { ListInformationService } from '../../services/list-information.service';
import { DataListDTO } from '../../models/shared/dataListDTO';
import { MaterialComponents } from '../../material/material.module';
import { ResponseListItem } from '../../models/response-list-item.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { ScrollObservable } from '../../observables/scroll.observable';
import { ActivatedRoute } from '@angular/router';
import { DataListService } from '../../services/data-list.service';
import { DataPaginator } from 'src/app/models/shared/dataPaginator';
import { LoadingComponent } from '../loading/loading.component';
import { MessageEmptyComponent } from '../message-empty/message-empty.component';
import { IonicModule, IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { NetworkStatusService } from 'src/app/services/network-status.service';

@Component({
  selector: 'app-list-item',
  imports: [
    MaterialComponents,
    IonicModule,
    ScrollingModule,
    MessageEmptyComponent,
    SummarizeWordPipe,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
})
export class ListItemComponent implements OnInit, OnDestroy {
  dialog: Dialog = inject(Dialog);
  networkStatusService: NetworkStatusService = inject(NetworkStatusService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private dataListService: DataListService = inject(DataListService);

  scrollObservable: ScrollObservable = inject(ScrollObservable);
  listInformationService: ListInformationService = inject(
    ListInformationService
  );

  listSubscription: Subscription[] = [];

  changePage = output<void>();
  response = output<ResponseListItem>();
  refresh = output<void>();

  nameList = input('');
  messageEmpty = input('');
  optionsItem = input<any[]>([]);
  pipe = input<any>();
  pipeOpc = input<number>();
  heightRow = input<number>(7.5);
  sizeSummarizeWord = input<number>(40);
  download = input<boolean>(false);
  columns = input<ColumnConfig[]>([]);
  items: any[] = [];
  paginator: DataPaginator;

  crypto: any;
  alarm = input<boolean>(false);
  loading = input<boolean>(false);
  viewIonRefresher = input<boolean>(true);
  viewIonInfiniteScroll = input<boolean>(true);

  positionScroll: number = 0;
  online: boolean = true;

  @ViewChild(IonRefresher) ionRefresher: IonRefresher | null = null;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll | null =
    null;

  constructor() {
    this.listSubscription = initializeListSubscription(2);
    this.paginator = this.dataListService.buildDataPaginator();
  }

  ngOnInit(): void {
    this.subscriptionListInformation();
    this.subscriptionStatusNetwork();
  }

  ngOnDestroy() {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  subscriptionListInformation(): void {
    this.listSubscription[0] =
      this.listInformationService.refreshData$.subscribe((res: DataListDTO) => {
        const {
          name,
          data: { dataSourceFilter },
          paginator,
        } = res;
        if (name !== this.nameList()) return;

        if (this.ionRefresher) this.ionRefresher.complete();

        if (this.ionInfiniteScroll) {
          if (dataSourceFilter.length == this.items.length) {
            this.ionInfiniteScroll.complete();
            this.ionInfiniteScroll.disabled = true;
            return;
          }
          this.ionInfiniteScroll.complete();
        }

        this.items = dataSourceFilter;
        this.paginator = paginator;
      });
  }

  subscriptionStatusNetwork() {
    this.listSubscription[1] =
      this.networkStatusService.networkStatus$.subscribe((status: boolean) => {
        this.online = status;
      });
  }

  totalColumns(): number {
    return this.columns().reduce((sum, col) => sum + col.size, 0) + 1;
  }

  handleIonInfiniteScroll(): void {
    if (this.ionInfiniteScroll?.disabled) return;

    this.changePage.emit();
  }

  handleRefresh() {
    if (this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

    this.items = [];
    this.refresh.emit();
  }

  checkAlarmPhoto({ photos }: any): boolean {
    if (photos && (photos as Array<any>).length === 0) {
      return true;
    }

    return false;
  }

  checkStatusAlarmPhoto({ photos }: any): string {
    if (photos && (photos as Array<any>).length === 0) {
      return 'rgba(var(--color-new-6-1),0.8)';
    }

    return 'rgba(var(--color-new-8-1),0.8)';
  }

  checkAlarmGps({ gps }: any): boolean {
    if (gps && gps.latitude === 0 && gps.longitude === 0) {
      return true;
    }

    return false;
  }

  checkStatusAlarmGps({ gps }: any): string {
    if (gps && gps.latitude === 0 && gps.longitude === 0) {
      return 'rgba(var(--color-new-6-1),0.8)';
    }

    return 'rgba(var(--color-new-8-1),0.8)';
  }
}
