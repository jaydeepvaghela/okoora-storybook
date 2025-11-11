import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-cf-endpoint-doc',
  templateUrl: './cf-endpoint-doc.component.html',
  styleUrls: ['./cf-endpoint-doc.component.scss'],
  imports: [CommonModule, MatSelectModule, TranslateModule]
})
export class CfEndpointDocComponent implements OnInit {
  showClientsId: boolean | undefined;
  showClientSecret: boolean | undefined;
  _onDestroy = new Subject<void>();
  clientsId = 'Wltcy9uYW1laW';
  clientSecret = 'Y2FsaG9zdDo0';
  @ViewChild('cashflowDocSection') cashflowDocSection!: ElementRef;
  @ViewChild('authenticationDocSection') authenticationDocSection!: ElementRef;
  @Input() fromAutoPilotCashflowComplete: boolean | undefined;
  
  constructor(private matStepper: MatStepper) { }

  ngOnInit() {
    this.showClientsId = false;
    this.showClientSecret = false;
    // Fetch ClientId and ClientSecret from the service
    // this.authService.GetClientId().pipe(takeUntil(this._onDestroy)).subscribe({
    //   next: (res: any) => { 
        this.clientsId = "f382d1a797204fffbf6560a6d4a6b98f";
    //   },
    //   error: (err: any) => {
    //   },
    // });
    // this.authService.GetClientSecret().pipe(takeUntil(this._onDestroy)).subscribe({
    //   next: (res: any) => {  
        this.clientSecret = "8391da2e1e274dde9199d3ec131ca488";
    //   },
    //   error: (err) => {
    //   },
    // });
  }
  focusOnAuthSection() {
    this.scrollToSection(this.authenticationDocSection);
  }

  redirectToExposure() {
    this.matStepper.previous();
  }

  focusOnCashflowSection() {
    this.scrollToSection(this.cashflowDocSection);
  }

  scrollToSection(sectionElement: ElementRef): void {
    const header1Height = document.getElementById('navbar-id')?.clientHeight || 0;
    let beforeElementHeight = 0;
    const totalHeadersHeight = header1Height + beforeElementHeight;
    const sectionTop = sectionElement?.nativeElement.getBoundingClientRect().top + window.scrollY || 0;

    const offset = totalHeadersHeight;

    const scrollableElement = this.findScrollableAncestor(sectionElement?.nativeElement);
    if (scrollableElement) {
      const scrollableElementTop = scrollableElement.getBoundingClientRect().top + window.scrollY || 0;
      const scrollDistance = sectionTop - scrollableElementTop - offset;

      const minScrollDistance = 20;
      if (scrollDistance > minScrollDistance) {
        scrollableElement.scroll({
          top: scrollableElement.scrollTop + scrollDistance,
          behavior: 'smooth'
        });
      }
    }
  }

  findScrollableAncestor(element: HTMLElement): HTMLElement | null {
    let currentElement = element.parentElement;

    while (currentElement) {
      const overflowY = window.getComputedStyle(currentElement).overflowY;
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll';

      if (isScrollable && currentElement.clientHeight < currentElement.scrollHeight) {
        return currentElement;
      }

      currentElement = currentElement.parentElement;
    }

    return null;
  }


  redirectBack() {
    this.matStepper.previous();
  }

  get maskedClientsId(): string {
    return '*'.repeat(this.clientsId.length);
  }

  get maskedClientSecret(): string {
    return '*'.repeat(this.clientSecret.length);
  }
  copyContent(id: string) {
    let text = "";
    switch (id) {
      case "clientId":
        text = document.getElementById("clientId")?.innerText || "";
        break;
      case "clientSecret":
        text = document.getElementById("clientSecret")?.innerText || "";
        break;
      case "authCode":
        text = document.getElementById("authCode")?.innerText || "";
        break;
      case "authResponse":
        text = document.getElementById("authResponse")?.innerText || "";
        break;
      case "cashCode":
        text = document.getElementById("cashCode")?.innerText || "";
        break;
      case "cashResponse":
        text = document.getElementById("cashResponse")?.innerText || "";
        break;
      default:
        return;
    }
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("Copied: " + text);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  }
}
