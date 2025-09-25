import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fx-conversion-step1',
  templateUrl: './fx-conversion-step1.component.html',
  styleUrls: ['./fx-conversion-step1.component.scss']
})
export class FxConversionStep1Component {
  @Input() stepper: any; // MatStepper instance
  @Output() backToErp = new EventEmitter<void>();
  @Input() fxConversionForm!: FormGroup;
  constructor() { }

  next() {
    this.stepper.next(); // Move to the next step in the stepper
  }
  previous(){
    this.backToErp.emit();// Move to the previous step in the stepper
  }
}
