import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-current-hedge-box',
  imports: [CommonModule],
  templateUrl: './current-hedge-box.component.html',
  styleUrl: './current-hedge-box.component.scss'
})
export class CurrentHedgeBoxComponent {
  @Input() activeCurrency!: any;
}
