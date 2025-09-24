import { AbstractControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
// import { environment } from "src/environments/environment";
// import { SubjectService } from "../main-kyc/services/subject.service";
/**
 * Regular expressions
 */
 export const onlyEnglishAndNumbersAndSpaceRgx = /^[a-zA-Z0-9,.\s-\/']+$/;
 export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])[!@#$%^()_[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/;
 export const ALLOWED_SPECIAL_CHARACTERS_REGEX = /[!@#$%^()_\-[\]\{}|;':",.\/<>?]/;// not allowed: &*+`~=
 export const VALID_LINK_REGEX = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const residentRegex = /^[A-Za-z\u0590-\u05FF0-9]{1,100}$/
export const onlyEnglishCharactersRgx = /^[A-Za-z]+$/;
const onlyEnglishAndSpaceRgx = /^[a-zA-Z\s]+$/;

 /**
  * checks whether a given value is a valid id number or not
  */
export const validateID = (id:any) => {
   id = String(id).trim();
   if (id.length > 9 || isNaN(id)) return false;
   id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
   return Array.from(id, Number).reduce((counter, digit, i) => {
     const step = digit * ((i % 2) + 1);
     return counter + (step > 9 ? step - 9 : step);
   }) % 10 === 0;
 }

/**
 * validate that the entered ID number which the user has entered is a valid one
 */
 export const onlyValidIdNumber = (): ValidatorFn => {
    return (control: AbstractControl):any => {

        // if (!environment.production && !SubjectService.idValidation) {
        //     return null;
        // }

        const id = control.value;
        // if the value given is empty string then we return null because these fields are optional
        if (id === "") {
            return null;
        }
        if (String(id).trim().length != 9 || !validateID(id)) {
            return {
                not_valid_id_number: {
                    message: "Valid ID Number Only"
                }
            };
        }
    }
}

/**
 * Custom Validators
 */

 export const passwordRgxPatternValidator = (): ValidatorFn  => {
    return (control: AbstractControl): { [key: string]: {message: string} } | null => {
        // if the value given is empty string then we return null because these fields are optional
        if(control.value===""){
            return null;
        }
        if (!PASSWORD_REGEX.test(control.value)) {
            return {
                passwordSpecialCharaters: {
                    message: "One of the characters entered is invalid.",
                }
            };
        }
        return null;
    }
};
export const customMinValidator = (data:{min:number, errorObjectName: string}): ValidatorFn  => {
    const {min, errorObjectName} = data;
    return (control: AbstractControl): { [key: string]: {message: string, min:number,actual:number} } | null => {
        // if the value given is empty string then we return null because these fields are optional
        if(control.value >= min){
            return null;
        } else {
            return {
                [errorObjectName]: {
                    min,
                    actual: control.value,
                    message: 'Min amount not provided.'
                }
            }
        }
    }
};
export const customNumberMustBeMultipliedByValidator = (multipliedBy:number): ValidatorFn  => {
    return (control: AbstractControl): { [key: string]: {message: string, min:number,actual:number} } | null => {
        // if the value given is empty string then we return null because these fields are optional
        if( +control.value % multipliedBy === 0){
            return null;
        } else {
            return {
                ['mustBeMultipliedBy']: {
                    min: multipliedBy,
                    actual: control.value,
                    message: `Number must be multiplies by ${multipliedBy}`
                }
            }
        }
    }
};

export const valueMustBeEqualOrNotValidator = (data:{valueToCheck:unknown, action:'EQUAL_TO'|'NOT_EQUAL_TO', errorObjectName?: string}): ValidatorFn  => {
    const {valueToCheck, action} = data;
    return (control: AbstractControl): { [key: string]: {message: string, actual:number} } | null => {
        // if the value given is empty string then we return null because these fields are optional
        const toReturnOnInvalid = {
            [data?.errorObjectName ?? 'valueMustBeEqualTo']: {
                actual: control.value,
                message: `value must be ${action}: ${valueToCheck}`
            }
        };

        switch (action) {
            case "EQUAL_TO":
                if ((valueToCheck)) {
                    if (control.value === valueToCheck) {
                        return null;
                    }
                } else if ((valueToCheck)) {
                    if ((valueToCheck as any).includes(control.value)) {
                        return null;
                    }
                }
                break;
            case "NOT_EQUAL_TO":
                if ((valueToCheck)) {
                    if (control.value !== valueToCheck) {
                        return null;
                    }
                } else if ((valueToCheck)) {
                    if (!(valueToCheck as any).includes(control.value)) {
                        return null;
                    }
                }
                break;
            default:
                const exhaust:never = action;
        }

        return toReturnOnInvalid;
    }
};
/**
 * checks if the input value is greater than the amount in users wallet
 * if true we set a custom error {not_enough_in_wallet} in the formcontrol
 * @param inWallet
 * @param currency
 * @param translateService
 * @param numberPipe
 * @param currencySymbolPipe
 * @returns
 */
export const inWalletValidator = (inWallet:number, currency:string, translateService:TranslateService, numberPipe:any, currencySymbolPipe:any): ValidatorFn  => {
    return (control: AbstractControl): { [key: string]: {message: string} } | null => {
        if (+Math.floor(control.value) > Math.floor(inWallet)) {
            return {
                not_enough_in_wallet: {
                    message: `${translateService.instant('FORMS_ERRORS.max_amount_should_be')} ${numberPipe.transform(inWallet ?? 0, '1.0-2')}${currencySymbolPipe.transform(currency)}`,
                }
            };
        }

        return null;
    };
}

export const onlyEnglishAndNumbersAndSpaceValidator = (): any  => {
    return (control: AbstractControl):any => {
        // if the value given is empty string then we return null because these fields are optional
        if(control.value===""){
            return null;
        }
        if (!onlyEnglishAndNumbersAndSpaceRgx.test(control.value)) {
            return {
                not_english_and_numbers_and_space: {
                    message: "Only English letters and numbers are allowed.",
                }
            };
        }
    }
}

// only english letters and numbers and space
export const onlyEnglishAndSpaceValidator = (): ValidatorFn  => {
    return (control: AbstractControl): any => {
        // if the value given is empty string then we return null because these fields are optional
        if(control.value===""){
            return null;
        }
        if (!onlyEnglishAndSpaceRgx.test(control.value)) {
            return {
                not_english_and_numbers_and_space: {
                    message: "Only English letters are allowed.",
                }
            };
        }
    }
}

export const onlyEnglishCharactersValidator = (): any => {
    return (control: AbstractControl): any => {
      if (control.value === "") {
        return null;
      }
      if (!onlyEnglishCharactersRgx.test(control.value)) {
        return {
            only_english_characters: {
            message: "Only English letters are allowed.",
          },
        };
      }
      return null;
    };
};

type ValidationErrors = {
    [key: string]: any;
};

export const pwdConfirming = (data:{key: string, confirmationKey: string}): any  => {
    const {key, confirmationKey} = data;

    return (group: FormGroup): any => {
        const input = group.controls[key];
        const confirmationInput = group.controls[confirmationKey];
        return input.value !== confirmationInput.value ? {passwordNotEquivalent: true} : null
    };
}
export const websitesValidators: ValidatorFn[] = [Validators.minLength(2), Validators.maxLength(100), Validators.pattern(VALID_LINK_REGEX)];
export const phoneValidators: ValidatorFn[] = [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]
export const emailValidators: ValidatorFn[] = [Validators.required, Validators.email];
export const enAndNumbersAndSpaceValidators: ValidatorFn = Validators.pattern(onlyEnglishAndNumbersAndSpaceRgx);
export const onlyNumbersValidators: ValidatorFn = Validators.pattern(/^[0-9]*$/);
export function strictEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(control.value) ? null : { invalidEmail: true };
    };
  }