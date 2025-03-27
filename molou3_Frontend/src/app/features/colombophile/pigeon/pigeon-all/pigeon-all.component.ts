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
import { PigeonDetailModalComponent } from '../../../../shared/components/pigeon-detail-modal/pigeon-detail-modal.component';
import { MarketplaceService } from '../../../../core/services/marketplace.service';
import { SellModifyModalComponent } from '../../../../shared/components/forms/marketplace/sell-modify-modal/sell-modify-modal.component';

@Component({
  selector: 'app-pigeon-all',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    DeleteConfirmationModalComponent,
    PigeonFormComponent,
    PigeonDetailModalComponent,
    SellModifyModalComponent
  ],
  templateUrl: './pigeon-all.component.html',
  styleUrls: ['./pigeon-all.component.css']
})
export class PigeonAllComponent implements OnInit {
  bg = 'assets/bg20.jpg';
  showAddModal = false;
  showEditModal = false;
  showDeleteConfirmation = false;
  showDetailModal = false;
  showSellModal = false;
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
  image: string = 'assets/pardefaut.webp';

  constructor(
    private pigeonService: PigeonService,
    private marketplaceService: MarketplaceService,
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

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalElements);
    this.filteredPigeons = this.pigeons.slice(startIndex, endIndex);
    this.isLastPage = endIndex >= this.totalElements;
    this.filterPigeons();
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
      if (this.isMaleChecked) this.isFemaleChecked = false;
    } else {
      this.isFemaleChecked = !this.isFemaleChecked;
      if (this.isFemaleChecked) this.isMaleChecked = false;
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
    this.selectedPigeon = null;
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
      this.totalElements++;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.applyPagination();
      window.dispatchEvent(new CustomEvent('pigeonAdded', { detail: pigeon }));
    } else if (this.showEditModal) {
      const index = this.pigeons.findIndex(p => p.id === pigeon.id);
      if (index !== -1) {
        this.pigeons[index] = pigeon;
        this.applyPagination();
      }
      window.dispatchEvent(new CustomEvent('pigeonUpdated', { detail: pigeon }));
    }
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
          this.totalElements--;
          this.totalPages = Math.ceil(this.totalElements / this.pageSize);
          this.applyPagination();
          this.closeDeleteConfirmation();
          this.notificationService.showNotification('Pigeon supprimé avec succès', 'success');
          window.dispatchEvent(new CustomEvent('pigeonDeleted', { detail: this.pigeonToDeleteId }));
        },
        error: (error) => {
          this.errorMessage = error;
          this.closeDeleteConfirmation();
        }
      });
    }
  }

  toggleFavorite(pigeon: Pigeon): void {
    const updatedData = { estFavori: !pigeon.estFavori };
    this.pigeonService.updatePigeon(pigeon.id!, updatedData).subscribe({
      next: (response) => {
        const index = this.pigeons.findIndex(p => p.id === pigeon.id);
        if (index !== -1) {
          this.pigeons[index] = response;
          this.applyPagination();
          window.dispatchEvent(new CustomEvent('pigeonUpdated', { detail: response }));
          this.notificationService.showNotification(
            `Pigeon ${response.estFavori ? 'ajouté aux' : 'retiré des'} favoris`,
            'success'
          );
        }
      },
      error: (error) => {
        this.errorMessage = error;
        this.notificationService.showNotification('Erreur lors de la mise à jour du favori', 'error');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPigeons();
  }

  openSellModal(pigeon: Pigeon): void {
    this.selectedPigeon = pigeon;
    this.showSellModal = true;
    this.menuVisible = false;
  }

  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedPigeon = null;
  }

  submitSell(price: number): void {
    if (this.selectedPigeon) {
      const createMarketplaceDTO = {
        pigeonId: this.selectedPigeon.id!,
        prix: price
      };
      this.marketplaceService.createMarketplace(createMarketplaceDTO).subscribe({
        next: (marketplace) => {
          this.notificationService.showNotification('Pigeon mis en vente avec succès', 'success');
          this.closeSellModal();
          this.loadPigeons(); 
        },
        error: (error) => {
          this.notificationService.showNotification('Erreur lors de la mise en vente', 'error');
        }
      });
    }
  }
}