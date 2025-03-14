import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { ProgrammeEditionService } from '../../../core/services/programme-edition.service';
import { ProgrammeEdition } from '../../../shared/models/programme-edition.model';
import { EtapeCompetition } from '../../../shared/models/etape-competition.model';
import { User } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtapeCompetitionService } from '../../../core/services/etape-competition.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { DeleteConfirmationModalComponent } from "../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { EtapeFormComponent } from '../../../shared/components/forms/programme/etape-form/etape-form.component';

@Component({
  selector: 'app-etape',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule,
    NotificationComponent,
    DeleteConfirmationModalComponent,
    EtapeFormComponent
  ],
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.css']
})
export class EtapeComponent implements OnInit {
  bg = 'assets/bg3.png';
  editions: ProgrammeEdition[] = [];
  currentUser: User | null = null;
  showEtapeModal = false;
  typeEtapeOptions = ['FOND', 'DEMI_FOND', 'VITESSE'];
  selectedEditionId: number | null = null;
  selectedEtapes: EtapeCompetition[] = [];
  isEditMode = false;
  currentEtapeId: number | null = null;
  errorMessage: string | null = null;
  showDeleteModal = false;
  etapeToDelete: EtapeCompetition | null = null;
  currentEtape: EtapeCompetition | null = null;

  constructor(
    private store: Store<AppState>,
    private programmeEditionService: ProgrammeEditionService,
    private etapeCompetitionService: EtapeCompetitionService,
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
        this.errorMessage = 'Erreur lors du chargement des éditions';
        this.notificationService.showNotification(this.errorMessage, 'error');
      }
    });
  }

  onEditionChange(): void {
    const selectedEdition = this.editions.find(edition => edition.id === Number(this.selectedEditionId));
    this.selectedEtapes = selectedEdition?.etapeCompetitions || [];
    this.selectedEtapes.sort((a, b) => {
      const order = { 'VITESSE': 1, 'DEMI_FOND': 2, 'FOND': 3 };
      return order[a.typeEtape] - order[b.typeEtape];
    });
  }

  getDistanceInterval(typeEtape: string): string {
    switch (typeEtape) {
      case 'VITESSE':
        return '80 - 300 km';
      case 'DEMI_FOND':
        return '300 - 600 km';
      case 'FOND':
        return '600 - 1200 km';
      default:
        return 'N/A';
    }
  }

  openDeleteModal(etape: EtapeCompetition): void {
    this.etapeToDelete = etape;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.etapeToDelete = null;
  }

  confirmDelete(): void {
    if (this.etapeToDelete && this.etapeToDelete.id) {
      this.etapeCompetitionService.deleteEtapeCompetition(this.etapeToDelete.id).subscribe({
        next: () => {
          this.notificationService.showNotification('Étape supprimée avec succès', 'success');
          this.closeDeleteModal();
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err || err.message || 'Erreur lors de la suppression';
          this.notificationService.showNotification(errorMsg, 'error');
          this.closeDeleteModal();
        }
      });
    }
  }

  openEtapeModal(isEditMode: boolean, etape?: EtapeCompetition): void {
    this.isEditMode = isEditMode;
    this.showEtapeModal = true;
    this.currentEtape = etape || null;
    this.currentEtapeId = etape?.id || null;
    this.errorMessage = null;
  }

  closeEtapeModal(): void {
    this.showEtapeModal = false;
    this.currentEtape = null;
    this.currentEtapeId = null;
    this.errorMessage = null;
  }

  onSubmitEtape(event: { data: any, pdfClassementFile?: File }): void {
    const { data, pdfClassementFile } = event;
    if (this.isEditMode && this.currentEtapeId) {
      this.etapeCompetitionService.updateEtapeCompetition(
        this.currentEtapeId,
        data,
        pdfClassementFile
      ).subscribe({
        next: (response) => {
          console.log('Étape modifiée avec succès:', response);
          this.notificationService.showNotification('Étape modifiée avec succès', 'success');
          this.closeEtapeModal();
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err || err.message || 'Erreur lors de la modification';
          this.errorMessage = errorMsg;
        }
      });
    } else {
      this.etapeCompetitionService.createEtapeCompetition(data).subscribe({
        next: (response) => {
          console.log('Étape créée avec succès:', response);
          this.notificationService.showNotification('Étape créée avec succès', 'success');
          this.closeEtapeModal();
          this.loadEditions();
        },
        error: (err) => {
          const errorMsg = err || err.message || 'Erreur lors de la création';
          this.errorMessage = errorMsg;
        }
      });
    }
  }

  // Méthode pour déclencher l'input file
  openFileInput(etape: EtapeCompetition): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf,image/*'; // Accepte PDF et images
    fileInput.onchange = (event) => this.uploadClassement(etape, event);
    fileInput.click();
  }

  // Méthode pour gérer l'upload du classement
  uploadClassement(etape: EtapeCompetition, event: any): void {
    const file = event.target.files[0];
    if (file && etape.id) {
      const data = {
        programmeEditionId: etape.programmeEdition?.id || this.selectedEditionId,
        typeEtape: etape.typeEtape
      };
      this.etapeCompetitionService.updateEtapeCompetition(etape.id, data, file).subscribe({
        next: (response) => {
          this.notificationService.showNotification('Classement uploadé avec succès', 'success');
          this.loadEditions(); // Recharger les données
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Erreur lors de l\'upload du classement';
          this.notificationService.showNotification(errorMsg, 'error');
        }
      });
    }
  }

  deleteClassement(etape: EtapeCompetition): void {
    if (etape.id) {
      this.etapeCompetitionService.deleteEtapeClassement(etape.id).subscribe({
        next: () => {
          this.notificationService.showNotification('Classement supprimé avec succès', 'success');
          this.loadEditions();  
        },
        error: (err) => {
          const errorMsg = err || err.message || 'Erreur lors de la suppression du classement';
          this.notificationService.showNotification(errorMsg, 'error');
        }
      });
    }
  }
}