import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatOptionModule,CommonModule,FormsModule],
  templateUrl:'./dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() options: { flag: string; label: string; description: string; value: string }[] = [];
  @Input() selectedValue: string = '';
  @Input() disabled: boolean = false;
  searchQuery: string = '';
  getSelectedOption() {
    return this.options.find(option => option.value === this.selectedValue);
  }
  get filteredOptions() {
    return this.options.filter(option =>
      option.label.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  clearSearch(){
    this.searchQuery = "";
  }
}
