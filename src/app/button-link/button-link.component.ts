import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-link',
  imports: [],
  template: `
    <button
  type="button"
  (click)="onClick.emit($event)"
>
  {{ label }}
</button>
  `,
  styleUrls: ['button-link.component.scss']
})
export class ButtonLinkComponent {
@Input()
  primary = false;

  /** What background color to use */
  @Input()
  backgroundColor?: string;

  /** How large should the button be? */
  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Button contents
   *
   * @required
   */
  @Input()
  label = 'Button';

  /** Optional click handler */
  @Output()
  onClick = new EventEmitter<Event>();

  public get classes(): string[] {
    const mode = this.primary ? 'app-button-link--primary' : 'app-button-link--secondary';

    return ['app-button-link', `app-button-link--${this.size}`, mode];
  }
}
