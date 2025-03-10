import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { ExperienceLabelPipe } from '../../../shared/pipes/experience-label.pipe';

@Component({
  selector: 'app-profile',
  imports: [SidebarComponent,CommonModule,RoleLabelPipe,ExperienceLabelPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    currentUser: User | null = null;
    colombophile = 'assets/user1.jpg';
    association = 'assets/assoc.jpg'
  
  
    constructor(private store: Store<AppState>) {}
  
    ngOnInit() {
      this.store.select(selectCurrentUser).subscribe(user => {
        this.currentUser = user;
      });
    }

}
