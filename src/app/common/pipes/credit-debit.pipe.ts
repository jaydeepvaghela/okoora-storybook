import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditDebit'
})
export class CreditDebitPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    return parseFloat(value) < 0 ? "debit-amount" : "credit-amount";
  }

}
