import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { QuickHedgeDrawerComponent } from '../dashboard/components/quick-hedge-drawer/quick-hedge-drawer.component';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,MatMenuModule, QuickHedgeDrawerComponent, MatDrawer, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() openSidebar = new EventEmitter();
  showDlg: boolean = false;
  
  openMenu() {
    this.openSidebar.emit();
  }
}
