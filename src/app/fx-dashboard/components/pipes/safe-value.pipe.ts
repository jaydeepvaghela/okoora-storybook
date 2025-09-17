import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeValue'
})
export class SafeValuePipe implements PipeTransform {

  transform(value: any): any {
    return value === null || value === undefined || value === '' ? '----' : value;
  }

}
