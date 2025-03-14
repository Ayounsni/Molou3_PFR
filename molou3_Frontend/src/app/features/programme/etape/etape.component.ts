import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state'; // Adjust path to your AppState
import { selectCurrentUser } from '../../../store/auth/auth.selectors'; // Adjust path to your selector
import { ProgrammeEditionService } from '../../../core/services/programme-edition.service'; // Adjust path
import { ProgrammeEdition } from '../../../shared/models/programme-edition.model'; // Adjust path
import { User } from '../../../shared/models/user.model'; // Adjust path if needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etape',
  imports: [SidebarComponent,CommonModule],
  templateUrl: './etape.component.html',
  styleUrls: ['./etape.component.css']
})
export class EtapeComponent implements OnInit {
  bg = 'assets/bg3.png';
  editions: ProgrammeEdition[] = []; // Array to store filtered editions
  currentUser: User | null = null; // Store the current user

  constructor(
    private store: Store<AppState>,
    private programmeEditionService: ProgrammeEditionService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser(); // Fetch the current user on initialization
  }

  // Load the current user from the NgRx store
  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      console.log('Current User:', user);
      this.currentUser = user;
      if (this.currentUser) {
        this.loadEditions(); // Load editions once we have the user
      } else {
        console.log('No current user found');
      }
    });
  }

  // Load and filter editions
  loadEditions(): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.log('No current user or user ID available');
      return;
    }

    // Fetch all editions and filter by association ID
    this.programmeEditionService.getAllProgrammeEditionsAll().subscribe({
      next: (editions: ProgrammeEdition[]) => {
        // Filter editions where associationId matches currentUser.id
        this.editions = editions.filter(edition => 
          String(edition.association?.id) === String(this.currentUser!.id)
        );
        this.editions.sort((a, b) => a.annee - b.annee);
        console.log('Filtered Editions:', this.editions);
      },
      error: (err) => {
        console.error('Error fetching editions:', err);
      }
    });
  }
}