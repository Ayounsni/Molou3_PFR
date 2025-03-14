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
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EtapeCompetitionService } from '../../../core/services/etape-competition.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { DeleteConfirmationModalComponent } from "../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component";

@Component({
  selector: 'app-etape',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ReactiveFormsModule, FormsModule, NotificationComponent, DeleteConfirmationModalComponent],
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.css']
})
export class EtapeComponent implements OnInit {
  bg = 'assets/bg3.png';
  editions: ProgrammeEdition[] = [];
  currentUser: User | null = null;
  showEtapeModal = false;
  etapeForm!: FormGroup;
  typeEtapeOptions = ['FOND', 'DEMI_FOND', 'VITESSE'];
  selectedEditionId: number | null = null;
  selectedEtapes: EtapeCompetition[] = [];
  isEditMode = false;
  currentEtapeId: number | null = null;
  errorMessage: string | null = null;
  pdfClassementFile: File | null = null;
  showDeleteModal = false;
  etapeToDelete: EtapeCompetition | null = null;

  constructor(
    private store: Store<AppState>,
    private programmeEditionService: ProgrammeEditionService,
    private etapeCompetitionService: EtapeCompetitionService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.etapeForm = this.fb.group({
      programmeEditionId: ['', Validators.required],
      typeEtape: ['', Validators.required],
      pdfClassement: [null]
    });
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
        this.onEditionChange(); // Rafraîchir les étapes sélectionnées
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
          this.loadEditions(); // Recharger les données depuis le backend
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Erreur lors de la suppression';
          this.notificationService.showNotification(errorMsg, 'error');
          this.closeDeleteModal();
        }
      });
    }
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.pdfClassementFile = event.target.files[0];
    }
  }

  openEtapeModal(isEditMode: boolean, etape?: EtapeCompetition): void {
    this.isEditMode = isEditMode;
    this.showEtapeModal = true;
    this.errorMessage = null;
    this.pdfClassementFile = null;

    if (isEditMode && etape) {
      this.currentEtapeId = etape.id ?? null;
      this.etapeForm.patchValue({
        programmeEditionId: this.selectedEditionId,
        typeEtape: etape.typeEtape,
        pdfClassement: null
      });
    } else {
      this.etapeForm.reset();
      this.currentEtapeId = null;
      if (this.selectedEditionId) {
        this.etapeForm.patchValue({
          programmeEditionId: this.selectedEditionId
        });
      }
    }
  }

  closeEtapeModal(): void {
    this.showEtapeModal = false;
    this.etapeForm.reset();
    this.isEditMode = false;
    this.errorMessage = null;
    this.pdfClassementFile = null;
  }

  onSubmitEtape(): void {
    if (this.etapeForm.valid) {
      const etapeData: any = {
        programmeEditionId: Number(this.etapeForm.value.programmeEditionId),
        typeEtape: this.etapeForm.value.typeEtape
      };

      if (this.isEditMode && this.currentEtapeId) {
        this.etapeCompetitionService.updateEtapeCompetition(
          this.currentEtapeId,
          etapeData,
          this.pdfClassementFile || undefined
        ).subscribe({
          next: (response) => {
            console.log('Étape modifiée avec succès:', response);
            this.notificationService.showNotification('Étape modifiée avec succès', 'success');
            this.closeEtapeModal();
            this.loadEditions(); // Recharger après modification
          },
          error: (err) => {
            const errorMsg = err.error?.message || err.message || 'Erreur lors de la modification';
            this.errorMessage = errorMsg;
            this.notificationService.showNotification(errorMsg, 'error');
          }
        });
      } else {
        this.etapeCompetitionService.createEtapeCompetition(etapeData).subscribe({
          next: (response) => {
            console.log('Étape créée avec succès:', response);
            this.notificationService.showNotification('Étape créée avec succès', 'success');
            this.closeEtapeModal();
            this.loadEditions(); // Recharger après création
          },
          error: (err) => {
            const errorMsg = err.error?.message || err.message || 'Erreur lors de la création';
            this.errorMessage = errorMsg;
            this.notificationService.showNotification(errorMsg, 'error');
          }
        });
      }
    }
  }

  private addLocalEtape(newEtape: any): void {
    const edition = this.editions.find(e => e.id === newEtape.programmeEdition?.id || newEtape.programmeEditionId);
    if (edition) {
      edition.etapeCompetitions = edition.etapeCompetitions || [];
      edition.etapeCompetitions.push(newEtape);
      this.onEditionChange();
    }
  }

  private updateLocalEtape(updatedEtape: any): void {
    const edition = this.editions.find(e => e.id === updatedEtape.programmeEdition?.id || updatedEtape.programmeEditionId);
    if (edition && edition.etapeCompetitions) {
      const index = edition.etapeCompetitions.findIndex(e => e.id === updatedEtape.id);
      if (index !== -1) {
        edition.etapeCompetitions[index] = { ...edition.etapeCompetitions[index], ...updatedEtape };
        this.onEditionChange();
      }
    }
  }

  private removeLocalEtape(etapeId: number): void {
    const edition = this.editions.find(e => e.id === this.selectedEditionId);
    if (edition && edition.etapeCompetitions) {
      edition.etapeCompetitions = edition.etapeCompetitions.filter(e => e.id !== etapeId);
      this.onEditionChange();
    }
  }
}