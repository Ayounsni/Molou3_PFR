import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { ProgrammeEditionService } from '../../../core/services/programme-edition.service';
import { CompetitionService } from '../../../core/services/competition.service'; // Service à créer
import { NotificationService } from '../../../core/services/notification.service';
import { ProgrammeEdition } from '../../../shared/models/programme-edition.model';
import { User } from '../../../shared/models/user.model';
import { Competition } from '../../../shared/models/competition.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { CompetitionFormComponent } from '../../../shared/components/forms/programme/competition-form/competition-form.component'; // À créer

@Component({
  selector: 'app-competition',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    NotificationComponent,
    DeleteConfirmationModalComponent,
    CompetitionFormComponent
  ],
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
  bg = 'assets/bg8.png';
  editions: ProgrammeEdition[] = [];
  currentUser: User | null = null;
  selectedEditionId: number | null = null;
  selectedCompetitions: Competition[] = [];
  showCompetitionModal = false;
  isEditMode = false;
  currentCompetitionId: number | null = null;
  errorMessage: string | null = null;
  showDeleteModal = false;
  competitionToDelete: Competition | null = null;
  currentCompetition: Competition | null = null;

  constructor(
    private store: Store<AppState>,
    private programmeEditionService: ProgrammeEditionService,
    private competitionService: CompetitionService,
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
      } else {
        console.log('No current user found');
      }
    });
  }

  loadEditions(): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.log('No current user or user ID available');
      return;
    }
    this.programmeEditionService.getAllProgrammeEditionsAll().subscribe({
      next: (editions: ProgrammeEdition[]) => {
        this.editions = editions.filter(edition => 
          String(edition.association?.id) === String(this.currentUser!.id)
        );
        this.editions.sort((a, b) => a.annee - b.annee);
        this.onEditionChange();
        console.log('Filtered Editions:', this.editions);
      },
      error: (err) => {
        console.error('Error fetching editions:', err);
        this.notificationService.showNotification(err.message || 'Erreur lors du chargement des éditions', 'error');
      }
    });
  }

  onEditionChange(): void {
    const selectedEdition = this.editions.find(edition => edition.id === Number(this.selectedEditionId));
    if (selectedEdition && selectedEdition.etapeCompetitions) {
      this.selectedCompetitions = selectedEdition.etapeCompetitions
        .flatMap(etape => etape.competitions || []);
    } else {
      this.selectedCompetitions = [];
    }
    console.log('Selected Competitions:', this.selectedCompetitions);
  }

  openCompetitionModal(isEditMode: boolean, competition?: Competition): void {
    this.isEditMode = isEditMode;
    this.showCompetitionModal = true;
    this.currentCompetition = competition || null;
    this.currentCompetitionId = competition?.id || null;
    this.errorMessage = null;
  }

  closeCompetitionModal(): void {
    this.showCompetitionModal = false;
    this.currentCompetition = null;
    this.currentCompetitionId = null;
    this.errorMessage = null;
  }

  onSubmitCompetition(event: { data: any, pdfClassementFile?: File }): void {
    const { data, pdfClassementFile } = event;
    if (this.isEditMode && this.currentCompetitionId) {
      this.competitionService.updateCompetition(
        this.currentCompetitionId,
        data,
        pdfClassementFile
      ).subscribe({
        next: (response) => {
          console.log('Compétition modifiée avec succès:', response);
          this.notificationService.showNotification('Compétition modifiée avec succès', 'success');
          this.closeCompetitionModal();
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Erreur lors de la modification';
          this.errorMessage = errorMsg;
        }
      });
    } else {
      this.competitionService.createCompetition(data).subscribe({
        next: (response) => {
          console.log('Compétition créée avec succès:', response);
          this.notificationService.showNotification('Compétition créée avec succès', 'success');
          this.closeCompetitionModal();
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err|| err.message || 'Erreur lors de la création';
          this.errorMessage = errorMsg;
        }
      });
    }
  }

  openDeleteModal(competition: Competition): void {
    this.competitionToDelete = competition;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.competitionToDelete = null;
  }

  confirmDelete(): void {
    if (this.competitionToDelete && this.competitionToDelete.id) {
      this.competitionService.deleteCompetition(this.competitionToDelete.id).subscribe({
        next: () => {
          this.notificationService.showNotification('Compétition supprimée avec succès', 'success');
          this.closeDeleteModal();
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Erreur lors de la suppression';
          this.notificationService.showNotification(errorMsg, 'error');
          this.closeDeleteModal();
        }
      });
    }
  }

  openFileInput(competition: Competition): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf,image/*';
    fileInput.onchange = (event) => this.uploadClassement(competition, event);
    fileInput.click();
  }

  uploadClassement(competition: Competition, event: any): void {
    const file = event.target.files[0];
    if (file && competition.id) {
      const data = {
        ville: competition.ville,
        distance: competition.distance,
        competitionDate: competition.competitionDate,
        reunionDate: competition.reunionDate,
        reunionHoraire: competition.reunionHoraire,
        etapeCompetitionId: competition.etapeCompetition?.id
      };
      this.competitionService.updateCompetition(competition.id, data, file).subscribe({
        next: (response) => {
          this.notificationService.showNotification('Classement uploadé avec succès', 'success');
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Erreur lors de l\'upload du classement';
          this.notificationService.showNotification(errorMsg, 'error');
        }
      });
    }
  }

  deleteClassement(competition: Competition): void {
    if (competition.id) {
      this.competitionService.deleteCompetitionClassement(competition.id).subscribe({
        next: () => {
          this.notificationService.showNotification('Classement supprimé avec succès', 'success');
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Erreur lors de la suppression du classement';
          this.notificationService.showNotification(errorMsg, 'error');
        }
      });
    }
  }
}