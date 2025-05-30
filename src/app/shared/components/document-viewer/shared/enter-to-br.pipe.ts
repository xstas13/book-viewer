import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enterToBr',
})
export class EnterToBrPipe implements PipeTransform {
  transform(value: string): string {
    return (value || '').replace(/\n/g, '<br />');
  }
}