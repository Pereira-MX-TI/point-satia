import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'database',
})
export class DatabasePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    const data: any = value;

    if (!data) return '-';

    switch (args[0]) {
      case 0:
        {
          switch (args[1]) {
            case 'database':
              return data.database;
              break;
            case 'url':
              return data.url;
              break;
            case 'logo': {
              if (data.logo) return environment.IMAGE_URL + data.logo;

              return 'assets/default.jpg';
            }
          }
        }
        break;

      case 1:
        {
          switch (args[1]) {
            case 'meter_serial':
              return data.meter_serial;
              break;
            case 'addition_serial':
              return data.serial_number;
              break;
            case 'dev_eui':
              return data.dev_eui;
              break;

            case 'status':
              return data.is_in_pickup === 1
                ? 'Procesado'
                : data.is_in_pickup === 2
                ? 'Rechazado'
                : 'Pendiente';
              break;

            case 'time':
              return data.time;
              break;

            case 'data':
              return data.data;
              break;
          }
        }
        break;

      case 2:
        {
          switch (args[1]) {
            case 'meter_serial':
              return data.meter_serial;
              break;

            case 'location':
              return data.route_name;
              break;

            case 'name_gateway':
              return data.name;
              break;

            case 'number_serie_gateway':
              return data.serial_number;
              break;
            case 'section':
              return data.section;
              break;

            case 'address':
              return data.address;
              break;

            case 'gps':
              return data.latitude == 0 && data.longitude == 0
                ? '-'
                : `${data.latitude},${data.longitude}`;
              break;
          }
        }
        break;
    }

    return '-';
  }
}
