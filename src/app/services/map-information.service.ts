import { Injectable, EventEmitter } from '@angular/core';
import { PointMap } from '../models/map/pointMap';

interface DataMultiplePosition {
  modules: any;
  gateways?: any[];
  general: any;
}
@Injectable({
  providedIn: 'root',
})
export class MapInformationService {
  initMap$: EventEmitter<PointMap> = new EventEmitter<PointMap>();
  initMultipleMap$: EventEmitter<any> = new EventEmitter<PointMap>();
  changeOnlyPosition$: EventEmitter<PointMap> = new EventEmitter<PointMap>();
  changeMultiplePosition$: EventEmitter<DataMultiplePosition> =
    new EventEmitter<DataMultiplePosition>();
  dataMap$: EventEmitter<any> = new EventEmitter<any>();
}
