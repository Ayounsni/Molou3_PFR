import { Component, EventEmitter, Input, Output, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { Pigeon } from '../../../../models/pigeon.model';
import { PigeonService } from '../../../../../core/services/pigeon.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { WeatherService } from '../../../../../core/services/weather.service'; // Service pour autocomplétion
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { notInFuture } from '../../../../validators/validators';



@Component({
  selector: 'app-pigeon-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pigeon-form.component.html',
  styleUrls: ['./pigeon-form.component.css']
})
export class PigeonFormComponent implements OnChanges {
  @Input() pigeon: Pigeon | null = null;
  @Input() currentUser: User | null = null;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() pigeonSaved = new EventEmitter<Pigeon>();

  pigeonForm: FormGroup;
  photoFile: File | undefined;
  isEditMode: boolean = false;
  errorMessage: string | null = null;

  searchResults: any[] = []; 
  showSuggestions = false; 
  private searchTerms = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private pigeonService: PigeonService,
    private notificationService: NotificationService,
    private weatherService: WeatherService
  ) {
    this.pigeonForm = this.fb.group({
      serieBague: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'), 
        Validators.minLength(3),        
        Validators.maxLength(12)       
      ]],
      sexe: ['', Validators.required],
      dateNaissance: ['', [Validators.required, notInFuture]],
      nationalite: ['', Validators.required],
      photoUrl: [''],
      statusPigeon: ['']
    });

    // Configuration de l'autocomplétion
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

  ngOnChanges(): void {
    if (this.pigeon) {
      this.isEditMode = true;
      this.pigeonForm.patchValue({
        serieBague: this.pigeon.serieBague,
        sexe: this.pigeon.sexe,
        dateNaissance: this.pigeon.dateNaissance,
        nationalite: this.pigeon.nationalite,
        photoUrl: this.pigeon.photoUrl,
        statusPigeon: this.pigeon.statusPigeon
      });
      this.pigeonForm.get('statusPigeon')?.enable();
    } else {
      this.isEditMode = false;
      this.pigeonForm.reset();
      this.pigeonForm.get('statusPigeon')?.disable();
    }
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.photoFile = event.target.files[0];
    }
  }

  onNationaliteInput(): void {
    const query = this.pigeonForm.get('nationalite')?.value;
    if (query && query.length > 1) { // Commencer la recherche après 2 caractères
      this.searchTerms.next(query);
    } else {
      this.searchResults = [];
      this.showSuggestions = false;
    }
  }

  selectCountry(country: any): void {
    this.pigeonForm.patchValue({ nationalite: country.country }); // Remplir avec le pays uniquement
    this.showSuggestions = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.nationalite-container')) {
      this.showSuggestions = false;
    }
  }

  submitPigeon(): void {
    if (this.pigeonForm.valid && this.currentUser) {
      const formValue = this.pigeonForm.value;
      const pigeonData = {
        serieBague: formValue.serieBague,
        sexe: formValue.sexe,
        dateNaissance: formValue.dateNaissance,
        nationalite: formValue.nationalite,
        photoUrl: formValue.photoUrl,
        colombophileId: this.currentUser.id,
        ...(this.isEditMode && { statusPigeon: formValue.statusPigeon })
      };

      if (this.isEditMode && this.pigeon?.id) {
        this.pigeonService.updatePigeon(this.pigeon.id, pigeonData, this.photoFile).subscribe({
          next: (updatedPigeon) => {
            this.pigeonSaved.emit(updatedPigeon);
            this.closeModal.emit();
            this.notificationService.showNotification('Pigeon modifié avec succès', 'success');
          },
          error: (error) => {
            this.errorMessage = error || 'Erreur lors de la mise à jour';
          }
        });
      } else {
        this.pigeonService.createPigeon(pigeonData, this.photoFile).subscribe({
          next: (newPigeon) => {
            this.pigeonSaved.emit(newPigeon);
            this.closeModal.emit();
            this.notificationService.showNotification('Pigeon ajouté avec succès', 'success');
          },
          error: (error) => {
            this.errorMessage = error || 'Une erreur est survenue lors de la création';
          }
        });
      }
    }
  }

  closePigeonModal(): void {
    this.closeModal.emit();
    this.pigeonForm.reset();
    this.errorMessage = null;
    this.photoFile = undefined;
    this.showSuggestions = false;
  }
}