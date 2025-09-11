import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SignaturePad, SignaturePadModule } from 'angular2-signaturepad';
import { WalletsService } from '../../../../../main-dashboard/services/wallets.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  imports: [SignaturePadModule, MatDialogModule, CommonModule]
})
export class SignatureComponent {
  signatureImg!: string;
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: Object = {
    penColor: 'blue',
    dotSize: 0.1,
    'canvasHeight': 130,
    'canvasWidth': 520
  };
  imagePath: any;
  files: any;
  signatureCheck: boolean = true;
  uploadstatus = false;
  uploadSignatureError: any;
  showLoader = false;

  constructor(
    private walletService: WalletsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SignatureComponent>
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.signaturePad) {
      this.signaturePad.resizeCanvas();
      this.signaturePad.set('minWidth', 2);
      this.signaturePad.clear();
    }
  }

  drawComplete() {
    this.signatureCheck = this.signaturePad?.isEmpty() ? true : false;
  }

  drawStart() {
  }

  clearSignature() {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.signatureCheck = true;
    }
  }

  dataURItoBlob(dataURI: any) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png', // Changed from jpg to png to match the file type
    });
  }

  savePad() {
    try {
      if (!this.signaturePad || this.signaturePad.isEmpty()) {
        this.uploadSignatureError = 'Please provide a signature before saving.';
        return;
      }

      const base64Data = this.signaturePad.toDataURL();
      
      // Handle callback if provided
      if (this.data?.salaryPaymentParam) {
        // Handle salary payment specific logic
      } else if (this.data?.drawCompleteFn) {
        this.data.drawCompleteFn(base64Data);
      }

      this.signatureImg = base64Data;

      const imageName = 'signature.png';
      const imageBlob = this.dataURItoBlob(this.signatureImg);
      const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
      
      this.showLoader = true;

      if (imageFile) {
        let formData = new FormData();
        formData.append('file', imageFile);
        
        // Return the signature data instead of just closing
        const result = {
          signature: base64Data,
          signatureFile: imageFile,
          formData: formData
        };

        // Close dialog with result data
        this.dialogRef.close(result);
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      this.uploadSignatureError = 'Error saving signature. Please try again.';
      this.showLoader = false;
    }
  }

  cancelDialog() {
    this.dialogRef.close(null);
  }
}