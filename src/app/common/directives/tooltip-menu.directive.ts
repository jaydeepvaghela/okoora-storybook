import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
let isMatMenuOpen = false;

@Directive({
  selector: '[appTooltipMenu]'
})
export class TooltipMenuDirective {
  @Input() trigger: any;
  @Input() button: any;
  @Input() elementType: any;
  enteredButton = false;
  isMatMenuOpen = false;
  prevButtonTrigger: any;

  constructor(private ren: Renderer2) { }

  @HostListener('mouseenter') mouseenter() {
    if (this.elementType == 'menu') {
      this.menuenter();
    } else {
      this.buttonEnter(this.trigger);
    }
  }
  @HostListener('mouseleave') mouseleave() {
    if (this.elementType == 'menu') {
      this.menuLeave(this.trigger, this.button);
    } else {
      this.buttonLeave(this.trigger, this.button);
    }
  }

  menuenter() {
    isMatMenuOpen = true;
  }

  menuLeave(trigger: any, button: any) {
    setTimeout(() => {
      if (!this.enteredButton) {
        isMatMenuOpen = false;
        trigger.closeMenu();
      } else {
        isMatMenuOpen = false;
      }
    }, 80)
  }

  buttonEnter(trigger: any) {
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger != trigger) {
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        isMatMenuOpen = false;
        trigger.openMenu();
      }
      else if (!isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu();
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger: any, button: any) {
    setTimeout(() => {
      if (this.enteredButton && !isMatMenuOpen) {
        trigger.closeMenu();
      } if (!isMatMenuOpen) {
        trigger.closeMenu();
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }
}
