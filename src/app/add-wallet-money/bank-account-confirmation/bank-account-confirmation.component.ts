import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../main-dashboard/services/dashboard.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-bank-account-confirmation',
  templateUrl: './bank-account-confirmation.component.html',
  styleUrls: ['./bank-account-confirmation.component.scss'],
  imports:[DatePipe,CommonModule]
})
export class BankAccountConfirmationComponent implements OnInit{
  elRef: ElementRef;
  currentLang!: string | null;
  @Input('ccBankAccountDetails') ccBankAccountDetails: any;
  @Input('currency') currency: any;
  today = new  Date();
  
  constructor(
    private _dashboardService: DashboardService,
    elRef: ElementRef
  ) {
    this.elRef = elRef;
  }
  ngOnInit() {
    this.currentLang = localStorage.getItem('lang');
  }


  downloadPdf() {
    const htmlContent = this.elRef.nativeElement.innerHTML;
    const cleanedHTML = this.removeAngularAttributes(htmlContent);
    // this._dashboardService.bankAccountDetailsHtmlToPdf(cleanedHTML, this.currency);
  }

  private removeAngularAttributes(content: string): string {
    content = content.replace(/(_ngcontent-)[a-zA-Z0-9-]*=""/g, '');
    content = content.replaceAll('"', "'");
    const headIndex = content.indexOf('</head>');
    if (headIndex !== -1) {
      content = content.slice(0, headIndex) + this.getPDFStyle() + content.slice(headIndex);
    }
    content = content.replace(/\n/g, '');
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    return content;
  }

  getFormattedValue(value: string) {
    if (value === 'Bic Swift') {
      return value = 'SWIFT Code';
    }
    return value;
  }

