
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
  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private contactsService: ContactsService,
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

  async gotTopusher() {
    console.log("clicked");
  }

  skipStep(stepper: any, progress: any) {
    this.benificiaryObjectFromInvoice$ = of([]);
    this.contactsService.setBeneficiaryObject({})
    // this.benificiaryForm.reset();
    // this.benificiaryForm.patchValue({
    //   type: {
    //     ContactType: "beniciary"
    //   },
    // })

    // this.files = []
    // let totalSteps = stepper.steps.length;
    // let currentStep = stepper.selectedIndex + 1;
    // progress.value = (currentStep * 100) / totalSteps;
    if (this.newBenificiaryStepper) {
      this.newBenificiaryStepper.selectedIndex = 1;
    }
    // this.stepChanged.emit();
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
    this.loading = false; // Hide the loader
    this.uploadProgress = 0; // Reset the progress to 0
    this.files = []; // Clear the uploaded files array
    this.fileInput.nativeElement.value = ''; // Reset the file input element
    this.stopGradualProgress(); // Stop the progress timer if running
    delete this.dataFromPusherForMsg; // Clear any data from Pusher
    this.fileUploadError = '';
  }
  async onFileSelect(event: any) {
    this.loading = true;
    this.isError = false;
    this.uploadProgress = 0;
    this.cancelUpload = false;
    this.files = [];
    delete this.dataFromPusherForMsg
    this.files.push(...event.addedFiles);
    const formData = new FormData();
    formData.append("file", event.addedFiles[0]);
    if (this.validateFile(event)) {
      this.isError = true;
      this.uploadProgress = 80;
      this.loading = false;
      return;
    }

    if (!this.isError) {
      this.startGradualProgress();
      this.uploadTimeoutSubscription = timer(20000).subscribe(() => {
        if (!this.dataFromPusherForMsg) { // If no response yet
          this.fileUploadError = this.translateService.instant('FORMS_ERRORS.FileDoesntUpload');
          this.uploadProgress = 80;
          this.loading = false;
          this.stopGradualProgress();
          // this.resetUploadState(); // Reset UI state
        }
      });
      // const uploadSubscription = this.contactsService.addInvoice(formData).subscribe({
      //   next: (data: any) => {
      //     if (this.cancelUpload) {
      //       uploadSubscription.unsubscribe();
      //       this.uploadTimeoutSubscription.unsubscribe();
      //       return;
      //     } else {
      //       if (data.type === HttpEventType.UploadProgress) {
      //         if (data.total) {
      //           this.uploadProgress = Math.round((100 * data.loaded) / data.total);
      //         }
      //       } else if (data.type === HttpEventType.Response) {
      //         this.uploadProgress = 100;
      //         this.isFileExist = true;
      //         this.uploadTimeoutSubscription.unsubscribe();
      //         this.listenToPusher(data?.body);
      //       }
      //     }
      //   },
      //   error: () => {
      //     this.fileUploadError = this.translateService.instant('FORMS_ERRORS.FileDoesntUpload');
      //     this.uploadProgress = 80;  // Stop progress at 80% on any upload error
      //     this.loading = false;
      //     this.uploadTimeoutSubscription.unsubscribe();
      //     // this.resetUploadState();
      //   }
      // });
    }

  }

  startGradualProgress() {
    this.gradualProgressTimer = interval(100) // Adjust the interval as needed for speed
      .pipe(takeWhile(() => this.uploadProgress < 90)) // Stop at 90% to leave room for actual progress
      .subscribe(() => {
        this.uploadProgress += 1;
      });
  }

  stopGradualProgress() {
    if (this.gradualProgressTimer) {
      this.gradualProgressTimer.unsubscribe();
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
    if (fileSizeMB > 5) {
      return true;
    }
    return false;
  }
  // let invoiceFileArray = this.payment.get('invoice').value;
  // this.files.push(...event.addedFiles);
  // invoiceFileArray.push(this.files[0]);
  // }
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
        this.stopGradualProgress();
        this.uploadProgress = 40;
        return
        // this.resetUploadState();
        // Handle the case where the dialog was closed with the selectFileManually flag set to true
        console.log("confirm dialog, dialog closed");
        // Any additional logic here
      }
    });
  }

  uploadFile() {
    this.contactService.usUploadFileFromGeneralDetails.next(true);
    localStorage.setItem('isUploadClicked',JSON.stringify(true));
    let intervalId = setInterval(() => {
      if (this.newBenificiaryStepper) {
        this.newBenificiaryStepper.selectedIndex = 1;
        clearInterval(intervalId); // Clear the interval to stop further execution
      }
    }, 1000);
  }

}

