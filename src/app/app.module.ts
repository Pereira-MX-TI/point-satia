import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { initializeApp } from './functions/app-init.function';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RootPage } from './pages/root/root/root.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { LoginObservable } from './observables/login.observable';
import { RouteObservable } from './observables/route.observable';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RootPage,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [LoginObservable, RouteObservable],
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(
      withInterceptors([ResponseInterceptor, TokenInterceptor])
    ),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
