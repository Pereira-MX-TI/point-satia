import { Injectable, EventEmitter } from '@angular/core';
import { DataListDTO } from '../models/shared/dataListDTO';

@Injectable({
  providedIn: 'root',
})
export class ListInformationService {
  refreshData$: EventEmitter<DataListDTO> = new EventEmitter<DataListDTO>();
  changePage$: EventEmitter<void> = new EventEmitter<void>();

  dataInput$: EventEmitter<string> = new EventEmitter<string>();
  autoComplete$: EventEmitter<string[]> = new EventEmitter<string[]>();
  search$: EventEmitter<string> = new EventEmitter<string>();
  resetInput$: EventEmitter<void> = new EventEmitter<void>();
}
