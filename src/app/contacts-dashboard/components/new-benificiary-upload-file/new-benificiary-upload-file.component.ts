import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ContactsService } from '../../services/contacts.service';
import { BehaviorSubject, Observable, Subscription, interval, of, takeWhile, tap, timer } from 'rxjs';
import { BenificiaryModel } from '../../models/BenificiaryModel';
import { __values } from 'tslib';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmDialogUploadFileComponent } from '../confirm-dialog-upload-file/confirm-dialog-upload-file.component';

@Component({
  selector: 'app-new-benificiary-upload-file',
  templateUrl: './new-benificiary-upload-file.component.html',
  styleUrls: ['./new-benificiary-upload-file.component.scss'],
  imports: [NgxDropzoneModule, CommonModule, MatProgressBarModule]
})
export class NewBenificiaryUploadFileComponent {
  @Input('formStepper') formStepper?: any;
  @Input('formStepperProgress') formStepperProgress?: any;
  @Input('payment') payment?: any;
  @Input('benificiaryForm') benificiaryForm?: any
  @Input('newBenificiaryStepper') newBenificiaryStepper?: any
  @ViewChild('fileInput') fileInput!: ElementRef;

  cancelUpload: boolean = false;
  benificiaryObjectFromInvoice$!: Observable<BenificiaryModel[]>;
  benificiaryBlankObject$!: Observable<BenificiaryModel[]>;

  files: File[] = [];
  showCustomInvoiceCreate = false;
  payerProfile!: string;
  isLastStep = false;
  selectedProduct: any;
  beneficiaryObjectData: any;
  loading!: boolean;
  dataFromPusherForMsg: any;
  fileUploadError = '';
  uploadProgress: number = 0;
  isFileExist = false;
  gradualProgressTimer!: Subscription;
  isError = false;
  private uploadTimeoutSubscription!: Subscription;
  private finalProgressTimer!: Subscription;

  constructor(
    private http: HttpClient, 
    private cd: ChangeDetectorRef, 
    private contactsService: ContactsService,
    private translateService: TranslateService,
    private contactService: ContactsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<NewBenificiaryUploadFileComponent>
  ) { }

  ngOnInit() {
    this.contactsService.currentInvoiceObject.subscribe((data) => {
      this.beneficiaryObjectData = data
    });
    this.contactsService.isUploadDocNewBenFileExist.subscribe(res => {
      if (res) {
        this.files = [];
      }
    })
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.stopSmoothProgress();
    if (this.uploadTimeoutSubscription) {
      this.uploadTimeoutSubscription.unsubscribe();
    }
    if (this.finalProgressTimer) {
      this.finalProgressTimer.unsubscribe();
    }
  }

  skipStep(stepper: any, progress: any) {
    this.benificiaryObjectFromInvoice$ = of([]);
    this.contactsService.setBeneficiaryObject({})

    if (this.newBenificiaryStepper) {
      this.newBenificiaryStepper.selectedIndex = 1;
    }
    
    const scrollToTopNext = document.querySelector<HTMLElement>('mat-dialog-content');
    if (scrollToTopNext) {
      scrollToTopNext.scrollTop = 0;
    }
  }

  nextStep(stepper: any, progress: any) {
    let totalSteps = stepper.steps.length;
    let currentStep = stepper.selectedIndex + 1;
    progress.value = (currentStep * 100) / totalSteps;
    const scrollToTopNext = document.querySelector<HTMLElement>('mat-dialog-content');
    if (scrollToTopNext) {
      scrollToTopNext.scrollTop = 0;
    }
  }

  resetUploadState() {
    this.loading = false;
    this.uploadProgress = 0;
    this.files = [];
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.stopSmoothProgress();
    delete this.dataFromPusherForMsg;
    this.fileUploadError = '';
    this.cancelUpload = false;
    this.isError = false;
    this.isFileExist = false;
  }

