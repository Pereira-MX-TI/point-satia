import { Routes } from '@angular/router';
import { ListGpsCounterPage } from 'src/app/pages/counter/list-gps-counter/list-gps-counter.page';
import { ListPhotosCounterPage } from 'src/app/pages/counter/list-photos-counter/list-photos-counter.page';
import { TabCounterPage } from 'src/app/pages/counter/tab-counter/tab-counter.page';

export const CounterRoutes: Routes = [
  {
    path: '',
    component: TabCounterPage,
    children: [
      {
        path: '',
        redirectTo: 'Gps',
        pathMatch: 'full',
      },
      {
        path: 'Gps',
        component: ListGpsCounterPage,
      },
      {
        path: 'Photos',
        component: ListPhotosCounterPage,
      },
    ],
  },
];
