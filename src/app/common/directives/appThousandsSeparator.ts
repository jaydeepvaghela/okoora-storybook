import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appThousandsSeparator]'
})
export class ThousandsSeparatorDirective {
  private el: ElementRef;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef;
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    const formattedValue = this.formatNumberWithCommas(initialValue);
    this.el.nativeElement.value = formattedValue;
    event.preventDefault();
  }

  private formatNumberWithCommas(value: string): string {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numericValue) ? '' : numericValue.toLocaleString('en-US');
  }
}
