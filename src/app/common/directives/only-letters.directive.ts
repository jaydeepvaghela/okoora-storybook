import { Directive, HostBinding, HostListener, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'


@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {



  @HostBinding('autocomplete') public autocomplete
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.autocomplete = 'off'
  }
  @HostListener('keypress', ['$event'])
  disableKeys(e: any) {
    return (
      e.keyCode === 8 || e.keyCode === 32 ||
      (e.keyCode >= 97 && e.keyCode <= 122) ||
      (e.keyCode >= 65 && e.keyCode <= 90)
    )
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    let res = false;
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      res =  this.containsHebrewCharacter(pastedText);
      if(res == false){
        return false;
      }else{
        return true;
      }
    }
    return true;
  }
  containsHebrewCharacter(text: string): boolean {
    const hebrewRange = /[\u0590-\u05FF]/;
    return text.split('').some(character => hebrewRange.test(character));
  }
}
