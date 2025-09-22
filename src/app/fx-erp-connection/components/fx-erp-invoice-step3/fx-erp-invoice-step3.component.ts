import { Component, Input, NgZone, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { ConnectorService } from '../../../connector/connector.service';
import { InvoiceSteps } from '../../../connector/enums/status';

@Component({
  selector: 'app-fx-erp-invoice-step3',
  templateUrl: './fx-erp-invoice-step3.component.html',
  styleUrls: ['./fx-erp-invoice-step3.component.scss'],
  imports:[]
})
export class FxErpInvoiceStep3Component implements OnInit{
  @Input() stepper!: MatStepper; 
  selectedExposureType: any 
  sessionURI: any;
  embedUrl!: SafeUrl;
  sessionWindow!: Window | null;
  
  constructor(private readonly _connectorService: ConnectorService, private ngZone: NgZone)  { }

  ngOnInit(): void {
     this._connectorService.selectedAutoPilot$
        .pipe(
          filter(current => current !== null && current !== '') // skip null/empty
        )
        .subscribe(current => {
          this.selectedExposureType = current;
          //this.handleUrlParameters(this.selectedExposureType);
        });
  }

  ngAfterViewChecked(): void {
    if (this.selectedExposureType) {
      this.handleUrlParameters(this.selectedExposureType);
    }
  }

  // redirect to the step 2
  onBack() {
    this.stepper.selectedIndex = InvoiceSteps.IndexOne;
  }

  // redirect to the step 4
  connectToERP() {
     this._connectorService.setSelectedExposureType(this.selectedExposureType);
    //   this._connectorService.createPayablesProtectSession().subscribe((data: any) => {
    //   this.sessionURI = data?.sessionUri;
     
    //   this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data?.sessionUri);
    //   // var url = 'http://localhost:4200/payablesprotect?erp=true';

    //   var width = 800;
    //   var height = 600;

    //   var left = (screen.width - width) / 2;
    //   var top = (screen.height - height) / 2;

    //   // to open in new window
    //   this.sessionWindow = window.open(this.sessionURI, '_blank', 'width=' + width + ',height=' + height + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,left=' + left + ',top=' + top);
    // });

      // this.temporaryClick();
    this.handleUrlParameters(this.selectedExposureType);
  }

   handleUrlParameters(selectedValue: string = ''): void {
    if (this.sessionWindow !== undefined && this.sessionWindow !== null) {
      console.log(this.sessionWindow);
      localStorage.setItem('sessionWindowUrl', this.sessionWindow?.location?.href!);
    }
    const sessionWindowUrl = localStorage.getItem('sessionWindowUrl');
    this.ngZone.run(() => {
      if (sessionWindowUrl?.includes('erp=true')) {
        if (this.sessionWindow && !this.sessionWindow.closed) {
          this.sessionWindow.close();
          // this.authenticateService.getUserProfile().subscribe((data: any) => {
          //     localStorage.setItem('user', JSON.stringify(data));
          //   });
          setTimeout(() => {
            localStorage.removeItem('sessionWindowUrl');
          }, 1000);
          
        }
      }
      if (this.stepper) {
        if (selectedValue) {
          this.stepper.selectedIndex = 3;
        }
      }
    });
   
  }
}
