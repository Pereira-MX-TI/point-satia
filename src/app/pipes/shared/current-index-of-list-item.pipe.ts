import { Pipe, PipeTransform } from '@angular/core';
import { DataPaginator } from 'src/app/models/shared/dataPaginator';

@Pipe({
  name: 'currentIndexOfListItem',
})
export class CurrentIndexOfListItemPipe implements PipeTransform {
  transform(index: number, paginator: DataPaginator | null): number {
    let currentIndex: number = index + 1;
    if (paginator != null && paginator.pageIndex != 0) {
      currentIndex += paginator.pageIndex * paginator.pageSize;
    }

    return currentIndex;
  }
}
