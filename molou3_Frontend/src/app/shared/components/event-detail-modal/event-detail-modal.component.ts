import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-event-detail-modal',
  standalone: false,
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.css']
})
export class EventDetailModalComponent {
  @Input() event: any = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteEvent = new EventEmitter<number>(); // Émet l'ID de l'événement à supprimer

  closePigeonModal() {
    this.closeModal.emit();
  }

  onDelete() {
    if (this.event && this.event.id) {
      this.deleteEvent.emit(this.event.id); // Émet l'ID pour suppression
    }
  }
}