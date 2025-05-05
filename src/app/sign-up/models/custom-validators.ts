import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

// export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])[!@#$%^()_[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/;
export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])[!@#$%^&*()\[\]{}\\\-_+={}|\\:;'",<>,.?/~`a-zA-Z0-9-]+$/;

// export const ALLOWED_SPECIAL_CHARACTERS_REGEX = /[!@#$%^()_\-[\]\{}|;':",.\/<>?]/;
export const ALLOWED_SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()\[\]{}\\\-_+={}|\\:;'",<>,.?/~`]/;
// not allowed: &*+`~=

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
}
export const validateID = (id:any) => {
    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
    return Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
  }

