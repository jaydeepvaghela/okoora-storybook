import { ChangeDetectorRef, Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import { beneficiaryStatus } from '../../../enums/TransactionStatusPayment.enum';
import { CommonModule } from '@angular/common';
import { TopContentComponent } from '../top-content/top-content.component';
import { WalletCurrencyComponent } from '../wallet-currency/wallet-currency.component';
import { RecipientTableComponent } from '../recipient-table/recipient-table.component';
import { of } from 'rxjs';
import { getAllBeneficieryByAccount } from '../../../payments-data/all-beneficiaries-data';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-mass-payment',
  templateUrl: './mass-payment.component.html',
  styleUrls: ['./mass-payment.component.scss'],
  imports: [CommonModule, TopContentComponent, WalletCurrencyComponent, RecipientTableComponent, PreviewComponent]
})
export class MassPaymentComponent implements OnInit {
  approvedBeneficiaries: any[] = [];
  isAddRecipient: boolean = false;
  beneficiaryForms: FormGroup[] = [];
  addMoreRecipients!: boolean;
  isPreview: boolean = false;
  walletList: any = [];
  isLoading = false;
  selectedWallet: any;
  private asyncOperationsCompleted = { beneficiariesLoaded: false };
  userRoleType!: number;
  importFiles: any;
  uploadImportError!: boolean;
  valueLength: any;
  valueSubscription: any;
  activeCurrencyListFilter: any;
  isComplete: boolean = false;

  constructor(
    private _walletService: WalletsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MassPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadApprovedBeneficiaries();
    this._walletService.availableWalletsData.subscribe((data: any) => {
      this.walletList = data
    })

    this._walletService.activeCurrentWallet.subscribe((res) => {
      this.activeCurrencyListFilter = this.walletList.filter((option: any) => option?.wallet_Currency?.code?.toLowerCase().includes(res?.wallet_Currency?.code?.toLowerCase()));
      this.selectedWallet = this.activeCurrencyListFilter[0];
      this.cdr?.detectChanges();
    });
    this.valueSubscription = this._walletService.lengthValue$.subscribe((loading) => {
      this.valueLength = loading;
    });
    this._walletService.getIsCompleteMassPayment().subscribe(isComplete => {
      this.isComplete = isComplete;
    });
  }
  ngOnDestroy() {
    // this._snackBar.dismiss();
    // this.valueSubscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedWallet'] && !changes['selectedWallet'].firstChange) {
      this.isLoading = true;
    }
  }
  changeIsLoading(value: any) {
    this.isLoading = value;
  }
  goBack() {
    this.changeIsPreview(false);
  }
  closeMassPayment() {
    this._walletService.setIsCompleteMassPayment(false);
    this.dialogRef.close();
  }
  changeIsPreview(value: boolean) {
    this.isPreview = value;
  }
  changeCurrencyWallet(value: any) {
    this.selectedWallet = value;
  }
  handleBeneficiaryFormsChange(updatedForms: FormGroup[]) {
    this.beneficiaryForms = updatedForms;
  }
  save() {
    this.isPreview = true;
  }

  private loadApprovedBeneficiaries(): void {
    of(getAllBeneficieryByAccount).subscribe({
      next: (res) => this.handleResponse(res),
      error: (err) => this.handleError(err),
    });
  }
  private checkLoadingState() {
    if (this.asyncOperationsCompleted.beneficiariesLoaded) {
      this.isLoading = false;
    }
  }

  private handleResponse(res: any): void {
    this.approvedBeneficiaries = res.filter((beneficiary: any) => beneficiary.status === beneficiaryStatus.APPROVED);
    this.asyncOperationsCompleted.beneficiariesLoaded = true;
    this.checkLoadingState();
  }

  private handleError(err: any): void {
    this.asyncOperationsCompleted.beneficiariesLoaded = true;
    this.checkLoadingState();
  }

  handleAddMoreRecipientsChanged(value: boolean) {
    this.addMoreRecipients = value;
  }
  addNewBeneficiaryForm() {
    this.addMoreRecipients = true;
  }
  DownloadTemplate() {
    // this._walletService.downloadExcel().subscribe((data: any) => {
    //   this.downloadBlob(data, 'IsMassTemplate.xlsx');
    // });
  }

  private downloadBlob(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  ImportTemplate(event: any) {
    // console.log(event?.target?.files?.length);
    if (event?.target?.files?.length > 1) {
      const config: MatSnackBarConfig = {
        panelClass: ['snack-message-error', 'snack-message-error-massImportFile'],
        horizontalPosition: 'left',
        duration: -1,
        data: {
          message: `<p>Only one file can be uploaded</p>`,
          type: 'error',
        },
      };

      // const snackBarRef = this._snackBar.openFromComponent(SnackMessageComponent, config);
    } else {
      this.importFiles = []
      this.importFiles.push(event.target.files[0]);
      this.uploadImportError = false;
      // console.log("this.importFiles[0]?.type", this.importFiles[0]?.type);

      const allowedTypes = new Set(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
      if (!allowedTypes.has(this.importFiles[0]?.type)) {
        const extension = this.importFiles[0]?.name?.split('.').pop();
        this.uploadImportError = true

        const config: MatSnackBarConfig = {
          panelClass: ['snack-message-error', 'snack-message-error-massImportFile'],
          horizontalPosition: 'left',
          duration: -1,
          data: {
            message: `<p>Cannot load this file type</p>`,
            type: 'error',
          },
        };

        // const snackBarRef = this._snackBar.openFromComponent(SnackMessageComponent, config);


      } else {
        this._walletService?.SetImportMassPAymentFile(event);
        this._snackBar.dismiss();
      }
    }
  }
  canProceedToNext(): boolean {
    return this.beneficiaryForms.every((form) => form.valid);
    // return this.beneficiaryForms.length > 0 ;
  }
}
