import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  logo= 'assets/logo1.png';
  currentUser: User | null = null;
  admin = 'assets/admin.png';
  colombophile = 'assets/user1.jpg';
  association = 'assets/assoc.jpg'

  constructor(private store: Store<AppState>) {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      console.log('Current User dans Navbar:', this.currentUser);
    });
  }
}
