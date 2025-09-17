import { Directive, ElementRef, HostBinding, HostListener, Inject, Input, Renderer2 } from '@angular/core';
import { DOCUMENT, DecimalPipe } from '@angular/common'

@Directive({
  selector: '[appOnlyNumbers]',
})
export class OnlyNumbersDirective {
  @Input() isCurrency = true;
  // currencyChars = new RegExp('[\$]', 'g');
  prefix = '';

  @HostBinding('autocomplete') autocomplete: any
  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef, private renderer: Renderer2, @Inject(DecimalPipe) public decimalPipe: DecimalPipe) {
    this.autocomplete = 'off'
  }

  @HostListener('keypress', ['$event']) disableKeys(e: any) {
    return e.keyCode == 8 || (e.keyCode == 46 && e.currentTarget.value.split('.').length < 2) || (e.keyCode >= 48 && e.keyCode <= 57)
  }

  @HostListener('paste', ['$event']) onPaste(e: any) {
    e.preventDefault();
    const pastedInput: string = e.clipboardData
      .getData('text/plain')
      .replace(/[^\d.]/g, '');
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('selectionChange', ['$event'])
  change(e: any) {
    this.prefix = this.getPrefix(e.value);
    this.el.nativeElement.parentElement.closest('.currency-wrapper').querySelector('.currency-value input').placeholder = this.prefix + '0.00';
    if (this.el.nativeElement.parentElement.closest('.currency-wrapper')?.querySelector('.currency-value .amount-prefix')) {
      this.el.nativeElement.parentElement.closest('.currency-wrapper').querySelector('.currency-value .amount-prefix').innerText = this.prefix;
    }
  }
  @HostListener('input', ['$event.target.value'])
  onInputValueChange(value: string) {
    this.format(value);
  }
  @HostListener('change', ["$event.target.value"]) onInput(e: string) {
    this.format(e);
  };
  format(val: string) {
    let currency = this.el.nativeElement.parentElement.closest('.currency-wrapper')?.querySelector('.country-dropdown mat-select')?.innerText.trim();
    this.prefix = this.getPrefix(currency);
    const newNode = document.createElement("span");
    const textNode = document.createTextNode(this.prefix);
    newNode.classList.add('amount-prefix');
    newNode.appendChild(textNode);

    if (val) {
      const formattedValue = this.formatNumberWithCommas(val);
      this.renderer?.setProperty(this.el?.nativeElement, 'value', formattedValue);

      if (this.el.nativeElement.parentElement.closest('.currency-wrapper')) {
        if (this.el.nativeElement.parentElement.closest('.currency-wrapper') && !this.el.nativeElement.parentElement.closest('.currency-wrapper')?.querySelector('.currency-value .amount-prefix')) {
          this.el.nativeElement.parentElement.insertBefore(newNode, this.el.nativeElement)
        } else {
          this.el.nativeElement.parentElement.querySelector('.amount-prefix').innerText = this.prefix;
        }
      }
      this.renderer.setProperty(this.el.nativeElement, 'value', val);
    } else {
      document.querySelector('.currency-value .amount-prefix')?.remove();
    }
  }
  // format(val: string) {
  //   let currency = this.el.nativeElement.parentElement.closest('.currency-wrapper')?.querySelector('.country-dropdown mat-select').innerText.trim();
  //   this.prefix = this.getPrefix(currency);
  //   const newNode = document.createElement("span");
  //   const textNode = document.createTextNode(this.prefix);
  //   newNode.classList.add('amount-prefix');
  //   newNode.appendChild(textNode);

  //   if (val) {
  //     const formattedValue = this.isCurrency ? this.formatNumberWithCommas(val) : val;
  //     this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
  //     this.renderer.selectRootElement(this.el.nativeElement).setSelectionRange(val.length, val.length); // Set cursor position to the end

  //     const currencyWrapper = this.el.nativeElement.parentElement.closest('.currency-wrapper');
  //     if (currencyWrapper) {
  //       const amountPrefix = currencyWrapper.querySelector('.currency-value .amount-prefix');
  //       if (!amountPrefix) {
  //         this.el.nativeElement.parentElement.insertBefore(newNode, this.el.nativeElement);
  //       } else {
  //         amountPrefix.innerText = this.prefix;
  //       }
  //     }
  //   } else {
  //     document.querySelector('.currency-value .amount-prefix')?.remove();
  //   }
  // }
  private formatNumberWithCommas(value: string): string {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numericValue) ? '' : numericValue.toLocaleString('en-US');
  }
  getPrefix(value: string) {
    switch (value) {
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      case 'EUR':
        return '€';
      case 'AUD':
        return '$';
      case 'CHF':
        return '₣';
      case 'CAD':
        return '$';
      case 'NZD':
        return '$';
      case 'ZAR':
        return 'R';
      case 'TRY':
        return '₺';
      case 'MXN':
        return '$';
      case 'NOK':
        return 'kr';
      case 'SEK':
        return 'kr';
      case 'JPY':
        return '¥';
      case 'CZK':
        return 'Kč';
      case 'HUF':
        return 'ft';
      case 'PLN':
        return 'zł';
      case 'THB':
        return '฿';
      case 'RON':
        return 'lei';
      case 'HKD':
        return '$';
      case 'DKK':
        return 'kr';
      case 'SGD':
        return '$';
      case 'CNH':
        return '$';
      case 'JOD':
        return 'ينار';
      case 'CNY':
        return '¥';
      case 'KRW':
        return '₩';
      case 'AED':
        return 'AED';
      case 'TWD':
        return 'NT$';
      case 'PHP':
        return '₱';
      case 'HRK':
        return 'kn';
      case 'INR':
        return '₹';
      case 'ILS':
        return '₪';
      default:
        return '';
    }
  }
}
