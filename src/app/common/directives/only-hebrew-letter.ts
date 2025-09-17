import { Directive, HostBinding, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appOnlyHebrewLetters]'
})
export class OnlyHebrewLettersDirective {
  @Input() allowNumber = false;
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

    // Allow Hebrew letters
    const charCode = e.which || e.keyCode;
    if (((charCode >= 1488 && charCode <= 1514) || (charCode >= 1425 && charCode <= 1479) || (charCode >= 64285 && charCode <= 64335)) || (this.allowNumber && (charCode >= 48 && charCode <= 57))) {
      return true;
    } else {
      return false;
    }
  }
    @HostListener('paste', ['$event'])
  onPaste(event: any) {
    let res = false;
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      res =  this.containsHebrewCharacter(pastedText);
      if(res)
        return false;
    }
    return true;
  }
  containsHebrewCharacter(text: string): boolean {
    const hebrewRange = /[\u0590-\u05FF]/;
    const hebrewNumberRange = /[\u0590-\u05FF0-9]/;
    if (!this.allowNumber) {
      return text.split('').some(character => !hebrewRange.test(character));
    } else {
      return text.split('').some(character => !hebrewNumberRange.test(character));
    }
  }
}
