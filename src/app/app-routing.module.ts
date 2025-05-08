import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/authentication/login.guard';
import { RootPage } from './pages/root/root/root.page';
import { NoFoundPage } from './pages/error/no-found/no-found.page';
import { ViewDashboardPage } from './pages/dashboard/view-dashboard/view-dashboard.page';
import { noLoginGuard } from './guards/authentication/no-login.guard';

const routes: Routes = [
    {
      path: '',
      component: RootPage,
      children: [
        {
          path: '',
          redirectTo: 'Authentication/Login',
          pathMatch: 'full'
        },
        {
          path: 'DashBoard',
          component: ViewDashboardPage,
          canActivate: [LoginGuard],
          children: [
        
          ],
        },
        {
          path: 'Authentication',
          canActivate: [noLoginGuard],
          loadChildren: () =>
            import('./routing/authentication/authentication-routing.module').then(
              (routes) => routes.AuthenticationRoutes
            ),
        },
        {
          path: 'DataBases',
          canActivate: [LoginGuard],
          loadChildren: () =>
            import('./routing/database/database-routing.module').then(
              (routes) => routes.DataBaseRoutes
            ),
        },
        { path: '**', pathMatch: 'full', component: NoFoundPage },
      ],
    }
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
