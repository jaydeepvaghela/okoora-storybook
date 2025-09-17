import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*]*$/;

  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value || !passwordPattern.test(value)) {
      return { 'invalidPassword': true };
    }
    return null;
  };
}
