import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../../core/services/upload.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { User } from '../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });
  }

}