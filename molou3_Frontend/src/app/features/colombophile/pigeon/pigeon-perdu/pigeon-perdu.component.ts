import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PigeonService } from '../../../../core/services/pigeon.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Pigeon } from '../../../../shared/models/pigeon.model';
import { User } from '../../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { PigeonDetailModalComponent } from '../../../../shared/components/pigeon-detail-modal/pigeon-detail-modal.component';

@Component({
  selector: 'app-pigeon-perdu',
  standalone: true,
  imports: [CommonModule, PaginationComponent, PigeonDetailModalComponent],
  templateUrl: './pigeon-perdu.component.html',
  styleUrls: ['./pigeon-perdu.component.css']
})
export class PigeonPerduComponent implements OnInit {
  pigeons: Pigeon[] = [];
  filteredPigeons: Pigeon[] = [];
  selectedPigeon: Pigeon | null = null;
  currentUser: User | null = null;
  currentPage = 1;
  pageSize = 1000;
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
        this.pigeons = pageData.content.filter(p => p.statusPigeon === 'PERDU');
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
}