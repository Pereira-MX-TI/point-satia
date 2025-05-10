import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { Account } from 'src/app/models/authentication/account';
import { Location_route } from 'src/app/models/route/location_route.model';
import { RouteObservable } from 'src/app/observables/route.observable';
import { SummarizeWordPipe } from 'src/app/pipes/shared/summarize-word.pipe';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.page.html',
  styleUrls: ['./view-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, SummarizeWordPipe],
})
export class ViewDashboardPage implements OnInit, OnDestroy {
  private routeObservable: RouteObservable = inject(RouteObservable);
  listSubscription: Subscription[];
  currentLocation: Location_route | null = null;

  constructor() {
    this.listSubscription = initializeListSubscription(1);
  }

  ngOnInit(): void {
    this.subscriptionRoute();
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
}
