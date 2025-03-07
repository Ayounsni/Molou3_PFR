import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import * as AuthActions from '../../../store/auth/auth.actions';
import { User } from '../../models/user.model';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  imagepath = 'assets/logo1.png';
  isDropdownOpen = false;
  currentUser: User | null = null;

  constructor(private store: Store<AppState>) {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      console.log('Current User dans Navbar:', this.currentUser);
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen) {
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('.dropdown-trigger') || target.closest('.dropdown-menu');
      if (!clickedInside) {
        this.isDropdownOpen = false;
      }
    }
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}