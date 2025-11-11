import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {
  private openEditCashflowRulesObs = new BehaviorSubject<boolean | null>(null);
  openEditCashflowRulesDrawer = this.openEditCashflowRulesObs.asObservable();

  private openInfoERPObs = new BehaviorSubject<boolean>(false);
  openInfoERPDrawer = this.openInfoERPObs.asObservable();

  private setSelectedERP = new BehaviorSubject<string>('');
  getSelectedERP = this.setSelectedERP.asObservable()

  
  erpCustomerSuppliersListSubject = new BehaviorSubject<any[]>([]);
  erpCustomerSuppliersList$ = this.erpCustomerSuppliersListSubject.asObservable();

  private selectedExposureTypeSubject = new BehaviorSubject<string | null>(null);
  selectedExposureType$ = this.selectedExposureTypeSubject.asObservable();

  private approvedListSubject = new BehaviorSubject<any[]>([]);
  approvedList$ = this.approvedListSubject.asObservable();
  
  private ruleResponseSubject = new BehaviorSubject<any>(null);
  public ruleResponse$ = this.ruleResponseSubject.asObservable();

  private setHedgingResponse = new BehaviorSubject<any>(null);
  public getHedgingResponse$ = this.setHedgingResponse.asObservable();

  private fromConnectorSource = new BehaviorSubject<boolean>(false);
  fromConnector$ = this.fromConnectorSource.asObservable();

  private fromAutoPilotSource = new BehaviorSubject<boolean>(false);
  fromAutoPilot$ = this.fromAutoPilotSource.asObservable();

  private fromCashflowAPIButtonSubject = new BehaviorSubject<boolean>(false);
  fromCashflowAPIButton$ = this.fromCashflowAPIButtonSubject.asObservable();

  private setCollateralAmountFromMissingFunds = new BehaviorSubject<number | null>(null);
  getCollateralAmountFromMissingFunds$ = this.setCollateralAmountFromMissingFunds.asObservable();
  // store the selected auto pilot
  private selectedAutoPilotSubject = new BehaviorSubject<string | null>(null);
  selectedAutoPilot$ = this.selectedAutoPilotSubject.asObservable();

  private goToConnectorStepSource = new BehaviorSubject<number | null>(null);
  goToConnectorStep$ = this.goToConnectorStepSource.asObservable();

  private readonly summaryDataFromAPISubject = new BehaviorSubject<string | null>(null);
  summaryDataFromAPISubject$ = this.summaryDataFromAPISubject.asObservable();

  // store the role summary data
  private readonly roleSummaryData = new BehaviorSubject<string | null>(null);
  roleSummaryData$ = this.roleSummaryData.asObservable();
  
  // store the current conversion rule id
  private readonly getCurrentRuleIdSubject = new BehaviorSubject<string | null>(null);
  getCurrentRuleIdSubject$ = this.getCurrentRuleIdSubject.asObservable();

  selectedTabIndexSubject = new BehaviorSubject<number>(0);
  selectedTabIndex$ = this.selectedTabIndexSubject.asObservable();

  constructor() { }

  selectedERPFromFirstStep(data: string) {
    this.setSelectedERP.next(data);
  }


  openEditCashflowRules(isOpen: boolean) {
    this.openEditCashflowRulesObs.next(isOpen);
  }

  openERPInfo(isOpen: boolean) {
    this.openInfoERPObs.next(isOpen);
  }

  
  setSelectedExposureType(value: string): void {
    this.selectedExposureTypeSubject.next(value);
  }

  getSelectedExposureType(): string | null {
    return this.selectedExposureTypeSubject.getValue();
  }

  passCollateraltoAddMoney(data: number) {
    this.setCollateralAmountFromMissingFunds.next(data);
  }
  // set the selected auto pilot
  setSelectedAutoPilot(value: string): void {
    this.selectedAutoPilotSubject.next(value);
  }

  // set summary data from API
  setSummaryDataFromAPI(value: string): void {
    this.summaryDataFromAPISubject.next(value);
  }

  navigateToConnectorStep(index: number) {
    this.goToConnectorStepSource.next(index);
  }

  // set the role summary data
  setRoleSummaryData(value: string): void {
    this.roleSummaryData.next(value);
  }
  // set the current conversion rule id
  setCurrentRuleIdSubject(data: string) {
    this.getCurrentRuleIdSubject.next(data);
  }


  setFromConnector(value: boolean) {
    this.fromConnectorSource.next(value);
  }

  consumeFromConnector(): boolean {
    const current = this.fromConnectorSource.getValue();
    this.fromConnectorSource.next(false);
    return current;
  }

  setFromAutoPilot(value: boolean) { 
    this.fromAutoPilotSource.next(value);
  }

  consumeFromAutoPilot(): boolean {
    const current = this.fromAutoPilotSource.getValue();
    this.fromAutoPilotSource.next(false);
    return current;
  }


  setApprovedList(result:any){
    this.approvedListSubject.next(result);
  }
  updateRuleResponse(data: any) {
    this.ruleResponseSubject.next(data);
  }

  setHedgingInfo(result:any){
    this.setHedgingResponse.next(result);
  }
  setCashflowRedirectHandler(result: boolean) {
    this.fromCashflowAPIButtonSubject.next(result);
  }
}
