import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { PigeonService } from '../../../../core/services/pigeon.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Pigeon } from '../../../../shared/models/pigeon.model';
import { User } from '../../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { PigeonFormComponent } from '../../../../shared/components/forms/pigeon/pigeon-form/pigeon-form.component';

@Component({
  selector: 'app-pigeon-disponible',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    DeleteConfirmationModalComponent,
    PigeonFormComponent 
  ],
  templateUrl: './pigeon-disponible.component.html',
  styleUrls: ['./pigeon-disponible.component.css']
})
export class PigeonDisponibleComponent implements OnInit {
  bg = 'assets/bg20.jpg';
  showAddModal = false;
  showEditModal = false;
  showDeleteConfirmation = false;
  showDetailModal = false;
  pigeons: Pigeon[] = [];
  filteredPigeons: Pigeon[] = [];
  selectedPigeon: Pigeon | null = null;
  currentUser: User | null = null;
  pigeonToDeleteId: number | null = null;
  errorMessage: string | null = null;
  currentPage = 1;
  pageSize = 8;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;

  searchQuery: string = '';
  isMaleChecked: boolean = false;
  isFemaleChecked: boolean = false;
  menuVisible: boolean = false;
  selectedPigeonIdForMenu: number | null = null;
  image: string = 'assets/pardefaut.webp'; // Image par défaut

  constructor(
    private pigeonService: PigeonService,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.loadPigeons();
      }
    });
  }

  loadPigeons(): void {
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté');
      return;
    }
    this.pigeonService.getAllPigeons(this.currentPage - 1, this.pageSize, this.currentUser.id).subscribe({
      next: (pageData) => {
        this.pigeons = pageData.content;
        this.filteredPigeons = [...this.pigeons];
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1;

        if (this.pigeons.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadPigeons();
        }
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }

  filterPigeons(): void {
    this.filteredPigeons = this.pigeons.filter(pigeon => {
      const matchesSearch = this.searchQuery
        ? pigeon.serieBague.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesGender =
        (!this.isMaleChecked && !this.isFemaleChecked) ||
        (this.isMaleChecked && pigeon.sexe === 'MALE') ||
        (this.isFemaleChecked && pigeon.sexe === 'FEMELLE');
      return matchesSearch && matchesGender;
    });
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.isMaleChecked = false;
    this.isFemaleChecked = false;
    this.filterPigeons();
  }

  toggleGender(gender: 'male' | 'female'): void {
    if (gender === 'male') {
      this.isMaleChecked = !this.isMaleChecked;
      if (this.isMaleChecked) {
        this.isFemaleChecked = false;
      }
    } else {
      this.isFemaleChecked = !this.isFemaleChecked;
      if (this.isFemaleChecked) {
        this.isMaleChecked = false;
      }
    }
    this.filterPigeons();
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
    const target = event.currentTarget as HTMLElement;
    const pigeonId = target.closest('.relative')?.querySelector('input[name="pigeonId"]')?.getAttribute('value');
    this.selectedPigeonIdForMenu = pigeonId ? +pigeonId : null;
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.selectedPigeon = null; // Pas de pigeon sélectionné pour ajout
  }

  openEditModal(pigeon: Pigeon): void {
    this.selectedPigeon = pigeon;
    this.showEditModal = true;
    this.menuVisible = false;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedPigeon = null;
  }

  onPigeonSaved(pigeon: Pigeon): void {
    if (this.showAddModal) {
      this.pigeons.push(pigeon);
    } else if (this.showEditModal) {
      const index = this.pigeons.findIndex(p => p.id === pigeon.id);
      if (index !== -1) {
        this.pigeons[index] = pigeon;
      }
    }
    this.loadPigeons(); // Recharger pour mettre à jour la pagination
    this.closeModal();
  }

  openDetail(pigeon: Pigeon): void {
    this.selectedPigeon = pigeon;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedPigeon = null;
  }

  openDeleteConfirmation(pigeonId: number): void {
    this.pigeonToDeleteId = pigeonId;
    this.showDeleteConfirmation = true;
    this.menuVisible = false;
  }

  closeDeleteConfirmation(): void {
    this.pigeonToDeleteId = null;
    this.showDeleteConfirmation = false;
  }

  confirmDelete(): void {
    if (this.pigeonToDeleteId) {
      this.pigeonService.deletePigeon(this.pigeonToDeleteId).subscribe({
        next: () => {
          this.pigeons = this.pigeons.filter(p => p.id !== this.pigeonToDeleteId);
          this.closeDeleteConfirmation();
          this.notificationService.showNotification('Pigeon supprimé avec succès', 'success');
          this.loadPigeons();
        },
        error: (error) => {
          this.errorMessage = error;
          this.closeDeleteConfirmation();
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPigeons();
  }
}