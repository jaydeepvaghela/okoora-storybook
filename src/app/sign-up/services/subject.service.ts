import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private static _idValidation = true;

    constructor() {
    }

    static get idValidation() {
        return this._idValidation;
    }

    set idValidation(value: boolean) {
        SubjectService._idValidation = value;
    }
}
