import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  templateUrl: 'card-list.component.html',
  styleUrls: ['card-list.component.scss'],
  imports: [CardComponent,CommonModule],
})
export class CardListComponent {
  @Input() cards: any[] = [];
}
