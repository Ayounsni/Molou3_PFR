import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',

  templateUrl: './delete-confirmation-modal.component.html',
  imports: [CommonModule],
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  @Input() showModal: boolean = false; // Contrôle l'affichage du modal
  @Input() title: string = ''; // Titre personnalisé
  @Input() message: string = ''; // Message personnalisé
  @Input() confirmButtonText: string = ''; // Texte du bouton de confirmation
  @Input() cancelButtonText: string = ''; // Texte du bouton d'annulation

  @Output() closeModal = new EventEmitter<void>(); // Événement pour fermer le modal
  @Output() confirmDelete = new EventEmitter<void>(); // Événement pour confirmer la suppression

  close() {
    this.closeModal.emit();
  }

  confirm() {
    this.confirmDelete.emit();
  }
}