import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Annonce } from '../../../../models/annonce.model';
import { User } from '../../../../models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AnnonceService } from '../../../../../core/services/annonce.service';

@Component({
  selector: 'app-annonce-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './annonce-form.component.html',
  styleUrl: './annonce-form.component.css'
})
export class AnnonceFormComponent {
    @Input() annonce: Annonce | null = null; 
    @Input() currentUser: User | null = null; 
    @Input() showModal: boolean = false; 
    @Output() closeModal = new EventEmitter<void>(); 
    @Output() editionSaved = new EventEmitter<Annonce>(); 
  
    annonceForm!: FormGroup;
    isEditMode: boolean = false;
    errorMessage: string | null = null;
  
    constructor(
      private fb: FormBuilder,
      private annonceService: AnnonceService,
      private notificationService: NotificationService
    ) {
      this.initForm();
    }
  
    ngOnChanges(): void {
      if (this.annonce) {
        this.isEditMode = true;
        this.annonceForm.patchValue({
          titre: this.annonce.titre,
          contenu: this.annonce.contenu
        });
      } else {
        this.isEditMode = false;
        this.annonceForm.reset();
      }
    }
  
    initForm(): void {
      this.annonceForm = this.fb.group({
        titre: ['', [Validators.required]],
        contenu: ['',[Validators.required,Validators.minLength(25)]]
      });
    }
  
    onSubmitEdition(): void {
      if (this.annonceForm.valid && this.currentUser) {
        const formData = {
          titre: this.annonceForm.value.titre,
          contenu: this.annonceForm.value.contenu,
          associationId: this.currentUser.id
        };
  
        if (this.isEditMode && this.annonce && this.annonce.id) {
          this.annonceService.updateAnnonce(this.annonce.id, formData).subscribe({
            next: (updatedAnnonce) => {
              this.editionSaved.emit(updatedAnnonce);
              this.closeModal.emit();
              this.notificationService.showNotification('Annonce modifiée avec succès', 'success');
            },
            error: (error) => {
              this.errorMessage = error || 'Erreur lors de la mise à jour';
              if (this.errorMessage) {
                this.notificationService.showNotification(this.errorMessage, 'error');
              }
            }
          });
        } else {
          this.annonceService.createAnnonce(formData).subscribe({
            next: (newAnnonce) => {
              this.editionSaved.emit(newAnnonce);
              this.closeModal.emit();
              this.notificationService.showNotification('Annonce ajoutée avec succès', 'success');
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
      this.annonceForm.reset();
      this.errorMessage = null;
    }

}
