import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatTabGroup } from '@angular/material/tabs';
import { DatePipe } from "@angular/common";
import { ContactsService } from './services/contacts.service';
import { AddContactsComponent } from './components/add-contacts/add-contacts.component';

@Component({
  selector: 'app-contacts-dashboard',
  templateUrl: './contacts-dashboard.component.html',
  styleUrls: ['./contacts-dashboard.component.scss'],
  providers: [DatePipe],
})
export class ContactsDashboardComponent implements OnDestroy {
  selectedItemData: any;
  isPayer = false;
  isBeneficiary = false;
  noDetailsFound = false;
  sessionURI: any;
  importedBeneficiaryData: any;
  embedUrl!: SafeUrl;
  modifyImportErpBtnText: boolean = false;
  @ViewChild('contactTabGroup') contactTabGroup!: MatTabGroup;
  erpServiceTitle!: string;
  hiddenBeneficiaryLength: any;
  hiddenListCheckbox = false;
  refreshListFlag!: boolean;
  apiCallTime: any;
  timerSubscription: any;
  flag: boolean = false;
  importedBeneficiaryLength: any;
  createContact!: string;
  isNonIsraeliUser!: boolean;
  paymentReason: any = [];
  countryList:any = [];

  constructor(
    public dialog: MatDialog,
    private contactsService: ContactsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {

   }

  ngOnInit() {
    this.isNonIsraeliUser = this.contactsService.isNonIsraelUser();
    this.contactsService.fetchPaymentReasons.subscribe((res: any) => {
      this.paymentReason = res;
    })
    // this._commonService.getCountries().subscribe((data: any) => {
    //   this.countryList = data;
    // })

    const url = this.router.url;
    this.contactsService.isRedirectToPayerList.subscribe((res : boolean) => {
      if (res) {
        if (this.contactTabGroup) {
          this.contactTabGroup.selectedIndex = 1;
        }
      } else {
        if (this.contactTabGroup) {
          this.contactTabGroup.selectedIndex = 0;
        }
      }
      this.cd.detectChanges();
    })
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }
  createContactDialog(createContact: any) {
    this.contactsService.backFromNewBenificiary.next(false);
    this.contactsService.isNewBenificiaryconfirmClicked.next(false);
    localStorage.removeItem('newPayerId');
    let data = {}
    this.contactsService.setBeneficiaryDataForEdit(data);
    // this.payerService.setPayerDetailForEdit(data)
    if (this.contactsService.isNonIsraelUser()){
      this.createContact = 'non-israel';
    } else {
      this.createContact = 'addContact';
    }
    this.dialog.open(AddContactsComponent, {
      width: '100vw',
      maxWidth: '100vw',
      disableClose: true,
      data: {
        createContact: this.createContact
      }
    }).beforeClosed().subscribe(data => {
    });
  }

  activatedItem(ev: any) {
    this.selectedItemData = ev;
  }

}
