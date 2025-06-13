import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-conversion-done',
  templateUrl: './plan-conversion-done.component.html',
  styleUrls: ['./plan-conversion-done.component.scss']
})
export class PlanConversionDoneComponent {
  @Input() title = "Well done!";
  @Input() message = "You are done!";
  @Input() buttonText = "Back To Home!";
  @Input() navigateTo = "/";
  @Input() classes!: string;
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;

  constructor( private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  closePaymentDone() {
    this.dialog.closeAll();
  }

  goToPrevious() {
    this.formStepper.previous()
  }
  commaseprate(e: any) {
    const actualNumber = +e?.toString()?.slice(1)?.replace(/,/g, '')
    const formatted = actualNumber?.toLocaleString('en-US', { maximumFractionDigits: 4 })
    return formatted
  }
}
