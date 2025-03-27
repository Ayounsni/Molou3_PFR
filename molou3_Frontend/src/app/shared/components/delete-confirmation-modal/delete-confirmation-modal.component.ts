import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',

  templateUrl: './delete-confirmation-modal.component.html',
  imports: [CommonModule],
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  @Input() showModal: boolean = false; 
  @Input() title: string = ''; 
  @Input() message: string = ''; 
  @Input() confirmButtonText: string = '';
  @Input() cancelButtonText: string = ''; 

  @Output() closeModal = new EventEmitter<void>(); 
  @Output() confirmDelete = new EventEmitter<void>(); 

  close() {
    this.closeModal.emit();
  }

  confirm() {
    this.confirmDelete.emit();
  }
}