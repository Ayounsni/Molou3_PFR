import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { ProgrammeEditionService } from '../../../../core/services/programme-edition.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProgrammeEdition } from '../../../../shared/models/programme-edition.model';
import { User } from '../../../../shared/models/user.model';
import { EtapeCompetition } from '../../../../shared/models/etape-competition.model';
import { Competition } from '../../../../shared/models/competition.model';
import { NotificationComponent } from "../../../../shared/components/notification/notification.component";

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NotificationComponent],
  templateUrl: './resultat.component.html',
  styleUrls: ['./resultat.component.css']
})
export class ResultatComponent implements OnInit {
  bg = 'assets/bg9.png';
  editions: ProgrammeEdition[] = [];
  currentUser: User | null = null;
  selectedEditionId: number | null = null;
  selectedEdition: ProgrammeEdition | null = null;
  etapeCompetitions: EtapeCompetition[] = [];

  constructor(
    private store: Store<AppState>,
    private programmeEditionService: ProgrammeEditionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    
  }

  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
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
        console.log(this.editions);
        this.editions.sort((a, b) => a.annee - b.annee);
        if (this.editions.length > 0 && this.editions[0].id !== undefined) {
          this.selectedEditionId = this.editions[0].id as number;
          this.onEditionChange();
        } else {
          this.selectedEditionId = null;
        }
      },
      error: (err) => {
        console.error('Error fetching editions:', err);
        this.notificationService.showNotification(err.message || 'Erreur lors du chargement des éditions', 'error');
      }
    });
  }

  onEditionChange(): void {
    this.selectedEdition = this.editions.find(edition => edition.id === Number(this.selectedEditionId)) || null;
    this.etapeCompetitions = this.selectedEdition?.etapeCompetitions || [];
    this.etapeCompetitions.sort((a, b) => {
      const order = { 'VITESSE': 1, 'DEMI_FOND': 2, 'FOND': 3 };
      return order[a.typeEtape] - order[b.typeEtape];
    });
  }

  getCompetitionsForEtape(etape: EtapeCompetition): Competition[] {
    return etape.competitions || [];
  }

  formatTime(time: string | undefined): string {
    if (!time) return '';
    return time.split(':').slice(0, 2).join(':');
  }


  togglePublish(): void {
    if (!this.selectedEdition || this.selectedEdition.id === undefined) {
      this.notificationService.showNotification('Aucune édition sélectionnée', 'error');
      return;
    }

    const updatedEdition = { ...this.selectedEdition, enabled: !this.selectedEdition.enabled };

    this.programmeEditionService.updateProgrammeEdition(this.selectedEdition.id, updatedEdition).subscribe({
      next: (response) => {
        this.selectedEdition = response;
        const index = this.editions.findIndex(e => e.id === response.id);
        if (index !== -1) {
          this.editions[index] = response;
        }
        this.notificationService.showNotification(
          `Programme ${response.enabled ? 'publié' : 'retiré'} avec succès`,
          'success'
        );
      },
      error: (err) => {
        this.notificationService.showNotification(
          err.message || 'Erreur lors de la mise à jour de l\'édition',
          'error'
        );
      }
    });
  }
}