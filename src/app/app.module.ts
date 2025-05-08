import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RootPage } from './pages/root/root/root.page';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,RootPage],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideHttpClient(withInterceptors([
      ResponseInterceptor,TokenInterceptor
    ])),
    provideAnimationsAsync(),

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
