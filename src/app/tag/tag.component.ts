import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [CommonModule],
  templateUrl:'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent {
  @Input() label: string = 'Label';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() state: 'inactive' | 'active' | 'removable' | 'deactivated' = 'inactive';
  @Input() removable: boolean = false;

  onClick() {
    if (this.state === 'deactivated') {
      return;
    }
    console.log('Tag clicked:', this.label);
  }

  removeTag(event: Event) {
    event.stopPropagation();
    console.log('Tag removed:', this.label);
  }
}
