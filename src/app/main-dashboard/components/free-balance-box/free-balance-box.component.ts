import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-free-balance-box',
  imports: [CommonModule],
  templateUrl: './free-balance-box.component.html',
  styleUrl: './free-balance-box.component.scss'
})
export class FreeBalanceBoxComponent {
  @Input() currencySign!: string;
  @Input() freeBalance!: number;
  @Input() activeCurrency!: any;

  ngOnInit() {
  
  }
}
