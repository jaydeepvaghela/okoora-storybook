import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[htmlTooltip]'
})
export class HtmlTooltipDirective {
  @Input() tooltipBody: any;
  @Input() panelClass!: string;

  constructor() { }

  @HostListener('mouseenter', ['$event']) onMouseEnter(ev: any) {
    const tooltipBlock = document.createElement('span');
    tooltipBlock.classList.add('custom-tooltip');
    tooltipBlock.classList.add('message-wrapper');
    if (this.panelClass) {
      tooltipBlock.classList.add(this.panelClass);
    }
    if (this.tooltipBody) {
      tooltipBlock.innerHTML = `<span class="tooltip-message">${this.tooltipBody}</span>`;
      ev.target.insertAdjacentElement('afterend', tooltipBlock);
    }

    let rootPositionX = ev.target.getBoundingClientRect().x;
    let rootPositionY = ev.target.getBoundingClientRect().y;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let tooltipWidth = ev.target.nextSibling.offsetWidth;
    let tooltipHeight = ev.target.nextSibling.offsetHeight;
    let rootWidth = ev.target.offsetWidth;
    let rootHeight = ev.target.offsetHeight;
    let isRightSide = false;

    // Set tooltip left position
    if (windowWidth - rootPositionX < (tooltipWidth / 2)) {
      ev.target.nextSibling.style.left = `${rootPositionX - (tooltipWidth / 2) - 7}px`;
      ev.target.nextSibling.querySelector('.tooltip-message').classList.add('right');
      isRightSide = true;
    } else {
      ev.target.nextSibling.style.left = `${rootPositionX + (rootWidth / 2)}px`;
      ev.target.nextSibling.querySelector('.tooltip-message').classList.remove('right');
    }

    // Set tooltip top position
    if (isRightSide) {
      ev.target.nextSibling.style.top = `${rootPositionY - (rootHeight / 2) - 20}px`;
    } else {
      if (windowHeight - rootPositionY - rootHeight < tooltipHeight) {
        ev.target.nextSibling.style.top = `${rootPositionY - tooltipHeight - 7}px`;
        ev.target.nextSibling.querySelector('.tooltip-message').classList.add('top');
      } else {
        ev.target.nextSibling.style.top = `${rootPositionY + rootHeight + 7}px`;
        ev.target.nextSibling.querySelector('.tooltip-message').classList.remove('top');
      }
    }
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(ev: any) {
    ev.target.parentElement.querySelectorAll('.message-wrapper').forEach((item: any) => {
      item.remove();
    })
  }
}
