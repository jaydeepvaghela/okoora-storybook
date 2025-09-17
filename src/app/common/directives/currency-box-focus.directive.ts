import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[currencyBoxFocus]'
})
export class CurrencyBoxFocusDirective {

  constructor() {
  }

  @HostListener('focus', ['$event'])
  focus(ev: any) {
    ev.currentTarget.closest('.currency-wrapper').classList.add('blue-border');
    if (ev.currentTarget.closest('.currency-wrapper').classList.contains('input1')) {
      document.querySelector('.currency-wrapper.input2').classList.remove('blue-border');
    } else if (ev.currentTarget.closest('.currency-wrapper').classList.contains('input2')) {
      document.querySelector('.currency-wrapper.input1').classList.remove('blue-border');
    }
  }

  @HostListener('click', ['$event'])
  click(ev: any) {
    ev.currentTarget.closest('.currency-wrapper').classList.add('blue-border');
  }

  @HostListener('blur', ['$event'])
  blur(ev: any) {
    ev.currentTarget.closest('.currency-wrapper').classList.remove('blue-border');
  }

}
