// pigeon-detail-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pigeon } from '../../models/pigeon.model';

@Component({
  selector: 'app-pigeon-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pigeon-detail-modal.component.html',
  styleUrls: ['./pigeon-detail-modal.component.css']
})
export class PigeonDetailModalComponent {
  @Input() showModal: boolean = false; // Contrôle la visibilité du modal
  @Input() pigeon: Pigeon | null = null; // Le pigeon à afficher
  @Input() defaultImage: string = 'assets/pardefaut.webp'; // Image par défaut
  @Output() closeModal = new EventEmitter<void>(); // Événement pour fermer le modal

  close(): void {
    this.closeModal.emit();
  }
}