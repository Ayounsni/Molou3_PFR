import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { ProgrammeEdition } from '../../../shared/models/programme-edition.model';
import { User } from '../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { ProgrammeEditionService } from '../../../core/services/programme-edition.service';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { EditionFormComponent } from '../../../shared/components/forms/programme/edition-form/edition-form.component';
import { DeleteConfirmationModalComponent } from "../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-edition',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    NotificationComponent,
    EditionFormComponent,
    DeleteConfirmationModalComponent,
    PaginationComponent 
  ],
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {
  bg = 'assets/bg5.png';
  showEditionModal = false;
  editions: ProgrammeEdition[] = [];
  currentUser: User | null = null;
  currentEdition: ProgrammeEdition | null = null;
  showDeleteConfirmation = false;
  editionToDeleteId: number | null = null;
  errorMessage: string | null = null;
  currentPage = 1;
  pageSize = 6;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;

  constructor(
    private programmeEditionService: ProgrammeEditionService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      console.log('Current User:', user);
      this.currentUser = user;
      if (this.currentUser) {
        this.loadEditions();
      }
    });
  }

  loadEditions(): void {
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté');
      return;
    }
    this.programmeEditionService.getAllProgrammeEditions(this.currentPage - 1, this.pageSize, this.currentUser.id).subscribe({
      next: (pageData) => {
        console.log('Données paginées du backend:', pageData);
        this.editions = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.pageSize = pageData.pageSize;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1;

        if (this.editions.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadEditions();
        }
        console.log('Éditions chargées:', this.editions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des éditions:', error);
        this.errorMessage = 'Erreur lors du chargement des éditions';
        this.notificationService.showNotification(this.errorMessage, 'error');
      }
    });
  }

  openEditionModal(edition?: ProgrammeEdition): void {
    this.showEditionModal = true;
    this.currentEdition = edition || null;
    this.errorMessage = null;
  }

  closeEditionModal(): void {
    this.showEditionModal = false;
    this.currentEdition = null;
  }

  handleEditionSaved(edition: ProgrammeEdition): void {
    if (this.currentEdition) {
      const index = this.editions.findIndex(e => e.id === edition.id);
      if (index !== -1) {
        this.editions[index] = edition;
      }
    } else {
      this.editions.push(edition);
    }
    this.editions = [...this.editions];
    this.loadEditions();
  }

  openDeleteConfirmation(editionId: number | undefined): void {
    if (editionId !== undefined) {
      this.editionToDeleteId = editionId;
      this.showDeleteConfirmation = true;
    } else {
      console.error('Impossible de supprimer : ID de l\'édition non défini');
      this.errorMessage = 'Erreur : Cette édition ne peut pas être supprimée (ID manquant)';
      this.notificationService.showNotification(this.errorMessage, 'error');
    }
  }

  closeDeleteConfirmation(): void {
    this.editionToDeleteId = null;
    this.showDeleteConfirmation = false;
  }

  confirmDelete(): void {
    if (this.editionToDeleteId && this.currentUser) {
      this.programmeEditionService.deleteProgrammeEdition(this.editionToDeleteId).subscribe({
        next: () => {
          this.notificationService.showNotification('Édition supprimée avec succès', 'success');
          this.closeDeleteConfirmation();
          this.loadEditions();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la suppression';
          this.closeDeleteConfirmation();
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEditions();
  }
}