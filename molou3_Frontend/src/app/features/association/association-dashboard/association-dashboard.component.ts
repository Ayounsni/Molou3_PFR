import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-association-dashboard',
  imports: [CommonModule],
  templateUrl: './association-dashboard.component.html',
  styleUrl: './association-dashboard.component.css'
})
export class AssociationDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });
  }
}
