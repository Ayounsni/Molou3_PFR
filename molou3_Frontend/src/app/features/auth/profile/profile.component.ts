import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { ExperienceLabelPipe } from '../../../shared/pipes/experience-label.pipe';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { EditProfileModalComponent } from '../../../shared/components/forms/profile/edit-profile-modal/edit-profile-modal.component';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";

@Component({
  selector: 'app-profile',
  imports: [SidebarComponent, CommonModule, ExperienceLabelPipe, EditProfileModalComponent, NotificationComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  colombophile = 'assets/user1.jpg';
  association = 'assets/assoc.jpg';
  showEditModal: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  handleSaveProfile(updatedData: any): void {
    this.showEditModal = false;
    // Optionnel : Mettre à jour localement si nécessaire
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updatedData };
    }
  }
}