import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as AuthActions from '../../../../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { User } from '../../../../models/user.model';
import { AppState } from '../../../../../store/app.state';
import { notInFuture, notTodayOrFuture } from '../../../../validators/validators';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent {
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

  constructor(private fb: FormBuilder, private store: Store<AppState>,private notificationService: NotificationService) {
    this.editForm = this.fb.group({});
  }

  ngOnChanges(): void {
    if (this.currentUser && this.showModal) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    if (this.currentUser?.role?.roleName === 'ROLE_ASSOCIATION') {
      this.editForm = this.fb.group({
        responsable: [this.currentUser.responsable || '', Validators.required],
        adresse: [this.currentUser.adresse || '', Validators.required],
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
      this.notificationService.showNotification('Profil mis à jour avec succès !', 'success'); 
      this.closeModal.emit();
    } else {
      this.editForm.markAllAsTouched();
    }
  }
}