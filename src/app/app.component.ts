import { Component, inject } from '@angular/core';
import { LoginObservable } from './observables/login.observable';
import { RouteObservable } from './observables/route.observable';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  private loginObservable: LoginObservable = inject(LoginObservable);
  private routeObservable: RouteObservable = inject(RouteObservable);

  constructor() {
    this.loginObservable.checkLocalStoreData();
    this.routeObservable.checkLocalStoreData();
  }
}
