import { Routes } from '@angular/router';
import { AddGpsPhotoCounterPage } from 'src/app/pages/counter/add-gps-photo-counter/add-gps-photo-counter.page';
import { DownloadCounterPage } from 'src/app/pages/counter/download-counter/download-counter.page';
import { ListCounterPage } from 'src/app/pages/counter/list-counter/list-counter.page';
import { UploadCounterPage } from 'src/app/pages/counter/upload-counter/upload-counter.page';

export const CounterRoutes: Routes = [
  {
    path: '',
    redirectTo: 'List',
    pathMatch: 'full',
  },
  {
    path: 'List',
    component: ListCounterPage,
  },
  {
    path: 'Download',
    component: DownloadCounterPage,
  },
  {
    path: 'Upload',
    component: UploadCounterPage,
  },
  {
    path: 'AddGpsAndPhoto',
    component: AddGpsPhotoCounterPage,
  },
];
