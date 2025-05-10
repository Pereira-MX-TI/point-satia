// import { ScrollingModule } from '@angular/cdk/scrolling';
// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   inject,
//   input,
//   OnDestroy,
//   OnInit,
//   output,
//   QueryList,
//   ViewChild,
//   ViewChildren,
// } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { initializeListSubscription } from '../../functions/subscription-list.function';
// import { ColumnConfig } from '../../models/column-config.model';
// import { SummarizeWordPipe } from '../../pipes/shared/summarize-word.pipe';
// import { CurrentIndexOfListItemPipe } from '../../pipes/shared/current-index-of-list-item.pipe';
// import { ListInformationService } from '../../services/list-information.service';
// import { DataListDTO } from '../../models/shared/dataListDTO';
// import { MaterialComponents } from '../../material/material.module';
// import { ResponseListItem } from '../../models/response-list-item.model';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Dialog } from '@angular/cdk/dialog';
// import { LocalStorageService } from '../../services/local-storage.service';
// import { ScrollObservable } from '../../observables/scroll.observable';
// import { restoreScroll, scrollTo } from '../../functions/scroll';
// import { ActivatedRoute } from '@angular/router';
// import { DataListService } from '../../services/data-list.service';
// import { MatPaginator } from '@angular/material/paginator';
// import { DataPaginator } from 'src/app/models/shared/dataPaginator';
// import { SharePanelService } from 'src/app/services/panel-share.service';
// import { LoadingComponent } from '../loading/loading.component';
// import { MessageEmptyComponent } from '../message-empty/message-empty.component';
// import { IonicModule,
//  } from '@ionic/angular';

// @Component({
//   selector: 'app-list-item',
//   imports: [
//     MaterialComponents,
//     IonicModule,
//     ScrollingModule,
//     MessageEmptyComponent,
//     SummarizeWordPipe,
//     CurrentIndexOfListItemPipe,
//     FormsModule,
//     ReactiveFormsModule,
//     LoadingComponent,
//   ],
//   templateUrl: './list-item.component.html',
//   styleUrl: './list-item.component.scss',
// })
// export class ListItemComponent implements OnInit, OnDestroy, AfterViewInit {
//   dialog: Dialog = inject(Dialog);

//   activatedRoute: ActivatedRoute = inject(ActivatedRoute);
//   localStorageService: LocalStorageService = inject(LocalStorageService);
//   private dataListService: DataListService = inject(DataListService);

//   scrollObservable: ScrollObservable = inject(ScrollObservable);
//   listInformationService: ListInformationService = inject(
//     ListInformationService
//   );

//   listSubscription: Subscription[] = [];

//   changePage = output<any>();
//   response = output<ResponseListItem>();
//   public responseSizePage = output<number>();
//   refresh = output<void>();

//   nameList = input('');
//   messageEmpty = input('');
//   headers = input(false);
//   pipe = input<any>();
//   pipeOpc = input<number>();
//   heightRow = input<number>(7.5);
//   sizeSummarizeWord = input<number>(40);
//   download = input<boolean>(false);
//   checkAlarms = input<boolean>(false);
//   columns = input<ColumnConfig[]>([]);
//   items: any[] = [];
//   paginator: DataPaginator;
//   sizes: number[] = [];

//   crypto: any;
//   loading = input<boolean>(false);
//   viewPaginator = input<boolean>(true);

//   positionScroll: number = 0;
//   handleRefreshValue:any = null;

//   @ViewChild('containerList') containerList!: ElementRef;
//   @ViewChild('matPaginator') matPaginator!: MatPaginator;
//   @ViewChildren('lastItem') lastItemRefs!: QueryList<ElementRef>;

//   constructor() {
//     this.listSubscription = initializeListSubscription(3);
//     this.paginator = this.dataListService.buildDataPaginator();
//   }

//   ngOnInit(): void {
//     this.subscriptionListInformation();
//     this.subscriptionScroll();
//   }

