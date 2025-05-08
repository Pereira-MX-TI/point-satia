import { DataPaginator } from './dataPaginator';
import { DataTable } from './dataTable';

export interface DataPage {
  btnAction: any;
  opcTab: number;
  scrollPosition: number;
  data?: any;
  dataTable: DataTable;
  dataPaginator: DataPaginator;
  refresh: boolean;
}
