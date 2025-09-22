import { Component, Input, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-fx-erp-invoice-step4',
  templateUrl: './fx-erp-invoice-step4.component.html',
  styleUrls: ['./fx-erp-invoice-step4.component.scss']
})
export class FxErpInvoiceStep4Component implements OnInit {
  sessionWindow: Window | null;
  @Input() stepper!: MatStepper; 

  ngOnInit() {
    // this.temporaryClick();
    this.stepper.next();
  }
  // importInvoices(selectedValue: string) {
  //   this.selectedExposureType = selectedValue;
  //   this._connectorService.setSelectedExposureType(this.selectedExposureType);
  //   // this.connectorService.createPayablesProtectSession().subscribe((data: any) => {
  //   //   this.sessionURI = data?.sessionUri
  //   //   this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data?.sessionUri);
  //   //   // var url = 'http://localhost:4200/payablesprotect?erp=true';
 
  //   //   var width = 800;
  //   //   var height = 600;
 
  //   //   var left = (screen.width - width) / 2;
  //   //   var top = (screen.height - height) / 2;
 
  //   //   // to open in new window
  //   //   this.sessionWindow = window.open(
  //   //     this.sessionURI,
  //   //     "_blank",
  //   //     "width=" + width + ",height=" + height + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,left=" + left + ",top=" + top
  //   //   );
  //   // })
  //   this.temporaryClick();
  //   this.handleUrlParameters(this.selectedExposureType);
  // }
 
  // ngAfterViewChecked(): void {
  //   if (this.selectedExposureType) {
  //     this.handleUrlParameters(this.selectedExposureType);
  //   }
  // }
  // handleUrlParameters(selectedValue: string = ''): void {
  //   if (this.sessionWindow !== undefined && this.sessionWindow !== null) {
  //     console.log(this.sessionWindow);
  //     localStorage.setItem('sessionWindowUrl', this.sessionWindow?.location?.href!);
  //   }
  //   const sessionWindowUrl = localStorage.getItem('sessionWindowUrl');
  //   this.ngZone.run(() => {
  //     if (sessionWindowUrl?.includes('erp=true')) {
  //       if (this.sessionWindow && !this.sessionWindow.closed) {
  //         this.sessionWindow.close();
  //       }
  //       if(this.matStepper) {
  //          if (selectedValue == 'invoice') {
  //         this.matStepper.selectedIndex = 2;
  //       } else {
  //         this.matStepper.selectedIndex = 1;
  //       }
  //       }
  //     }
  //   });
  // }
  temporaryClick() {
    var width = 800;
    var height = 600;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    // Open a new window with the desired URL
    var url = 'http://localhost:4200/payablesprotect?erp=true';
    this.sessionWindow = window.open(url,
      "_blank",
      "width=" + width + ",height=" + height + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,left=" + left + ",top=" + top
    );
  }
}
