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
  isScrolledToEnd: boolean = false;
  showErrorMsg: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<HedgeTandcDetailsComponent>
  ) {}

  ngOnInit(): void {
    this.isScrolledToEnd = false;
  }

  cancelConfirmation() {
    this.dialogRef.close(); 
  }

  takeConfirmAction() {
    if (!this.isScrolledToEnd) {
      this.showErrorMsg = true;
      return;
    }
    this.dialogRef.close('confirmed');
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
