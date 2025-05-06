import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, skipWhile, takeUntil, switchMap } from 'rxjs';
import { countryData } from '../country-data';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KycService } from '../../services/kyc.service';
import { ErrorComponent } from "../error/error.component";

@Component({
  selector: 'app-select-country',
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, ErrorComponent, ErrorComponent],
  templateUrl: './select-country.component.html',
  styleUrl: './select-country.component.scss'
})
export class SelectCountryComponent implements OnInit {
  componentDestroyed = new Subject<any>();
  countryArr!: any[];
  @Input("kycForm") kycForm!: FormGroup;
  @Input('disabled') disabled: boolean = false;
  @Input("currentFormGroup") currentFormGroup!: FormGroup;
  @Input("currentformControlName") currentformControlName!: string;
  @Input("matLabelTranslation") matLabelTranslation!: string;
  @Input("handlerOnBlur") handlerOnBlur?: () => void;
  @Input("specialClasses") specialClasses!: string;
  @Input("formFieldType") formFieldType: 'DEFAULT' | 'CUSTOM-FORM-FIELD' = 'DEFAULT';

  constructor( private kycS: KycService
  ) {
  }

  ngOnInit(): void {
      this.kycS.allCountries$
          .pipe(
              skipWhile(countries => !Array.isArray(countries)),
              takeUntil(this.componentDestroyed)
          )
          .subscribe(countries => {
              this.countryArr = countries;
        });

      this.countryArr = countryData

      this.kycS.handleResetCountries$
          .pipe(
              switchMap(() => this.kycS.allCountries$)
          )
          .subscribe(allCountries => {
              this.countryArr = allCountries;
              this.currentFormGroup.get(this.currentformControlName)!.setValue('');
          });
      console.log(this.disabled);
      this.setDisabled();
  };//#ngOnInit

  handleCountryNameSearch(e: Event) {
      this.countryArr = this.kycS.handleCountrySearch({event: e, action: 'NAME'})
  }

  trimLabel(label:any) {
     const newLabel = label.replace(/\s+/g, '');;
     return newLabel
  }


  handleCountryNameSearchBlur(data: { event: Event, parentFormGroup: FormGroup, controlName: string }) {
      const {event, parentFormGroup, controlName} = data;

      if (!parentFormGroup) {
          console.error(`you must provide a parentFormGroup, \n given ${parentFormGroup}`);
          return;
      }
      if (!controlName) {
          console.error(`you must provide a controlName, \n given ${controlName}`);
          return;
      }
      if (!parentFormGroup.get(controlName)) {
          console.error(`the control name (${controlName}) from parent form group is falsy`);
          return;
      }
      let countrySearched = parentFormGroup.get(controlName)?.value?.toLowerCase();
      let foundCountry = countryData.find(c => c.countryName.toLowerCase() === countrySearched || c.countryName.toLowerCase().includes(countrySearched));

      if (!foundCountry) {
          parentFormGroup.get(controlName)!.setValue('');
          parentFormGroup.get(controlName)!.setErrors({ countryNotFound: true });
          parentFormGroup.get(controlName)!.updateValueAndValidity();
          this.countryArr = this.kycS.allCountries$.getValue();
      } else {
          parentFormGroup.get('countryCode')!.setValue(foundCountry.countryCode);
      }
      if (this.handlerOnBlur) {
          this.handlerOnBlur();
      }
  }

  setDisabled() {
      if (this.disabled) {
          this.currentFormGroup.controls[this.currentformControlName].disable();
      }
  }

  restrictSpecialCharacters(event: any) {
      if (event?.target?.value?.length === 0 && (event?.key === "0" || event?.key === ".")) {
        event?.preventDefault();
      }
      else {
        if (event?.key == "." && event?.target?.value.includes(".")) {
          event?.preventDefault();
        }
        const allowedKeys = /^[a-zA-Z0-9.]$/;
        if (!allowedKeys.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
          event.preventDefault();
        }
      }
    }

  ngOnDestroy() {
      this.componentDestroyed.next(null);
      this.componentDestroyed.complete();
  };
}
