import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PigeonDetailModalComponent } from '../../../../shared/components/pigeon-detail-modal/pigeon-detail-modal.component';
import { PigeonService } from '../../../../core/services/pigeon.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Pigeon } from '../../../../shared/models/pigeon.model';
import { User } from '../../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-pigeon-favoris',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NotificationComponent,
    PaginationComponent,
    PigeonDetailModalComponent
  ],
  templateUrl: './pigeon-favoris.component.html',
  styleUrls: ['./pigeon-favoris.component.css']
})
export class PigeonFavorisComponent implements OnInit {
  bg = 'assets/bg108.jpg';
  pigeons: Pigeon[] = [];
  filteredPigeons: Pigeon[] = [];
  selectedPigeon: Pigeon | null = null;
  currentUser: User | null = null;
  currentPage = 1;
  pageSize = 100;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;
  showDetailModal = false;
  image: string = 'assets/pardefaut.webp';

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
        this.pigeons = pageData.content.filter(p => p.estFavori === true);
        this.filteredPigeons = [...this.pigeons];
        this.totalElements = this.pigeons.length;
        this.totalPages = Math.ceil(pageData.totalElements / this.pageSize); // Approximation
        this.isLastPage = this.currentPage >= this.totalPages;

        if (this.pigeons.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadPigeons();
        }
      },
      error: (error) => {
        this.notificationService.showNotification('Erreur lors du chargement des pigeons', 'error');
      }
    });
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalElements);
    this.filteredPigeons = this.pigeons.slice(startIndex, endIndex);
    this.isLastPage = endIndex >= this.totalElements;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPigeons();
  }

  openDetail(pigeon: Pigeon): void {
    this.selectedPigeon = pigeon;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedPigeon = null;
  }

  toggleFavorite(pigeon: Pigeon): void {
    const updatedData = { estFavori: !pigeon.estFavori };
    this.pigeonService.updatePigeon(pigeon.id!, updatedData).subscribe({
      next: (response) => {
        const index = this.pigeons.findIndex(p => p.id === pigeon.id);
        if (index !== -1) {
          this.pigeons[index] = response;
          // Si le pigeon n'est plus favori, on le retire de la liste
          if (!response.estFavori) {
            this.pigeons.splice(index, 1);
            this.totalElements--;
            this.totalPages = Math.ceil(this.totalElements / this.pageSize);
          }
          this.applyPagination();
          window.dispatchEvent(new CustomEvent('pigeonUpdated', { detail: response }));
          this.notificationService.showNotification(
            `Pigeon ${response.estFavori ? 'ajouté aux' : 'retiré des'} favoris`,
            'success'
          );
        }
      },
      error: (error) => {
        this.notificationService.showNotification('Erreur lors de la mise à jour du favori', 'error');
      }
    });
  }
}