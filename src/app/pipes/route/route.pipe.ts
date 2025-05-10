import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'route',
})
export class RoutePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const data: any = value;

    if (!data) return '-';

    switch (Number(args[0])) {
      case 0:
        {
          switch (args[1]) {
            case 'name':
              return data.name;

            case 'id':
              return data.id;

            case 'water_meters':
              return data.water_meters;

            case 'alarm':
              return data.alarms;

            case 'logo': {
              if (data.logo) return environment.IMAGE_URL + data.logo.url;

              return 'assets/default.jpg';
            }

            case 'sketch': {
              if (data.sketch) return environment.IMAGE_URL + data.sketch.url;

              return 'assets/default.jpg';
            }

            case 'address':
              {
                if (!data.address) return '-';
                return `
                ${data.address.description.trim()}\n
                ${data.address.municipality.name}\n
                ${data.address.municipality.state.name}
              `;
              }
              break;
          }
        }
        break;

      case 1:
        {
          switch (args[1]) {
            case 'cost':
              return data.cost;
            case 'max':
              return data.max;
            case 'min':
              return data.min;
          }
        }
        break;

      case 2:
        {
          switch (args[1]) {
            case 'cost':
              return data.cost;
            case 'name':
              return data.name;
          }
        }
        break;
    }
  }
}
