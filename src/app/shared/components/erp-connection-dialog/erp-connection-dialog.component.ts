import { Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SetAutoPilotDialogComponent } from '../set-auto-pilot-dialog/set-auto-pilot-dialog.component';

@Component({
  selector: 'app-erp-connection-dialog',
  templateUrl: './erp-connection-dialog.component.html',
  styleUrls: ['./erp-connection-dialog.component.scss']
})
export class ErpConnectionDialogComponent {
  sessionWindow: Window | null | undefined;
  windowCheckInterval: any;
  sessionURI: any;
  embedUrl: SafeUrl | undefined;
  constructor(private dialog: MatDialog, private ngZone: NgZone) { }

  closeDrawer() {
    this.dialog.closeAll();
  }

  ngAfterViewChecked(): void {
    this.handleUrlParameters();
  }

  // temporaryClick() {
  //   var width = 800;
  //   var height = 600;
  //   var left = (screen.width - width) / 2;
  //   var top = (screen.height - height) / 2;
  //   // Open a new window with the desired URL
  //   var url = 'http://localhost:4200/payablesprotect?erp=true';
  //   this.sessionWindow = window.open(url,
  //     "_blank",
  //     "width=" + width + ",height=" + height + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,left=" + left + ",top=" + top
  //   );
  // }

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
            this.onWindowClosed();
          }, 1000);
        }
      }
    });
  }

  onWindowClosed() {
    // Do something when the window is closed
    console.log('The child window was closed!');
    // You can trigger UI updates or logic here
    this.dialog.open(SetAutoPilotDialogComponent, {
      height: 'auto',
      width: '100%',
      maxWidth:'608px',
      panelClass: 'setErp-dialog-container'
    });
  }

  connectErp() {
    // this._connectorService.createPayablesProtectSession().subscribe((data: any) => {
    //   this.sessionURI = data?.sessionUri;
    //   // this._connectorService.setSelectedExposureType(this.selectedExposureType);
    //   this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data?.sessionUri);
    //   // var url = 'http://localhost:4200/payablesprotect?erp=true';
 
    //   var width = 800;
    //   var height = 600;
 
    //   var left = (screen.width - width) / 2;
    //   var top = (screen.height - height) / 2;
 
    //   // to open in new window
    //   this.sessionWindow = window.open(this.sessionURI, '_blank', 'width=' + width + ',height=' + height + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,left=' + left + ',top=' + top);
    // });
    this.handleUrlParameters();
    this.closeDrawer();
    this.onWindowClosed();
  }
}
