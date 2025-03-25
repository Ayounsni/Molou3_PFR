import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Association } from '../../../shared/models/association.model';
import { PageDTO } from '../../../shared/models/dtos/page.model';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-gestion-association',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PaginationComponent],
  templateUrl: './gestion-association.component.html',
  styleUrls: ['./gestion-association.component.css']
})
export class GestionAssociationComponent implements OnInit {
  bg = 'assets/bg89.jpg';
  associations: Association[] = [];
  currentPage: number = 1; // Commencer à 1 comme dans PigeonAllComponent
  pageSize: number = 5;    // Taille de page initiale
  totalPages: number = 0;
  totalElements: number = 0;
  isLastPage: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAssociations();
  }

  loadAssociations(): void {
    this.authService.getAllAssociationsPaginated(this.currentPage - 1, this.pageSize).subscribe({
      next: (pageData: PageDTO<Association>) => {
        this.associations = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1; // Ajuster pour commencer à 1

        // Si aucune association et page > 1, revenir à la page précédente
        if (this.associations.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadAssociations();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des associations:', err);
        this.errorMessage = 'Impossible de charger les associations.';
      }
    });
  }

  toggleAssociationStatus(association: Association): void {
    const updateDTO = {
      enabled: !association.enabled
    };

    this.authService.updateAssociation(association.id, updateDTO).subscribe({
      next: (response) => {
        console.log('Mise à jour réussie:', response);
        association.enabled = !association.enabled; // Mise à jour locale après succès
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        if (err.error) {
          console.error('Détails de l\'erreur:', err.error);
        }
        this.errorMessage = 'Erreur lors de la mise à jour du statut.';
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAssociations();
  }
}