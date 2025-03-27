import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  imports: [CommonModule], 
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() imageSrc: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() description: string = '';
  @Input() backgroundColor: string = '#ffffff'; 
  @Input() titleColor: string = '#000000'; 
  @Input() subtitleColor: string = '#000000'; 
  @Input() descColor: string = '#000000'; 
  @Input() hoverColor: string = '#f0f0f0';
  @Input() fullWidth: boolean = false;
  @Input() isLiked: boolean = false;
  @Input() isSaved: boolean = false; 
  @Output() liked: EventEmitter<void> = new EventEmitter();
  @Output() saved: EventEmitter<void> = new EventEmitter();
  @Output() paid: EventEmitter<number> = new EventEmitter();
  counter: number = 0;
  hover: boolean = false;
  activeTab: string = 'description';
  toggleLike() {
    this.isLiked = !this.isLiked;
    this.liked.emit();
  }

  toggleSave() {
    this.isSaved = !this.isSaved;
    this.saved.emit();
  }

  pay() {
    if (confirm('Are you sure you want to pay?')) {
      this.counter++;
      this.paid.emit(this.counter);
    }
  }
  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
