import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConnectorService } from '../../connector.service';
import { MissingFundsData } from '../../models/missingFundsData';
import { log } from 'console';
import { CommonService } from '../../../common/services/common.service';

@Component({
  selector: 'app-connector-missing-component',
  templateUrl: './connector-missing-component.component.html',
  styleUrls: ['./connector-missing-component.component.scss']
})
export class ConnectorMissingComponentComponent {
  missingFundsData: any
  isPayableProtectFilled: any;

  constructor(public commonService: CommonService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _connectorService: ConnectorService) {

  }

  ngOnInit() {
    this.missingFundsData = this.data;
    const user = JSON.parse(localStorage.getItem('user')!);
    this.isPayableProtectFilled = user['isPayableProtectFilled'];
  }

  addMoney() {
    this.dialog.closeAll();
    if(!this.isPayableProtectFilled){
      this._connectorService.setFromConnector(true);
    }
    this._connectorService.passCollateraltoAddMoney(this.missingFundsData?.missingCollateralAmount);
    this.commonService.triggerHeaderMethod();
  }
}
