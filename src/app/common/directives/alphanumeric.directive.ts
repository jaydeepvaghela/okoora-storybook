import { Directive, HostBinding, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appOnlyAlphanumeric]'
})
export class OnlyAlphanumericDirective {
  @HostBinding('autocomplete') public autocomplete;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.autocomplete = 'off';
  }

  @HostListener('keypress', ['$event'])
  disableKeys(e: any) {
    // Allow backspace and space keys
    if (e.keyCode === 8 || e.keyCode === 32) {
      return true;
    }
  
    // Allow alphanumeric characters only
    const charCode = e.which || e.keyCode;
    const char = String.fromCharCode(charCode);
    const pattern = /^[a-zA-Z0-9]*$/; // Regular expression for alphanumeric characters
    return pattern.test(char);
  }
}