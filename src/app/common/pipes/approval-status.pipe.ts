import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'approvalStatus'
})
export class ApprovalStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == 1) {
      return 'waiting';
    } else if (value == 2) {
      return 'approved';
    } else if (value == 3) {
      return 'rejected';
    }
    return '';
  }

}
