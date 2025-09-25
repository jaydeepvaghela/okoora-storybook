import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FxErpStepperComponent } from '../../../fx-erp-connection/components/fx-erp-stepper/fx-erp-stepper.component';

@Component({
  selector: 'app-set-auto-pilot-dialog',
  templateUrl: './set-auto-pilot-dialog.component.html',
  styleUrls: ['./set-auto-pilot-dialog.component.scss'],
  imports: [MatDialogModule],
})
export class SetAutoPilotDialogComponent {
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.setUpdatedClientProfile();
  }

  setUpdatedClientProfile() {
    // this._authenticateService.getUserProfile().subscribe((data: any) => {
    //   localStorage.setItem('user', JSON.stringify(data));
    // });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  setAutoPilot() {
    this.closeModal();
    this.dialog.open(FxErpStepperComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '1627px',
      maxHeight: '966px',
      panelClass: 'fx-erp-dialog',
      disableClose: true,
    });
  }
}
