import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
// import { AuthenticationService } from 'src/app/auth/services/authentication.service';
// import { TranslaterService } from 'src/app/services/translater.service';

@Component({
    selector: 'app-language-dropdown',
    templateUrl: './language-dropdown.component.html',
    styleUrls: ['./language-dropdown.component.scss'],
    imports:[CommonModule]
})
export class LanguageDropdownComponent implements OnInit {
    language = localStorage.getItem('lang') || 'en';
    isOpen = false;
  // isNonIsraeliUsers: boolean;

    constructor(
        // private translaterService: TranslaterService,
        // private _authService: AuthenticationService
    ) { }

    ngOnInit(): void {
      // this.isNonIsraeliUsers = this._authService.isNonIsraelUser();
    }

    useLanguage(language: string) {
        // this.translaterService.useLanguage(language);
        // this.language = this.translaterService.getLanguage();
        this.isOpen = false;
    }
    toggleDropdown() {
        this.isOpen = !this.isOpen;
      }
      @HostListener('document:click', ['$event'])
      onClickOutside(event:any) {
        if (!this.isOpen) {
          return;
        }
        const targetElement = event.target as HTMLElement;
        const dropdownElement = document.querySelector('.lang-wrapper') as HTMLElement;
        if (!dropdownElement.contains(targetElement)) {
          this.isOpen = false;
        }
      }
    
  

}
