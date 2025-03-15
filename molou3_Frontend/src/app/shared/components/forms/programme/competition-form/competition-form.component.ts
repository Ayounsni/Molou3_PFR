import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Competition } from '../../../../models/competition.model';
import { ProgrammeEdition } from '../../../../models/programme-edition.model';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.css']
})
export class CompetitionFormComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() competition: Competition | null = null;
  @Input() editions: ProgrammeEdition[] = [];
  @Input() selectedEditionId: number | null = null;
  @Input() errorMessage: string | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitCompetition = new EventEmitter<{ data: any, pdfClassementFile?: File }>();

  competitionForm: FormGroup;
  pdfClassementFile: File | undefined = undefined;
  selectedEtapes: any[] = []; // Nouvelle propriété pour les étapes sélectionnées

  constructor(private fb: FormBuilder) {
    this.competitionForm = this.fb.group({
      ville: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      distance: ['', [Validators.required, Validators.min(0)]],
      competitionDate: ['', Validators.required],
      reunionDate: ['', Validators.required],
      reunionHoraire: [''],
      etapeCompetitionId: ['', Validators.required],
      pdfClassement: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Mettre à jour selectedEtapes si selectedEditionId ou editions change
    if (changes['selectedEditionId'] || changes['editions']) {
      this.updateSelectedEtapes();
    }

    // Charger les données en mode édition
    if (this.isEditMode && this.competition) {
      this.competitionForm.patchValue({
        ville: this.competition.ville,
        distance: this.competition.distance,
        competitionDate: this.competition.competitionDate,
        reunionDate: this.competition.reunionDate,
        reunionHoraire: this.competition.reunionHoraire,
        etapeCompetitionId: this.competition.etapeCompetition?.id,
        pdfClassement: null
      });
    } else if (!this.isEditMode) {
      this.competitionForm.reset();
      if (this.selectedEditionId) {
        this.competitionForm.patchValue({
          etapeCompetitionId: ''
        });
      }
    }

    // Réinitialiser le formulaire si le modal est fermé
    if (!this.showModal) {
      this.competitionForm.reset();
      this.pdfClassementFile = undefined;
    }
  }

  private updateSelectedEtapes(): void {
    const selectedEdition = this.editions.find(e => e.id === Number(this.selectedEditionId));
    this.selectedEtapes = selectedEdition ? selectedEdition.etapeCompetitions || [] : [];
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.pdfClassementFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.competitionForm.valid) {
      const competitionData = {
        ville: this.competitionForm.value.ville,
        distance: this.competitionForm.value.distance,
        competitionDate: this.competitionForm.value.competitionDate,
        reunionDate: this.competitionForm.value.reunionDate,
        reunionHoraire: this.competitionForm.value.reunionHoraire, // "20:14"
        etapeCompetitionId: Number(this.competitionForm.value.etapeCompetitionId)
      };
      this.submitCompetition.emit({ data: competitionData, pdfClassementFile: this.pdfClassementFile });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}