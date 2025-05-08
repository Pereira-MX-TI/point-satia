import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summarizeWord',
})
export class SummarizeWordPipe implements PipeTransform {
  transform(value: string | number, length: number): string {
    if (value === '' || !value) return '-';

    value = String(value);

    if (value.length === 0) return '-';
    if (value.length < length) return value;

    return `${value.slice(0, length)}...`;
  }
}
