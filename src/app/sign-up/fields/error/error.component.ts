import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';
import { MatError } from '@angular/material/select';

@Component({
  selector: 'app-error',
  imports: [CommonModule, MatError],
  providers: [DecimalPipe],
  template: `
    <ng-container [ngSwitch]="HTMLType">
      <ng-container *ngSwitchCase="'REGULAR'">
        <small class="text-danger" *ngFor="let errorMessage of listErrors(); let last=last;">
          {{ last ? errorMessage : '' }}
        </small>
      </ng-container>
      <ng-container *ngSwitchCase="'MATERIAL'">
        <mat-error *ngFor="let errorMessage of listErrors(); let last=last;">
          {{ last ? errorMessage : '' }}
        </mat-error>
      </ng-container>
    </ng-container>
  `,
  styles: []
})
export class ErrorComponent {

  constructor(private _numberPipe: DecimalPipe) {}

  errorMsgList: any = [];
  private _default: 'default' = 'default';

  @Input() controlName!: AbstractControl | AbstractControlDirective;
  @Input('HTMLType') HTMLType: 'REGULAR' | 'MATERIAL' = 'REGULAR';
  @Input('currency') currency!: { min: string, max: string };

  errorMessage: any = {
    [this._default]: (params: any) => 'Invalid format',
    'required': (params: any) => 'Field is required',
    'maxlength': (params: any) => `Maximum ${params.requiredLength} characters allowed`,
    'minlength': (params: any) => `Minimum ${params.requiredLength} characters required`,
    'pattern': (params: any) => 'Invalid format',
    'whitespace': (params: any) => 'White space not allowed',
    'email': (params: any) => 'Email not valid',
    'matDatepickerMin': (params: { actual: Date, min: Date }) => 'Future date required',
    'api_error': (params: any) => 'Error',
    'not_enough_in_wallet': (params: any) => params.message,
    'passwordNotEquivalent': (params: any) => 'Passwords do not match',
    'countryNotFound': (params: any) => 'Country not found',
    'not_english_and_numbers_and_space': (params: any) => 'Only English, numbers, and spaces are allowed',
    'only_english_characters': () => 'Only English letters are allowed.',
    'not_valid_id_number': (params: any) => 'Invalid ID number',
    'not_supported_country': (params: any) => params.message,
    'passwordSpecialCharaters': (params: any) => 'Password must contain special characters',
  };


  listErrors() {
    if (!this.controlName) return [];
    if (this.controlName.errors) {
      this.errorMsgList = [];
      Object.keys(this.controlName.errors).map(error => {
        if (!Object.keys(this.errorMessage).includes(error)) {
          console.warn(`${error} not found in the errorMessage object of the ErrorComponent.\nSetting error to default.`);
          error = this._default;
        }
        (this.controlName.touched || this.controlName.dirty) ?
          this.errorMsgList.push(
            this.errorMessage[error](this.controlName.errors?.[error])
          ) : '';
      });
      return this.errorMsgList;
    } else {
      return [];
    }
  }
}