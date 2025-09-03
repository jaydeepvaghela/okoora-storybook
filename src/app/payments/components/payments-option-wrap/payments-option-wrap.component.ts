import { Component, Output, EventEmitter } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payments-option-wrap',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule],
  templateUrl: './payments-option-wrap.component.html',
  styleUrls: ['./payments-option-wrap.component.scss']
})
export class PaymentsOptionWrapComponent {
  @Output() singlePayment = new EventEmitter<void>();
  @Output() massPayment = new EventEmitter<void>();
  @Output() exchangeNow = new EventEmitter<void>();
  @Output() exchangePlan = new EventEmitter<void>();
  @Output() lockRate = new EventEmitter<void>();

  emitSinglePayment() {
    this.singlePayment.emit();
  }

  emitMassPayment() {
    this.massPayment.emit();
  }

  emitExchangeNow() {
    this.exchangeNow.emit();
  }

  emitExchangePlan() {
    this.exchangePlan.emit();
  }

  emitLockRate() {
    this.lockRate.emit();
  }
}
