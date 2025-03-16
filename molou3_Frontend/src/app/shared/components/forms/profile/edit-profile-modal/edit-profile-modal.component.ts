import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as AuthActions from '../../../../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { User } from '../../../../models/user.model';
import { AppState } from '../../../../../store/app.state';
import { notInFuture, notTodayOrFuture } from '../../../../validators/validators';
import { WeatherService } from '../../../../../core/services/weather.service'; // Service pour autocomplétion
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent implements OnChanges {
  @Input() currentUser: User | null = null;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveProfile = new EventEmitter<any>();

  editForm: FormGroup;
  niveauOptions: string[] = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
  niveauLabels: { [key: string]: string } = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    EXPERT: 'Expert'
  };

  searchResults: any[] = []; // Pour stocker les suggestions de villes
  showSuggestions = false; // Pour afficher ou masquer les suggestions
  private searchTerms = new Subject<string>(); // Pour gérer les entrées de l'utilisateur

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private weatherService: WeatherService // Injectez le service d'autocomplétion
  ) {
    this.editForm = this.fb.group({});

    this.searchTerms.pipe(
      debounceTime(300), // Attendre 300ms avant d'envoyer la requête
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
    if (this.currentUser && this.showModal) {
      this.initializeForm();
    }
    if (!this.showModal) {
      this.editForm.reset();
      this.showSuggestions = false; 
    }
  }

  initializeForm(): void {
    if (this.currentUser?.role?.roleName === 'ROLE_ASSOCIATION') {
      this.editForm = this.fb.group({
        responsable: [this.currentUser.responsable || '', Validators.required],
        adresse: [this.currentUser.adresse || '', Validators.required],
        ville: [this.currentUser.ville || '', Validators.required],
        telephone: [this.currentUser.telephone || '', [Validators.required, Validators.pattern('^(\\+212|0)[5-7][0-9]{8}$')]],
        dateCreation: [this.currentUser.dateCreation || '', [Validators.required, notInFuture]],
        description: [this.currentUser.description || '']
      });
    } else if (this.currentUser?.role?.roleName === 'ROLE_COLOMBOPHILE') {
      this.editForm = this.fb.group({
        nomComplet: [this.currentUser.nomComplet || '', Validators.required],
        dateNaissance: [this.currentUser.dateNaissance || '', [Validators.required, notTodayOrFuture]],
        niveauExperience: [this.currentUser.niveauExperience || '', Validators.required],
        adresse: [this.currentUser.adresse || '', Validators.required],
        ville: [this.currentUser.ville || '', Validators.required],
        telephone: [this.currentUser.telephone || '', [Validators.required, Validators.pattern('^(\\+212|0)[5-7][0-9]{8}$')]],
        description: [this.currentUser.description || '']
      });
    }
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onSaveProfile(): void {
    if (this.editForm.valid && this.currentUser?.id) {
      const formData = this.editForm.value;
      this.store.dispatch(AuthActions.updateProfile({
        id: this.currentUser.id,
        updateDTO: formData,
        photoFile: undefined,
        preuveLegaleFile: undefined,
        logoFile: undefined
      }));
      this.saveProfile.emit(formData);
      this.closeModal.emit();
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  onVilleInput(): void {
    const query = this.editForm.get('ville')?.value;
    if (query && query.length > 2) {
      this.searchTerms.next(query);
    } else {
      this.searchResults = [];
      this.showSuggestions = false;
    }
  }

  selectCity(city: any): void {
    this.editForm.patchValue({ ville: city.name }); 
    this.showSuggestions = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.ville-container')) {
      this.showSuggestions = false;
    }
  }
}