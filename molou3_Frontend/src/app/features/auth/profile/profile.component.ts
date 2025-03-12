import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { ExperienceLabelPipe } from '../../../shared/pipes/experience-label.pipe';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import * as AuthActions from '../../../store/auth/auth.actions';
import { EditProfileModalComponent } from '../../../shared/components/forms/profile/edit-profile-modal/edit-profile-modal.component';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { NotificationService } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { ChangePasswordModalComponent } from '../../../shared/components/forms/profile/change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-profile',
  imports: [
    SidebarComponent,
    CommonModule,
    ExperienceLabelPipe,
    EditProfileModalComponent,
    NotificationComponent,
    ChangePasswordModalComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading: boolean = false;
  colombophile = 'assets/user1.jpg';
  association = 'assets/assoc.jpg';
  showEditModal: boolean = false;
  showChangePasswordModal: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });

    // Gestion updateProfile
    this.subscription.add(
      this.actions$.pipe(
        ofType(AuthActions.updateProfileSuccess)
      ).subscribe(() => {
        this.isLoading = false;
        this.notificationService.showNotification( 'Photo de profil mise à jour avec succès !','success');
      })
    );

    this.subscription.add(
      this.actions$.pipe(
        ofType(AuthActions.updateProfileFailure)
      ).subscribe(({ error }) => {
        this.isLoading = false;
        this.notificationService.showNotification( error,'error');
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  handleSaveProfile(updatedData: any): void {
    this.showEditModal = false;
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updatedData };
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.currentUser?.id) {
      const file = input.files[0];
      console.log('Dispatching updateProfile with file:', file, 'for user ID:', this.currentUser.id);
      this.isLoading = true;
      this.store.dispatch(AuthActions.updateProfile({
        id: this.currentUser.id,
        updateDTO: {},
        photoFile: file
      }));
    } else {
      console.log('No file selected or user ID missing');
    }
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
  }
}