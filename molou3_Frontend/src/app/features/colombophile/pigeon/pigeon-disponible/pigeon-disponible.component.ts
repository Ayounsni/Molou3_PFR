// src/app/features/pigeon-disponible/pigeon-disponible.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { PigeonService } from '../../../../core/services/pigeon.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Pigeon} from '../../../../shared/models/pigeon.model';
import { User } from '../../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-pigeon-disponible',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    DeleteConfirmationModalComponent
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
  pageSize = 4;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;

  searchQuery: string = '';
  isMaleChecked: boolean = false;
  isFemaleChecked: boolean = false;
  menuVisible: boolean = false;
  selectedPigeonIdForMenu: number | null = null;
  image: string = 'assets/pigeon-placeholder.jpg'; // Image par défaut

  pigeonForm: FormGroup;
  photoFile: File | undefined;

  constructor(
    private pigeonService: PigeonService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {
    this.pigeonForm = this.fb.group({
      serieBague: ['', [Validators.required, Validators.minLength(3)]],
      sexe: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      nationalite: ['', Validators.required],
      photoUrl: [''],
      statusPigeon: ['']
    });
  }

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
        // this.notificationService.showNotification(this.errorMessage, 'error');
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
    this.filterPigeons();
  }

  toggleGender(gender: 'male' | 'female'): void {
    if (gender === 'male') {
      this.isMaleChecked = !this.isMaleChecked;
    } else {
      this.isFemaleChecked = !this.isFemaleChecked;
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
    this.pigeonForm.reset();
    this.photoFile = undefined;
    this.pigeonForm.get('statusPigeon')?.disable();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.pigeonForm.get('statusPigeon')?.enable();
  }

  openEditModal(pigeon: Pigeon): void {
    this.selectedPigeon = pigeon;
    this.showEditModal = true;
    this.pigeonForm.patchValue({
      serieBague: pigeon.serieBague,
      sexe: pigeon.sexe,
      dateNaissance: pigeon.dateNaissance,
      nationalite: pigeon.nationalite,
      photoUrl: pigeon.photoUrl,
      statusPigeon: pigeon.statusPigeon
    });
    this.pigeonForm.get('statusPigeon')?.enable();
    this.photoFile = undefined;
    this.menuVisible = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedPigeon = null;
  }

  openDetail(pigeon: Pigeon): void {
    this.selectedPigeon = pigeon;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedPigeon = null;
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.photoFile = event.target.files[0];
    }
  }

  submitPigeon(): void {
    if (this.pigeonForm.valid && this.currentUser) {
      const formValue = this.pigeonForm.value;
      const pigeonData = {
        serieBague: formValue.serieBague,
        sexe: formValue.sexe,
        dateNaissance: formValue.dateNaissance,
        nationalite: formValue.nationalite,
        photoUrl: formValue.photoUrl,
        colombophileId: this.currentUser.id,
        ...(this.showEditModal && { statusPigeon: formValue.statusPigeon })
      };

      if (this.showAddModal) {
        this.pigeonService.createPigeon(pigeonData, this.photoFile).subscribe({
          next: (newPigeon) => {
            this.pigeons.push(newPigeon);
            this.closeAddModal();
            this.notificationService.showNotification('Pigeon ajouté avec succès', 'success');
            this.loadPigeons();
          },
          error: (error) => {
            this.errorMessage = error;
            // this.notificationService.showNotification(this.errorMessage, 'error');
          }
        });
      } else if (this.showEditModal && this.selectedPigeon?.id) {
        this.pigeonService.updatePigeon(this.selectedPigeon.id, pigeonData, this.photoFile).subscribe({
          next: (updatedPigeon) => {
            const index = this.pigeons.findIndex(p => p.id === updatedPigeon.id);
            if (index !== -1) {
              this.pigeons[index] = updatedPigeon;
            }
            this.closeEditModal();
            this.notificationService.showNotification('Pigeon modifié avec succès', 'success');
            this.loadPigeons();
          },
          error: (error) => {
            this.errorMessage = error;
            // this.notificationService.showNotification(this.errorMessage, 'error');
          }
        });
      }
    }
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
          // this.notificationService.showNotification(this.errorMessage, 'error');
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