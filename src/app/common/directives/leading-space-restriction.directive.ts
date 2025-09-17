import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLeadingSpaceRestriction]'
})
export class LeadingSpaceRestrictionDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const textarea = this.el.nativeElement as HTMLTextAreaElement;

    // Prevent the space character if the cursor is at the beginning of the input
    if (textarea.selectionStart === 0 && event.key === ' ') {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const textarea = this.el.nativeElement as HTMLTextAreaElement;
    textarea.value = textarea.value.replace(/^\s+/, ''); // Remove leading spaces if entered
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const textarea = this.el.nativeElement as HTMLTextAreaElement;
    const pasteData = event.clipboardData?.getData('text') || '';

    // Prevent pasting if the pasted text starts with a space
    const cleanData = pasteData.replace(/^\s+/, '');
    event.preventDefault(); // Prevent default paste
    document.execCommand('insertText', false, cleanData); // Insert the cleaned text
  }
}