  async onFileSelect(event: any) {
    this.loading = true;
    this.isError = false;
    this.uploadProgress = 0;
    this.cancelUpload = false;
    this.files = [];
    delete this.dataFromPusherForMsg;
    this.fileUploadError = '';
    
    this.files.push(...event.addedFiles);

    if (this.validateFile(event)) {
      this.isError = true;
      this.uploadProgress = 0;
      this.loading = false;
      return;
    }

    if (!this.isError) {
      // Start the smooth progress animation
      this.startSmoothProgress();
      
      // Set timeout for upload failure
      this.uploadTimeoutSubscription = timer(20000).subscribe(() => {
        if (!this.dataFromPusherForMsg && this.uploadProgress < 100) {
          this.fileUploadError = this.translateService.instant('FORMS_ERRORS.FileDoesntUpload');
          this.stopSmoothProgress();
          this.loading = false;
          this.isError = true;
        }
      });

      // Simulate upload process - replace this with your actual process initiation
      // For now, we'll simulate a successful upload after 3 seconds
      timer(3000).subscribe(() => {
        if (!this.cancelUpload && !this.isError) {
          // Simulate successful response - replace with actual Pusher data when received
          const mockResponse = { 
            beneficiaryId: '12345', 
            status: 'processed',
            fileName: this.files[0]?.name 
          };
          this.completeUpload(mockResponse);
        }
      });
    }
  }

  // Smooth progress that stops at 85% to wait for completion
  startSmoothProgress() {
    this.gradualProgressTimer = interval(150)
      .pipe(
        takeWhile(() => this.uploadProgress < 85 && !this.cancelUpload && !this.isError)
      )
      .subscribe(() => {
        // Exponential slowdown as we approach 85%
        const remaining = 85 - this.uploadProgress;
        const increment = Math.max(0.5, remaining / 15);
        this.uploadProgress = Math.min(85, this.uploadProgress + increment);
        this.uploadProgress = Math.floor(this.uploadProgress); // Round down
        this.cd.detectChanges();
      });
  }

  stopSmoothProgress() {
    if (this.gradualProgressTimer) {
      this.gradualProgressTimer.unsubscribe();
    }
  }

  // Call this method when you receive data from Pusher or your data source
  completeUpload(data: any) {
    this.stopSmoothProgress();
    
    // Animate final progress from current position to 100%
    this.finalProgressTimer = interval(50).pipe(
      takeWhile(() => this.uploadProgress < 100)
    ).subscribe(() => {
      this.uploadProgress += 3;
      this.uploadProgress = Math.min(100, this.uploadProgress);
      this.uploadProgress = Math.floor(this.uploadProgress); // Round down
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        this.isFileExist = true;
        this.loading = false;
        this.dataFromPusherForMsg = data;
        
        if (this.uploadTimeoutSubscription) {
          this.uploadTimeoutSubscription.unsubscribe();
        }
        if (this.finalProgressTimer) {
          this.finalProgressTimer.unsubscribe();
        }
        
        this.cd.detectChanges();
        
        // Process the received data
        this.contactsService.setBeneficiaryObject(data);
      }
    });
  }

  // Call this method when you receive data from Pusher
  onPusherDataReceived(data: any) {
    if (this.uploadProgress > 0 && this.uploadProgress < 100 && !this.isError) {
      this.completeUpload(data);
    }
  }

  validateFile(files: any): boolean {
    this.fileUploadError = '';
    
    if (files.rejectedFiles.length > 0) {
      this.fileUploadError = this.translateService.instant('FORMS_ERRORS.fileNotSupported');
      return true;
    }
    
    let value = this.handleUploadFileSizing(files.addedFiles);
    if (value) {
      this.fileUploadError = this.translateService.instant('FORMS_ERRORS.fileSizeExceedsForUpload');
      return true;
    }
    
    return false;
  }

  handleUploadFileSizing(files: any): boolean {
    let fileSizeMB = 0;
    for (let i = 0; i < files.length; i++) {
      fileSizeMB += files[i].size / (1024 * 1024);
    }
    return fileSizeMB > 5;
  }

  onFileChange(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  stopUploadFile(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialogUploadFileComponent, {
      height: "auto",
      panelClass: "confirm-dialog-upload-file"
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.cancelUpload = true;
        this.stopSmoothProgress();
        
        if (this.finalProgressTimer) {
          this.finalProgressTimer.unsubscribe();
        }
        if (this.uploadTimeoutSubscription) {
          this.uploadTimeoutSubscription.unsubscribe();
        }
        
        this.uploadProgress = 40;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // Retry upload Functionality
  retryUpload() {
    if (this.files.length > 0) {
      const event = { addedFiles: this.files, rejectedFiles: [] };
      this.onFileSelect(event);
    }
  }

  uploadFile() {
    this.contactService.usUploadFileFromGeneralDetails.next(true);
    localStorage.setItem('isUploadClicked', JSON.stringify(true));
    
    let intervalId = setInterval(() => {
      if (this.newBenificiaryStepper) {
        this.newBenificiaryStepper.selectedIndex = 1;
        clearInterval(intervalId);
      }
    }, 1000);
  }
}