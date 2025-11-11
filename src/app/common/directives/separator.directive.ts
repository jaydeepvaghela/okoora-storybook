import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: '[appSeparator]'
})
export class SeparatorDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement;
    let value = inputElement.value;

    // Remove all non-numeric characters except for the decimal point
    value = value.replace(/[^\d.]/g, '');

    // Format the value with commas as thousands separators
    value = value.split('.').map((part:any, index:number) => {
      return index === 0 ? part.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : part;
    }).join('.');

    // Update the input element with the formatted value
    inputElement.value = value;
  }
}
