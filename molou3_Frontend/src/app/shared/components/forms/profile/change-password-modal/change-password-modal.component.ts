import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/app.state';
import * as AuthActions from '../../../../../store/auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  changePasswordForm: FormGroup;
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private actions$: Actions,
    private notificationService: NotificationService
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    // Gestion changePasswordSuccess
    this.subscription.add(
      this.actions$.pipe(
        ofType(AuthActions.changePasswordSuccess)
      ).subscribe(() => {
        this.notificationService.showNotification('Mot de passe changé avec succès.','success');
        this.errorMessage = null;
        this.close();
      })
    );

    // Gestion changePasswordFailure
    this.subscription.add(
      this.actions$.pipe(
        ofType(AuthActions.changePasswordFailure)
      ).subscribe(({ error }) => {
        this.errorMessage = error;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.closeModal.emit();
    this.changePasswordForm.reset();
    this.errorMessage = null;
  }

  onChangePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.changePasswordForm.value;
    this.store.dispatch(AuthActions.changePassword({ oldPassword, newPassword }));
  }
}