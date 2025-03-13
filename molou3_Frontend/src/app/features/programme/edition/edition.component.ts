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

@Component({
  selector: 'app-edition',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NotificationComponent, EditionFormComponent, DeleteConfirmationModalComponent],
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
  pageSize = 6; // Nombre d'éléments par page
  totalPages = 3;

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
    this.programmeEditionService.getAllProgrammeEditions().subscribe({
      next: (editions) => {
        console.log('Éditions brutes de l\'API:', editions);
        this.editions = editions.filter(edition => 
          Number(edition.association?.id) === this.currentUser?.id
        );
        console.log('Éditions filtrées:', this.editions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des éditions:', error);
      }
    });
  }

  openEditionModal(edition?: ProgrammeEdition): void {
    this.showEditionModal = true;
    this.currentEdition = edition || null;
    this.errorMessage = null;
  }

  get totalPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
  
  getPaginatedEditions(): any[] {
    // Simulation de pagination statique
    return this.editions.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
  
  setPage(page: number): void {
    this.currentPage = page;
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }



  closeEditionModal(): void {
    this.showEditionModal = false;
    this.currentEdition = null;
  }

  handleEditionSaved(edition: ProgrammeEdition): void {
    if (this.currentEdition) {
      // Mode édition : mise à jour de l'édition existante
      const index = this.editions.findIndex(e => e.id === edition.id);
      if (index !== -1) {
        this.editions[index] = edition;
      }
    } else {
      // Mode ajout : ajout de la nouvelle édition
      this.editions.push(edition);
    }
    this.editions = [...this.editions]; // Rafraîchir la liste
  }

  openDeleteConfirmation(editionId: number | undefined): void {
    if (editionId !== undefined) {
      this.editionToDeleteId = editionId;
      this.showDeleteConfirmation = true;
    } else {
      console.error('Impossible de supprimer : ID de l\'édition non défini');
      this.errorMessage = 'Erreur : Cette édition ne peut pas être supprimée (ID manquant)';
      if (this.errorMessage) {
        this.notificationService.showNotification(this.errorMessage, 'error');
      }
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
          this.editions = [...this.editions.filter(e => e.id !== this.editionToDeleteId)];
          this.closeDeleteConfirmation();
          this.notificationService.showNotification('Édition supprimée avec succès', 'success');
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la suppression';
          if (this.errorMessage) {
            this.notificationService.showNotification(this.errorMessage, 'error');
          }
          this.closeDeleteConfirmation();
        }
      });
    }
  }
}