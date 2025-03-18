import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgrammeEditionService } from '../../../../core/services/programme-edition.service';
import { ProgrammeEdition } from '../../../../shared/models/programme-edition.model';
import { EtapeCompetition } from '../../../../shared/models/etape-competition.model';
import { Competition } from '../../../../shared/models/competition.model';

@Component({
  selector: 'app-participation-detail',
  imports: [CommonModule,FormsModule],
  templateUrl: './participation-detail.component.html',
  styleUrl: './participation-detail.component.css'
})
export class ParticipationDetailComponent implements OnInit {
  bg = 'assets/bg9.png';
  associationId: number | null = null;
  editions: ProgrammeEdition[] = [];
  selectedEditionId: number | null = null;
  selectedEdition: ProgrammeEdition | null = null;
  etapeCompetitions: EtapeCompetition[] = [];

  constructor(
    private route: ActivatedRoute,
    private programmeEditionService: ProgrammeEditionService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.associationId = +id;
        this.loadEditions();
      } else {
        console.error('Aucun ID trouvé dans l’URL parent');
      }
    });
  }

  /** Charge les éditions activées pour cette association */
  loadEditions(): void {
    if (!this.associationId) {
      console.error('Aucun ID d’association disponible');
      return;
    }
    this.programmeEditionService.getAllProgrammeEditionsAll().subscribe({
      next: (editions: ProgrammeEdition[]) => {
        // Filtrer par enabled: true et par l’ID de l’association
        this.editions = editions.filter(edition =>
          edition.enabled && String(edition.association?.id) === String(this.associationId)
        );
        this.editions.sort((a, b) => a.annee - b.annee);
        if (this.editions.length > 0 && this.editions[0].id !== undefined) {
          this.selectedEditionId = this.editions[0].id as number;
          this.onEditionChange();
        } else {
          this.selectedEditionId = null;
        }
        console.log('Éditions chargées:', this.editions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des éditions:', error);
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

  /** Formate l’heure pour afficher uniquement heures et minutes */
  formatTime(time: string | undefined): string {
    if (!time) return '';
    return time.split(':').slice(0, 2).join(':');
  }
}
