import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-hedge-tandc-details',
  imports: [CommonModule],
  templateUrl: './hedge-tandc-details.component.html',
  styleUrl: './hedge-tandc-details.component.scss'
})
export class HedgeTandcDetailsComponent {
  isScrolledToEnd: any;
  showErrorMsg: any;

  constructor(
    private dialogRef: MatDialogRef<HedgeTandcDetailsComponent>
  ) {}

  cancelConfirmation() {
    this.dialogRef.close(); // <-- Close on cancel
  }

  takeConfirmAction() {
    this.dialogRef.close('confirmed'); // <-- Optionally pass a value
  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    this.isScrolledToEnd = atBottom;
    
    if(this.isScrolledToEnd) {
      this.showErrorMsg = false;
    }
  }
}
