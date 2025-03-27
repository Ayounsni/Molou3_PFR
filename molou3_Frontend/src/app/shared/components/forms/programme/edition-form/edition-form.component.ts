import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgrammeEdition } from '../../../../models/programme-edition.model';
import { User } from '../../../../models/user.model';
import { ProgrammeEditionService } from '../../../../../core/services/programme-edition.service';
import { NotificationService } from '../../../../../core/services/notification.service';


@Component({
  selector: 'app-edition-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edition-form.component.html',
  styleUrls: ['./edition-form.component.css']
})
export class EditionFormComponent {
  @Input() edition: ProgrammeEdition | null = null;
  @Input() currentUser: User | null = null; 
  @Input() showModal: boolean = false; 
  @Output() closeModal = new EventEmitter<void>(); 
  @Output() editionSaved = new EventEmitter<ProgrammeEdition>(); 

  editionForm!: FormGroup;
  isEditMode: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private programmeEditionService: ProgrammeEditionService,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.edition) {
      this.isEditMode = true;
      this.editionForm.patchValue({
        annee: this.edition.annee,
        description: this.edition.description
      });
    } else {
      this.isEditMode = false;
      this.editionForm.reset();
    }
  }

  initForm(): void {
    this.editionForm = this.fb.group({
      annee: ['', [
        Validators.required,
        Validators.min(2000),
        Validators.max(2100)
      ]],
      description: ['']
    });
  }

  onSubmitEdition(): void {
    if (this.editionForm.valid && this.currentUser) {
      const formData = {
        annee: this.editionForm.value.annee,
        description: this.editionForm.value.description,
        associationId: this.currentUser.id
      };

      if (this.isEditMode && this.edition && this.edition.id) {
        this.programmeEditionService.updateProgrammeEdition(this.edition.id, formData).subscribe({
          next: (updatedEdition) => {
            this.editionSaved.emit(updatedEdition);
            this.closeModal.emit();
            this.notificationService.showNotification('Édition modifiée avec succès', 'success');
          },
          error: (error) => {
            this.errorMessage = error.message || 'Erreur lors de la mise à jour';
            if (this.errorMessage) {
              this.notificationService.showNotification(this.errorMessage, 'error');
            }
          }
        });
      } else {
        this.programmeEditionService.createProgrammeEdition(formData).subscribe({
          next: (newEdition) => {
            this.editionSaved.emit(newEdition);
            this.closeModal.emit();
            this.notificationService.showNotification('Édition ajoutée avec succès', 'success');
          },
          error: (error) => {
            this.errorMessage = error.message || 'Une erreur est survenue lors de la création';
            if (this.errorMessage) {
              this.notificationService.showNotification(this.errorMessage, 'error');
            }
          }
        });
      }
    }
  }

  closeEditionModal(): void {
    this.closeModal.emit();
    this.editionForm.reset();
    this.errorMessage = null;
  }
}