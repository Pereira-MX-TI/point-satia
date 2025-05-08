import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollObservable {
  private dataSubject = new BehaviorSubject<boolean>(false);
  data$ = this.dataSubject.asObservable();

  updateData(res: boolean): void {
    this.dataSubject.next(res);
  }
}
