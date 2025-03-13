import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;   // Page actuelle
  @Input() totalPages: number = 0;    // Nombre total de pages
  @Input() isLastPage: boolean = false; // Indique si c'est la dernière page
  @Output() pageChange = new EventEmitter<number>(); // Événement émis lors du changement de page

  // Génère un tableau avec les numéros de pages
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Passe à la page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  // Passe à la page suivante
  nextPage(): void {
    if (!this.isLastPage && this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  // Définit une page spécifique
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}