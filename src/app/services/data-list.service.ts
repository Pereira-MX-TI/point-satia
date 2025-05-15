import { inject, Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DataPage } from '../models/shared/dataPage';
import { ListInformationService } from './list-information.service';
import { DataPaginator } from '../models/shared/dataPaginator';

@Injectable({
  providedIn: 'root',
})
export class DataListService {
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );

  buildDataPaginator(size: number = 50): DataPaginator {
    return {
      search: '',
      quantityTotal: 0,
      offset: 0,
      pageSize: size,
      limit: size,
    };
  }

  buildDataList(size: number = 50): DataPage {
    return {
      refresh: false,
      btnAction: {},
      data: {},
      opcTab: 0,
      scrollPosition: 0,
      dataPaginator: {
        search: '',
        quantityTotal: 0,
        offset: 0,
        pageSize: size,
        limit: size,
      },
      dataTable: {
        dataSourceFilter: [],
        opcFill: 0,
      },
    };
  }

  changePaginator(data: DataPaginator, quantity: number = 0): DataPaginator {
    data.quantityTotal = quantity;

    this.listInformationService.totalRecords$.emit();

    return data;
  }

  updateDataList(dataPage: DataPage, list: any[], name: string = ''): DataPage {
    dataPage.dataPaginator.offset += dataPage.dataPaginator.pageSize;
    dataPage.dataTable.dataSourceFilter = [
      ...dataPage.dataTable.dataSourceFilter,
      ...list,
    ];

    this.listInformationService.refreshData$.emit({
      data: dataPage.dataTable,
      paginator: dataPage.dataPaginator,
      name,
    });

    return dataPage;
  }
}
