// src/app/marketplace/marketplace.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { Marketplace } from '../../shared/models/marketplace.model';
import { Pigeon } from '../../shared/models/pigeon.model';
import { PageDTO } from '../../shared/models/dtos/page.model';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  imports: [CommonModule, PaginationComponent, FooterComponent],
  standalone: true,
  styleUrls: ['./marketplace.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('out', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in <=> out', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class MarketplaceComponent implements OnInit {
  bg = 'assets/marketplace3.jpg';
  showDetailModal = false;
  showSellerInfo = false;
  marketplaces: Marketplace[] = [];
  selectedMarketplace: Marketplace | null = null; 
  currentPage = 1;
  pageSize = 6;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;

  constructor(private marketplaceService: MarketplaceService) {}

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
      error: (error) => {
        console.error('Erreur lors de la récupération des pigeons en vente', error);
      }
    });
  }

  openDetail(marketplace: Marketplace): void {
    this.selectedMarketplace = marketplace;
    this.showDetailModal = true;
    this.showSellerInfo = false;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedMarketplace = null;  }

  toggleSellerInfo(): void {
    this.showSellerInfo = !this.showSellerInfo;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMarketplaces();
  }

  getWhatsAppLink(): string {
    const phoneNumber = this.selectedMarketplace?.pigeon?.colombophile?.telephone;
    if (phoneNumber) {
      // Nettoie le numéro : supprime tout sauf les chiffres
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      return `https://wa.me/${cleanedNumber}`;
    }
    return '#'; // Lien par défaut si le numéro est absent
  }
}