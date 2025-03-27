import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
export interface MenuItem {
  icon: string;
  label: string;
  badge?: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [MatExpansionModule],
  templateUrl:'sidebar.component.html',
  styleUrl: 'sidebar.component.scss'
})
export class SidebarComponent {
  @ViewChild('sidebar') sidebar!: ElementRef;
  openSidebar() {
    this.sidebar.nativeElement.classList.add('active');
    document.body.classList.add('overflow-hidden');
  }

  hideSidebar() {
    this.sidebar.nativeElement.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  }
}
