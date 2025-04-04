import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hedge-tandc-details',
  imports: [CommonModule],
  templateUrl: './hedge-tandc-details.component.html',
  styleUrl: './hedge-tandc-details.component.scss'
})
export class HedgeTandcDetailsComponent {
  isScrolledToEnd: any;
  showErrorMsg: any;

  cancelConfirmation() {

  }

  takeConfirmAction() {

  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    this.isScrolledToEnd = atBottom;
    if(this.isScrolledToEnd){
      this.showErrorMsg = false;
    }
  }


}
