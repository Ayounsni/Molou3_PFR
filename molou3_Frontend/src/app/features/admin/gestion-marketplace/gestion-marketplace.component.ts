import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MarketplaceService } from '../../../core/services/marketplace.service';
import { NotificationService } from '../../../core/services/notification.service'; // Assumé existant
import { PageDTO } from '../../../shared/models/dtos/page.model';
import { Marketplace } from '../../../shared/models/marketplace.model';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";

@Component({
  selector: 'app-gestion-marketplace',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PaginationComponent, NotificationComponent],
  templateUrl: './gestion-marketplace.component.html',
  styleUrls: ['./gestion-marketplace.component.css']
})
export class GestionMarketplaceComponent implements OnInit {
  bg = 'assets/bg89.jpg';
  marketplaces: Marketplace[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  isLastPage: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private marketplaceService: MarketplaceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadMarketplaces();
  }

  loadMarketplaces(): void {
    this.marketplaceService.getAllMarketplacesPaginated(this.currentPage - 1, this.pageSize).subscribe({
      next: (pageData: PageDTO<Marketplace>) => {
        this.marketplaces = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1;

        if (this.marketplaces.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadMarketplaces();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des marketplaces:', err);
        this.errorMessage = 'Impossible de charger les pigeons du marketplace.';
      }
    });
  }

  retirerDuMarketplace(marketplaceId: number | undefined): void {
    if (!marketplaceId) {
      console.error('ID du marketplace non défini');
      return;
    }
    this.marketplaceService.deleteMarketplace(marketplaceId).subscribe({
      next: () => {
        this.marketplaces = this.marketplaces.filter(m => m.id !== marketplaceId);
        this.totalElements--;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.notificationService.showNotification('Pigeon retiré du marketplace avec succès', 'success');
        if (this.marketplaces.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadMarketplaces();
        }
      },
      error: (error) => {
        console.error('Erreur lors du retrait du marketplace:', error);
        this.notificationService.showNotification('Erreur lors du retrait du pigeon', 'error');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMarketplaces();
  }
}