  private getPDFStyle() {
    return `<style type='text/css'>
      html, body {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        box-sizing: content-box;
        font-family: "Heebo", sans-serif;
        background-color: #FAFBFF;
        overflow: hidden;
        max-width: 650px;
        margin-left: auto;
        margin-right: auto;
      }
      body.rtl {
        direction: rtl;
      }
      h1, h2, h3, h4, h5, h6, p {
        margin: 0;
      }
      .account-pdf-wrap{
        max-width: 528px
        width: 100%;
      }
      .account-pdf-wrap .pdf-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        padding-top: 41px;
        padding-bottom: 23px;
        border-bottom: 1px dashed #9CA3AF;
      }
      .account-pdf-wrap .pdf-header svg{
        width: 136px;
      }
      .account-pdf-wrap .pdf-header .pdf-date{
        color: #000;
        font-family: "Heebo", sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
      .account-pdf-wrap .pdf-body{
        font-family: "Heebo", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        height: calc(100vh - 250px);
      }
      .account-pdf-wrap .pdf-body .priority-title {
        font-family: "Heebo", sans-serif;
        font-size: 13px;
        font-weight: 600;
        line-height: 30px;
      }
      .account-pdf-wrap .pdf-body .pdf-bolde-text{
        color: #000;
        font-family: "Heebo", sans-serif;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        display: inline-block;
      }
      .account-pdf-wrap .pdf-body .pdf-bolde-text.border-bottom{
        border-bottom: 1px solid #000;
      }
      .account-pdf-wrap .pdf-body .pdf-bolde-text.pdf-mb{
        margin-bottom: 21px;
      }
      .account-pdf-wrap .pdf-body .pdf-bolde-text span{
        display: block;
      }
      .account-pdf-wrap .pdf-body .text-light {
        color: #656565;
        margin-bottom: 40px;
      }
      .account-pdf-wrap .pdf-body .text-dark{
        color: #000;
        margin-bottom: 28px;
      }
      .account-pdf-wrap .pdf-body .pdf-table{
        border: 1px solid #AFAFAF;
        margin-bottom: 41px;
        width: 100%;
        border-collapse: collapse;
        min-width: 482px;
      }
      .account-pdf-wrap .pdf-body .pdf-table thead tr th{
        padding: 7px 12px;
        background-color: #afafaf1a;
        border-top: none;
        border-right: 1px solid #AFAFAF;
        text-align: left;
        white-space: nowrap;

        color: #1F2937;
        font-family: "Heebo", sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
      .account-pdf-wrap .pdf-body .pdf-table thead tr th:last-child{
        border-right: none;
      }
      .account-pdf-wrap .pdf-body .pdf-table tbody tr td{
        padding: 12px;
        border-right: 1px solid #AFAFAF;
        text-align: left;

        color: #000;
        font-family: "Heebo", sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 14px;
      }
      .account-pdf-wrap .pdf-body .pdf-table tbody tr td:last-child{
        border-right: none;
      }
      .account-pdf-wrap .pdf-bottom-footer{
        padding-top: 20px;
        padding-bottom: 45px;
        border-top: 1px dashed #9CA3AF;
        text-align: center;
      }
      .account-pdf-wrap .pdf-bottom-footer p{
        color: #6B7280;
        font-family: "Heebo", sans-serif;
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        max-width: 550px;
        margin-left: auto;
        margin-right: auto;
      }
      .pdf-body {
        padding: 35px 47px 16px 57px;
        position: relative;
      }
      .pdf-footer::before {
        content: "";
        position: absolute;
        background-color: #2947F2;
        height: 15px;
        width: auto;
        left: 0;
        right: 0;
        bottom: -10px;
      }
      .statement-heading {
        text-transform: uppercase;
        font-size: 22px;
        font-weight: 800;
        line-height: normal;
        color: #000;
        margin-bottom: 23px;
      }
      .user-details {
        font-size: 16px;
        line-height: normal;
        font-weight: 300;
        color: #6C6C6C;
        margin-bottom: 11px;
      }
      .user-details .font-bold {
        font-weight: 700;
        color: #030303;
      }
      .option-label {
        font-size: 13px;
        line-height: normal;
        font-weight: 600;
        color: #A1A1A1;
        margin-bottom: 7px;
      }
      .selected-options {
        margin-bottom: 18px;
        min-height: 489px
      }
      .option-1 {
        margin-bottom: 21px;
      }
      .option-2 {
        margin-bottom: 0px;
      }
      .option {
        font-size: 12px;
        line-height: normal;
        font-weight: 700;
        color: #2947F2;
        padding: 12px 20px;
        border: 1px solid #E7EBFD;
        background-color: #fff;
      }
      .option-details {
        padding: 15px 22px;
        border: 1px solid #E7EBFD;
        border-top: 0;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        background-color: #fff;
      }
      .option-details .column-1 {
        width: calc(53% - 18px);
        padding-right: 36px;
      }
      .option-details .column-2 {
        width: calc(47% - 18px);
      }
      .form-group {
        margin-bottom: 17px;
        font-size: 12px;
        line-height: normal;
        font-weight: 400;
        color: #7E8088;
      }
      .form-group label {
        display: block;
        margin-bottom: 3px;
      }
      .form-group .text {
        font-weight: 700;
        color: #01031C;
      }
      .form-group.address {
        margin-bottom: 0;
      }
      .undertake-wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }
      .undertake-wrapper .checkbox {
        height: 20px;
        width: 20px;
      }
      .undertake-wrapper .checkbox svg {
        height: 100%;
        width: auto;
      }
      .undertake-text {
        margin-left: 15px;
        font-size: 10px;
        line-height: normal;
        font-weight: 400;
        color: #888;
      }
      .undertake-text .content {
        margin-bottom: 4px;
      }
      .undertake-text .content:last-child {
        margin-bottom: 0;
      }
      .pdf-footer {
        margin-top: 26px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: normal;
        font-weight: 700;
        color: #1D1D22;
      }
      .signature-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .signature-wrapper .signature-label {
        margin-right: 13px;
      }
      .signature-wrapper .signature {
        width: 113px;
        height: 41px;
        position: relative;
      }
      .signature-wrapper .signature img {
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: -7px;
      }
      .mb-0 {
        margin-bottom: 0;
      }
      .rtl .pdf-body {
        padding: 35px 57px 16px 47px;
      }
      .rtl .pdf-header {
        margin-left: 0px;
        margin-right: 28px;
      }
      .rtl .option-details .column-1 {
        padding-right: 0px;
        padding-left: 36px;
      }
      .rtl .undertake-text {
        margin-left: 0px;
        margin-right: 15px
      }
      .rtl .signature-wrapper .signature-label {
        margin-right: 0px;
        margin-left: 13px;
      }
    </style>`;
  }
}
