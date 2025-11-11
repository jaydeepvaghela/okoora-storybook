import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dynamicInputWidth]'
})
export class DynamicInputWidthDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('ngModelChange')
  onChange(ev: any) {
    this.changeInputWidth();
  }

  private changeInputWidth() {
    let textWidth = 50;
    setTimeout(() => {
      textWidth = this.getTextWidth(this.el.nativeElement.value);
      if (textWidth < 50) {
        textWidth = 50;
      }
      this.renderer.setStyle(this.el.nativeElement, 'width', `${textWidth+4}px`);
    }, 100);
  }

  private getTextWidth(text: string): number {
    const inputStyles = window.getComputedStyle(this.el.nativeElement);
    const span = this.renderer.createElement('span');
    this.renderer.setStyle(span, 'visibility', 'hidden');
    this.renderer.setStyle(span, 'position', 'absolute');
    this.renderer.setStyle(span, 'white-space', 'nowrap');
    this.renderer.setStyle(span, 'font-size', inputStyles.fontSize);
    this.renderer.setStyle(span, 'font-weight', inputStyles.fontWeight);
    this.renderer.setStyle(span, 'font-family', inputStyles.fontFamily);
    this.renderer.appendChild(span, this.renderer.createText(text));
    document.body.appendChild(span);

    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
  }
}
