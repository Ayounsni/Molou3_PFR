import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';
import { User } from '../../models/user.model';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { RoleLabelPipe } from '../../pipes/role-label.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RoleLabelPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  imagepath = 'assets/logo1.png';
  logo = 'assets/nhassi.png';
  isDropdownOpen: string | null = null; // Gérer plusieurs dropdowns avec un identifiant
  isProfileDropdownOpen = false;
  currentUser: User | null = null;

  constructor(private store: Store<AppState>) {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      console.log('Current User dans Navbar:', this.currentUser);
    });
  }

  toggleDropdown(type: string) {
    this.isDropdownOpen = this.isDropdownOpen === type ? null : type;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isDropdownOpen === 'weather' && !target.closest('.weather-dropdown-trigger')) {
      this.isDropdownOpen = null;
    }
    if (this.isDropdownOpen === 'admin' && !target.closest('.admin-dropdown-trigger')) {
      this.isDropdownOpen = null;
    }
    if (this.isDropdownOpen === 'association' && !target.closest('.association-dropdown-trigger')) {
      this.isDropdownOpen = null;
    }
    if (this.isProfileDropdownOpen && !target.closest('.profile-dropdown-trigger')) {
      this.isProfileDropdownOpen = false;
    }
  }
}