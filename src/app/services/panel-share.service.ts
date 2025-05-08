import { Injectable, EventEmitter } from '@angular/core';
import { DataPaginator } from '../models/shared/dataPaginator';

@Injectable({
  providedIn: 'root',
})
export class SharePanelService {
  dataInput$: EventEmitter<string> = new EventEmitter<string>();
  autoComplete$: EventEmitter<string[]> = new EventEmitter<string[]>();
  search$: EventEmitter<string> = new EventEmitter<string>();
  resetInput$: EventEmitter<void> = new EventEmitter<void>();
  panelPageSize$: EventEmitter<number[]> = new EventEmitter<number[]>();
}
