import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyEmail]'
})
export class OnlyEmailDirective {
  @Input() allowNumber = true;
  constructor() { }

  @HostListener('keypress', ['$event'])
  disableKeys(e: any) {
    // Allow backspace and space keys
    if (e.keyCode === 8 || e.keyCode === 32) {
      return true;
    }

    if (e.charCode === 64 || e.charCode === 46) {
        return true;
      }

      if (e.charCode === 45 || e.charCode === 95) {
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
      res =  this.containsEmailCharacter(pastedText);
      if(res)
        return false;
    }
    return true;
  }
  // containsEmailCharacter(text: string): boolean {
  //   const englishRange = /^[a-zA-Z@._-]*$/;
  //   const englishNumberRange = /^[a-zA-Z0-9@._-]*$/;
  //   if (!this.allowNumber) {
  //     return text.split('').some(character => !englishRange.test(character));
  //   } else {
  //     return text.split('').some(character => !englishNumberRange.test(character));
  //   }
  // }

  containsEmailCharacter(text: string): boolean {
    const englishRange = /^[a-zA-Z@._-]*$/;
    const englishNumberRange = /^[a-zA-Z0-9@._-]*$/;
    if (!this.allowNumber) {
      return text.split('').some(character => !englishRange.test(character));
    } else {
      return text.split('').some(character => !englishNumberRange.test(character));
    }
  }

}
