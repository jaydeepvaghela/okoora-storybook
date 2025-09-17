import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'awReplaceUnderScoreFromlabel'
})
export class AwReplaceUnderScoreFromlabelPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace(/_/g, ' ').toUpperCase();
  }

}
