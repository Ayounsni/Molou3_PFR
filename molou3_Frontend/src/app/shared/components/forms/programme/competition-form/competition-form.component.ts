import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Competition } from '../../../../models/competition.model';
import { ProgrammeEdition } from '../../../../models/programme-edition.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WeatherService } from '../../../../../core/services/weather.service';

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
  selectedEtapes: any[] = [];
  searchResults: any[] = []; // Pour stocker les suggestions de villes
  showSuggestions = false; // Pour afficher ou masquer les suggestions
  private searchTerms = new Subject<string>(); // Pour gérer les entrées de l'utilisateur

  constructor(
    private fb: FormBuilder,
    private weatherService: WeatherService // Injectez le service
  ) {
    this.competitionForm = this.fb.group({
      ville: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      distance: ['', [Validators.required, Validators.min(0)]],
      competitionDate: ['', Validators.required],
      reunionDate: ['', Validators.required],
      reunionHoraire: [''],
      etapeCompetitionId: ['', Validators.required],
      pdfClassement: [null]
    });

    this.searchTerms.pipe(
      debounceTime(300), 
      distinctUntilChanged(), // Ne pas envoyer si la valeur n'a pas changé
      switchMap(query => this.weatherService.getAutocomplete(query)) // Appeler l'API
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSuggestions = true;
      },
      error: (err) => {
        console.error(err);
        this.searchResults = [];
        this.showSuggestions = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedEditionId'] || changes['editions']) {
      this.updateSelectedEtapes();
    }

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
    }

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
        reunionHoraire: this.competitionForm.value.reunionHoraire,
        etapeCompetitionId: Number(this.competitionForm.value.etapeCompetitionId)
      };
      this.submitCompetition.emit({ data: competitionData, pdfClassementFile: this.pdfClassementFile });
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  // Gérer l'entrée dans le champ "ville"
  onVilleInput(): void {
    const query = this.competitionForm.get('ville')?.value;
    if (query && query.length > 2) {
      this.searchTerms.next(query);
    } else {
      this.searchResults = [];
      this.showSuggestions = false;
    }
  }

  selectCity(city: any): void {
    this.competitionForm.patchValue({ ville: city.name }); // Mettre seulement la région
    this.showSuggestions = false;
  }

  // Fermer les suggestions si clic en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.ville-container')) {
      this.showSuggestions = false;
    }
  }
}