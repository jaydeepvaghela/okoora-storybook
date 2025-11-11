import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[appDisallowInputByRegex]'
})
export class DisallowInputByRegexDirective {
    @Input('appDisallowInputByRegex') regex: RegExp;

    constructor() {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const {key} = event;
        const keyIsAllowed: boolean = this.regex.test(key);
        if (!keyIsAllowed) {
            event.preventDefault();
        }
    }

}