//   ngOnDestroy() {
//     this.listSubscription.forEach((itrSub) => {
//       itrSub.unsubscribe();
//     });
//   }

//   ngAfterViewInit() {
//     this.lastItemRefs.changes.subscribe(() => {
//       const lastItem = this.lastItemRefs.first;
//       if (
//         lastItem &&
//         this.containerList &&
//         this.containerList.nativeElement.scrollTop != 0
//       ) {
//         scrollTo(this.containerList.nativeElement, 0, 200);
//       }
//     });
//   }

//   subscriptionListInformation(): void {
//     this.listSubscription[0] =
//       this.listInformationService.refreshData$.subscribe((res: DataListDTO) => {
//         if (res.name !== this.nameList()) return;

//         this.items = res.data.dataSourceFilter;
//         this.paginator = res.paginator;

//         if(this.handleRefreshValue)
//           this.handleRefreshValue.target.complete();
//       });
//   }

//   subscriptionScroll(): void {
//     this.listSubscription[1] = this.scrollObservable.data$.subscribe(
//       (res: boolean) => {
//         if (!res) return;

//         this.positionScroll = restoreScroll(
//           this.localStorageService,
//           this.nameList(),
//           this.containerList,
//           250
//         );
//       }
//     );
//   }

//   totalColumns(): number {
//     return this.columns().reduce((sum, col) => sum + col.size, 0) + 1;
//   }

//   changeScroll(event: any): void {
//     const queryParams = this.activatedRoute.snapshot.queryParams;

//     this.positionScroll = event.srcElement.scrollTop;
//     this.localStorageService.save(this.nameList(), {
//       scroll: this.positionScroll,
//       queryParams: {
//         ...(Object.keys(queryParams).length > 0 ? queryParams : {}),
//       },
//     });
//   }

//   changePagination(data: any): void {
//     this.listInformationService.changePage$.emit();
//     this.changePage.emit(data);
//   }

//   checkListSize(): void {
//     if (this.paginator.quantityTotal > 500) {
//       this.sizes = [50, 100, 250, 500];
//     } else if (this.paginator.quantityTotal > 250) {
//       this.sizes = [50, 100, 250];
//     } else if (this.paginator.quantityTotal > 100) {
//       this.sizes = [50, 100];
//     }
//   }

//   handleRefresh(event:any) {
//     this.refresh.emit();
//     this.handleRefreshValue = event;
//   }
// }
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
import { LocalStorageService } from '../../services/local-storage.service';
import { ScrollObservable } from '../../observables/scroll.observable';
import { ActivatedRoute } from '@angular/router';
import { DataListService } from '../../services/data-list.service';
import { MatPaginator } from '@angular/material/paginator';
import { DataPaginator } from 'src/app/models/shared/dataPaginator';
import { LoadingComponent } from '../loading/loading.component';
import { MessageEmptyComponent } from '../message-empty/message-empty.component';
import { IonicModule, IonInfiniteScroll, IonRefresher } from '@ionic/angular';

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

  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  localStorageService: LocalStorageService = inject(LocalStorageService);
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
  loading = input<boolean>(false);
  viewPaginator = input<boolean>(true);

  positionScroll: number = 0;

  @ViewChild(IonRefresher) ionRefresher: IonRefresher | null = null;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll | null =
    null;

  constructor() {
    this.listSubscription = initializeListSubscription(3);
    this.paginator = this.dataListService.buildDataPaginator();
  }

  ngOnInit(): void {
    this.subscriptionListInformation();
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

  totalColumns(): number {
    return this.columns().reduce((sum, col) => sum + col.size, 0) + 1;
  }

  handleIonInfinite(): void {
    if (this.ionInfiniteScroll?.disabled) return;

    this.changePage.emit();
  }

  handleRefresh() {
    if (this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false;

    this.items = [];
    this.refresh.emit();
  }
}
