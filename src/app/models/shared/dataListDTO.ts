import { DataPaginator } from './dataPaginator';
import { DataTable } from './dataTable';

export interface DataListDTO {
  data: DataTable;
  paginator: DataPaginator;
  name: string;
}
