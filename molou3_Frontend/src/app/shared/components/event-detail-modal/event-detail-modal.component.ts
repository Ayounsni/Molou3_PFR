import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-event-detail-modal',
  standalone:false,
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.css']
})
export class EventDetailModalComponent {
  @Input() event: any;
  @Output() closeModal = new EventEmitter<void>();

  closePigeonModal() {
    this.closeModal.emit();
  }
}