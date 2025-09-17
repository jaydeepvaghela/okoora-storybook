import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyEnglish]'
})
export class OnlyEnglishDirective {
  @Input() allowNumber = true;
  constructor() { }

  @HostListener('keypress', ['$event'])
  disableKeys(e: any) {
    // Allow backspace and space keys
    if (e.keyCode === 8 || e.keyCode === 32) {
      return true;
    }

    // Allow english letters
    const charCode = e.which || e.keyCode;
    if (((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) || (this.allowNumber && (charCode >= 48 && charCode <= 57))) {
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
      res =  this.containsEnglishCharacter(pastedText);
      if(res)
        return false;
    }
    return true;
  }
  containsEnglishCharacter(text: string): boolean {
    const englishRange = /^[a-zA-Z\s]*$/;
    const englishNumberRange = /^[a-zA-Z0-9\s]*$/;
    if (!this.allowNumber) {
      return text.split('').some(character => !englishRange.test(character));
    } else {
      return text.split('').some(character => !englishNumberRange.test(character));
    }
  }

}
