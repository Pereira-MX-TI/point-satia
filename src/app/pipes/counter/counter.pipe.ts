import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'counter',
})
export class CounterPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const data: any = value;

    if (!data) return '-';

    switch (Number(args[0])) {
      case 0:
        {
          switch (args[1]) {
            case 'meter_serial':
              return data.meter_serial;

            case 'address':
              return data.address == '' ? '-' : data.address;
          }
        }
        break;
    }
  }
}
