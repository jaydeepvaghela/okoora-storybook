import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-initial-render',
  templateUrl: './initial-render.component.html',
  styleUrls: ['./initial-render.component.scss'],
})
export class InitialRenderComponent {

  @Output() addMoreRecipientsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading: boolean = true;
  constructor() {

  }
  addMore() {
    this.addMoreRecipientsChanged.emit(true);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }
}
