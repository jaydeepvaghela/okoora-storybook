import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatAmount]'
})
export class FormatAmountDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (this._el.nativeElement.value === '-') return;
    // if (this._el.nativeElement.value < '1' || this._el.nativeElement.value === '-') {
    //   this._el.nativeElement.value = '';
    // };
    let commasRemoved = this._el.nativeElement.value.replace(/,/g, '');
    let toInt: number;
    let toLocale: string;
    if (commasRemoved.split('.').length > 1) {
      if (commasRemoved.split('.')[1].length > 2) {
        commasRemoved = Number(commasRemoved).toFixed(2);
      }
      let decimal = isNaN(parseInt(commasRemoved.split('.')[1])) ? '' : parseInt(commasRemoved.split('.')[1]);
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US') + '.' + decimal;
    } else {
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US');
    }
    if (toLocale === 'NaN' || toLocale === 'NaN.') {
      this._el.nativeElement.value = '';
    } else {
      this._el.nativeElement.value = toLocale;
    }
  }

}
