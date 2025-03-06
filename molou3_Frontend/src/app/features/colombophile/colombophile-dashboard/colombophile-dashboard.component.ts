import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { AppUser } from '../../../shared/models/app-user.model';

import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-colombophile-dashboard',
  imports: [CommonModule], // Ajoutez CommonModule pour *ngIf et autres directives
  templateUrl: './colombophile-dashboard.component.html',
  styleUrls: ['./colombophile-dashboard.component.css']
})
export class ColombophileDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });
  }
}
