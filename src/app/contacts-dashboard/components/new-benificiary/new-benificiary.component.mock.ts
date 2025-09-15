import { ChangeDetectorRef, Component } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-benificiary',
  template: `
    <div>Mock New Beneficiary Component</div>
  `,
})
export class MockNewBeneficiaryComponent {
  constructor(
    public contactsService: ContactsService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {}
}