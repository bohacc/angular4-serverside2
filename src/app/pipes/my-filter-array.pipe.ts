import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myFilterArray'
})
export class MyFilterArray implements PipeTransform {
  transform(items: any[], fieldName: string, value: number): any {
    return items.filter(item => parseInt(item[fieldName], 10) == value);
  }
}
