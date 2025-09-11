import { Component, OnInit, OnDestroy, SimpleChanges, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { SignaturePad, SignaturePadModule } from 'angular2-signaturepad';
import { Subscription } from 'rxjs';
import { WalletsService } from '../../../../main-dashboard/services/wallets.service';
import FileType from '../../../../shared/constants/FileType';
import { CommonModule } from '@angular/common';
import { WalletCurrencyComponent } from '../wallet-currency/wallet-currency.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  imports: [CommonModule,WalletCurrencyComponent, SignaturePadModule]
})
export class PreviewComponent implements OnInit, OnDestroy {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  @Input('beneficiaryForms') beneficiaryForms!: FormGroup[];
  @Input('selectedWallet') selectedWallet: any;
  @Input('isPreview') isPreview!: boolean;
  @Input('walletList') walletList: any;
  @Output() changeCurrencyWallet: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeIsPreview: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() beneficiaryFormsChange = new EventEmitter<FormGroup[]>();
  signaturePadOptions: Object = {
    penColor: 'black',
    dotSize: 0.1,
    canvasHeight: 130,
    canvasWidth: 600,
  };
  policyApproved = false;
  buttonLoading = false;
  isLoading = false;
  @Input() isComplete!: boolean;
  showTooltip: any = {};
  error = '';
  formDataForRefresh: any;
  timer!: number;
  signatureDate!: string;
  signatureImg!: string;
  signatureCheck: boolean = true;
  needSign: boolean = false;
  private refreshSubscription!: Subscription;
  private intervalId: any = null;

  constructor(private _walletService: WalletsService, public dialog: MatDialog, public dialogRef: MatDialogRef<PreviewComponent>) {}

  ngOnInit() {
    this.handleTimerExpiration();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedWallet'] && !changes['selectedWallet'].firstChange) {
      this.error = '';
      this.resetTimer();
    }
  }
  handleChangeCurrencyWallet(event: boolean) {
    this.changeCurrencyWallet.emit(event);
  }
  
  goBack() {
    this.changeIsPreview.emit(false);
    this._walletService.setIsCompleteMassPayment(false);
  }

  removeForm() {
    localStorage.removeItem('beneficiaryForms');
  }
  dataURItoBlob(dataURI: string, mimeType: string = 'image/png'): Blob {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeType });
  }

  async uploadFile() {
    this.needSign = true;
    this.signatureCheck = this.signaturePad.isEmpty();

    if (!this.signatureCheck) {
      const base64Data = this.signaturePad.toDataURL();
      this.signatureImg = base64Data;
      const imageName = 'sign.png';
      const imageBlob = this.dataURItoBlob(this.signatureImg, 'image/png');
      const imageFile = new File([imageBlob], imageName, { type: 'image/png' });

      if (imageFile) {
        let formData = new FormData();
        const query = {
          fileType: FileType.needSign,
        };
        formData.append('file', imageFile);
        const query2: any = {};
        let Index = 0;
        let signatureIndex = 0; // Separate counter for forms that need a signature
        this.beneficiaryForms.forEach((formGroup) => {
          if (formGroup.get('signAndFiles')?.value.needSign) {
            const requestIdControl = formGroup.get('requestId');
            if (requestIdControl) {
              formData.append(`paymentRequestIds[${signatureIndex}]`, requestIdControl.value);
              signatureIndex++; // Increment only if the form needs a signature
            } else {
              console.error('Form control "requestId" is missing in form group');
            }
          }
          const requestIdControl2 = formGroup.get('requestId');
              if (requestIdControl2) {
                query2[`multiRequestId[${Index}]`] = requestIdControl2.value;
                Index++;
              } else {
                console.error('Form control "requestId" is missing in form group:', Index);
              }
        });
          this.beneficiaryForms = [];
          this.beneficiaryFormsChange.emit([]);
          this.isComplete = true;
          this._walletService.setIsCompleteMassPayment(this.isComplete);
          if (this.isComplete) {
            this.clearInterval();
          }
    }
  }
}

  async pay() {
    if (!this.beneficiaryForms.length || !this.policyApproved) return;
    this.buttonLoading = true;

    try {
      if (this.needSignInBeneficiaries()) {
        await this.uploadFile();
      }
      else
      {
        const query: any = {};
        this.beneficiaryForms.forEach((formGroup, i) => {
          const requestIdControl = formGroup.get('requestId');
          if (requestIdControl) {
            query[`multiRequestId[${i}]`] = requestIdControl.value;
          } else {
            console.error('Form control "requestId" is missing in form group:', i);
          }
        });

          this.beneficiaryForms = [];
          this.beneficiaryFormsChange.emit([]);
          this.isComplete = true;
          this._walletService.setIsCompleteMassPayment(this.isComplete);
          if (this.isComplete) {
            this.clearInterval();
          }
      }
    } catch (error: any) {
      this.error = error.error.apiErrorCode;
      this.resetTimer();
    } finally {
      this.buttonLoading = false;
    }
   }

  private clearInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  private handleTimerExpiration() {
    this.clearInterval();

    // Call the refresh API
    const requestIds = this.beneficiaryForms.map((form) => form.get('requestId')?.value).filter((requestId) => requestId !== null);
    this.refreshMultiPaymentRequest(requestIds);

    this.startTimer();
  }

  refreshMultiPaymentRequest(ids: string[]) {
    this.formDataForRefresh = new FormData();

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    for (var j = 0; j < ids.length; j++) {
      this.formDataForRefresh.append('multiRequestId[' + j + ']', ids[j]);
    }
    this.isLoading = true;
  }

  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }
  closeMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }
  totalCharge(): number {
    return this.beneficiaryForms.reduce((acc, formGroup) => {
      const charge = parseFloat(formGroup.get('charge')?.value) || 0;
      const costType = parseFloat(formGroup.get('costType')?.value['value']) || 0;

      return acc + charge + costType;
    }, 0);
  }

  private startTimer() {
    this.timer = 15;
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.handleTimerExpiration();
      }
    }, 1000);
  }
  getFormattedTime(): string {
    return this.timer < 10 ? `00:0${this.timer}` : `00:${this.timer}`;
  }
  handleBeneficiaryFormsChangee(updatedForms: FormGroup[]) {
    this.beneficiaryForms = updatedForms;
  }
  changeIsLoading(value: any) {
    this.isLoading = value;
  }
  private resetTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Reset intervalId to null
    }
    this.startTimer();
  }

  needSignInBeneficiaries() {
    return this.beneficiaryForms.some((form) => {
      const signAndFiles = form.get('signAndFiles');
      return signAndFiles && signAndFiles.value?.needSign;
    });
  }
  drawComplete() {
    this.signatureCheck = this.signaturePad.isEmpty();
    if (!this.signatureCheck) {
    }
  }

  closeMassPayment() {
    this.dialogRef.close('completedMassPayment');
    this._walletService.setIsCompleteMassPayment(false);
    localStorage.removeItem('beneficiaryForms');
  }

  drawStart() {}


  clearImg() {
    this.needSign = true;
    this.signaturePad.clear();
  }

  drawClear() {
    this.signatureCheck = this.signaturePad.isEmpty();
    this.needSign = true;
  }
  ngOnDestroy() {
    this.clearInterval();
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
