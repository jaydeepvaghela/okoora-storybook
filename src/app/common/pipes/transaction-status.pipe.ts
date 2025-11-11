// import { Pipe, PipeTransform } from '@angular/core';
// import { TransactionStatus } from '../enums/TransactionStatus';

// @Pipe({
//   name: 'transactionStatus'
// })
// export class TransactionStatusPipe implements PipeTransform {

//   transform(value: number, ...args: any[]): string {
//     return value == TransactionStatus.Done ? 'Done' : 'Waiting';
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';
import { TransactionStatus } from '../enums/TransactionStatus';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'transactionStatus'
})
export class TransactionStatusPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(value: TransactionStatus, ...args: any[]): string {
    // Translate the enum value using the translation key 'WALLET.' + value
    const valueString = value == TransactionStatus.Done ? 'Done' : 'Waiting'
    return this.translateService.instant('WALLET.' + valueString );
  }
}