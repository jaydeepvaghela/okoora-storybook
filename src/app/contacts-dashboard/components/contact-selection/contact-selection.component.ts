import { Component, Input } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-selection',
  templateUrl: './contact-selection.component.html',
  styleUrls: ['./contact-selection.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactSelectionComponent {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('type') type?: any;
  @Input() addNewAccount!: boolean;
  @Input('isUserHasCCAccount') isUserHasCCAccount: any;


  constructor(private contactsService: ContactsService) { }

  nextStep(stepper: any, progress: any) {
    if (this.type?.value?.ContactType == 'payer' && !this.isUserHasCCAccount) {
      localStorage.setItem('payerselected', JSON.stringify(true));
      this.contactsService.backFromNewBenificiary.next(false)
    } else if (this.type?.value?.ContactType == 'payer' && this.isUserHasCCAccount) {
      this.contactsService.backFromNewBenificiary.next(true);
      localStorage.removeItem('payerselected');
    } else if (this.type?.value?.ContactType == 'beniciary') {
      localStorage.removeItem('payerselected');
      if (stepper) {
        stepper.next(); // This moves to the next step
      }
    }
    if (this.formStepper) {

      let totalSteps = stepper.steps.length;
      let currentStep = stepper.selectedIndex + 1;
      progress.value = (currentStep * 100) / totalSteps;
      const scrollToTopNext = document.querySelector<HTMLElement>('mat-dialog-content');
      if (scrollToTopNext) {
        scrollToTopNext.scrollTop = 0;
      }
    }
    // document.getElementsByClassName('mat-dialog-content')[0].scrollTop = 0;
  }
  previousStep(stepper: any, progress: any) {
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
    const scrollToTopPrev = document.querySelector<HTMLElement>('mat-dialog-content');

    if (scrollToTopPrev) {
      scrollToTopPrev.scrollTop = 0;
    }
  }
}
