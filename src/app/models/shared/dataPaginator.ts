export interface DataPaginator
{
    quantityTotal:number;
    pageSize:number;
    pageIndex:number;
    limit:number;
    offset:number;
    search:string;
}