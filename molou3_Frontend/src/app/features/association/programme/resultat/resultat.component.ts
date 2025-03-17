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

  /** Charge l'utilisateur actuel depuis le store NgRx */
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

  /** Charge les éditions filtrées par l'association de l'utilisateur */
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

  /** Met à jour les données affichées lorsque l'édition change */
  onEditionChange(): void {
    this.selectedEdition = this.editions.find(edition => edition.id === Number(this.selectedEditionId)) || null;
    this.etapeCompetitions = this.selectedEdition?.etapeCompetitions || [];
    this.etapeCompetitions.sort((a, b) => {
      const order = { 'VITESSE': 1, 'DEMI_FOND': 2, 'FOND': 3 };
      return order[a.typeEtape] - order[b.typeEtape];
    });
  }

  /** Récupère les compétitions associées à une étape */
  getCompetitionsForEtape(etape: EtapeCompetition): Competition[] {
    return etape.competitions || [];
  }

  /** Formate l'heure pour afficher uniquement heures et minutes */
  formatTime(time: string | undefined): string {
    if (!time) return '';
    return time.split(':').slice(0, 2).join(':');
  }


  /** Inverse l'état de publication de l'édition sélectionnée */
  togglePublish(): void {
    if (!this.selectedEdition || this.selectedEdition.id === undefined) {
      this.notificationService.showNotification('Aucune édition sélectionnée', 'error');
      return;
    }

    // Crée une copie de l'édition avec la propriété enabled inversée
    const updatedEdition = { ...this.selectedEdition, enabled: !this.selectedEdition.enabled };

    // Appel au service pour mettre à jour dans la base de données
    this.programmeEditionService.updateProgrammeEdition(this.selectedEdition.id, updatedEdition).subscribe({
      next: (response) => {
        // Met à jour l'édition sélectionnée avec la réponse du serveur
        this.selectedEdition = response;
        // Met à jour la liste des éditions pour refléter le changement
        const index = this.editions.findIndex(e => e.id === response.id);
        if (index !== -1) {
          this.editions[index] = response;
        }
        // Affiche une notification de succès
        this.notificationService.showNotification(
          `Programme ${response.enabled ? 'publié' : 'retiré'} avec succès`,
          'success'
        );
      },
      error: (err) => {
        // Affiche une notification en cas d'erreur
        this.notificationService.showNotification(
          err.message || 'Erreur lors de la mise à jour de l\'édition',
          'error'
        );
      }
    });
  }
}