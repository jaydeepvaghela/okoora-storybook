import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumber'
})
export class CustomNumberPipe implements PipeTransform {

  transform(value: number | string): string {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }

    if (isNaN(value)) {
      return '';
    }

    const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    const parts = rounded.toString().split('.');
    
    // If the number is a whole number or the decimals are .00
    if (parts.length < 2 || parts[1] === '00') {
      return parseFloat(parts[0]).toLocaleString();  // Convert number to string with commas
    }

    // Convert to string with 2 decimals and commas for thousands
    return parseFloat(rounded.toFixed(2)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
