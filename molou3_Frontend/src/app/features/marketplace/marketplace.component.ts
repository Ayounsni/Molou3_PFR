import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { WeatherService } from '../../core/services/weather.service'; // Ajout du service
import { Marketplace } from '../../shared/models/marketplace.model';
import { PageDTO } from '../../shared/models/dtos/page.model';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { MarketplaceDetailComponent } from '../../shared/components/marketplace-detail/marketplace-detail.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  imports: [CommonModule, PaginationComponent, FooterComponent, MarketplaceDetailComponent],
  standalone: true,
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
  bg = 'assets/marketplace3.jpg';
  image = 'assets/pardefaut.webp';
  showDetailModal = false;
  marketplaces: Marketplace[] = [];
  selectedMarketplace: Marketplace | null = null;
  currentPage = 1;
  pageSize = 6;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;

  // Variables pour les filtres
  ville: string = '';
  nationalite: string = '';
  sexe: string = '';
  prixMin?: number;
  prixMax?: number;

  // Variables pour l'état des checkboxes
  isMaleSelected: boolean = false;
  isFemaleSelected: boolean = false;

  // Autocomplétion pour ville
  villeSearchResults: any[] = [];
  showVilleSuggestions = false;
  private villeSearchTerms = new Subject<string>();

  // Autocomplétion pour nationalité
  nationaliteSearchResults: any[] = [];
  showNationaliteSuggestions = false;
  private nationaliteSearchTerms = new Subject<string>();

  constructor(
    private marketplaceService: MarketplaceService,
    private weatherService: WeatherService // Injecte le service
  ) {
    // Autocomplétion pour ville
    this.villeSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.weatherService.getAutocomplete(query))
    ).subscribe({
      next: (results) => {
        this.villeSearchResults = results;
        this.showVilleSuggestions = true;
      },
      error: (err) => {
        console.error('Erreur autocomplétion ville:', err);
        this.villeSearchResults = [];
        this.showVilleSuggestions = false;
      }
    });

    // Autocomplétion pour nationalité
    this.nationaliteSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.weatherService.getAutocomplete(query))
    ).subscribe({
      next: (results) => {
        this.nationaliteSearchResults = results;
        this.showNationaliteSuggestions = true;
      },
      error: (err) => {
        console.error('Erreur autocomplétion nationalité:', err);
        this.nationaliteSearchResults = [];
        this.showNationaliteSuggestions = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadMarketplaces();
  }

  loadMarketplaces(): void {
    this.marketplaceService.getAllMarketplacesPaginated(
      this.currentPage - 1,
      this.pageSize,
      'DISPONIBLE',
      this.ville,
      this.nationalite,
      this.sexe,
      this.prixMin,
      this.prixMax
    ).subscribe({
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

  // Méthodes pour gérer les filtres avec autocomplétion
  onVilleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.ville = value;
    if (value && value.length > 1) {
      this.villeSearchTerms.next(value);
    } else {
      this.villeSearchResults = [];
      this.showVilleSuggestions = false;
    }
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  selectVille(result: any): void {
    this.ville = result.name; // Sélectionne la ville
    this.showVilleSuggestions = false;
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  onNationaliteChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nationalite = value;
    if (value && value.length > 1) {
      this.nationaliteSearchTerms.next(value);
    } else {
      this.nationaliteSearchResults = [];
      this.showNationaliteSuggestions = false;
    }
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  selectNationalite(result: any): void {
    this.nationalite = result.country; // Sélectionne le pays
    this.showNationaliteSuggestions = false;
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.ville-container')) {
      this.showVilleSuggestions = false;
    }
    if (!(event.target as HTMLElement).closest('.nationalite-container')) {
      this.showNationaliteSuggestions = false;
    }
  }

  toggleSexe(sexe: string): void {
    if (sexe === 'MALE') {
      if (this.isMaleSelected) {
        this.isMaleSelected = false;
        this.sexe = '';
      } else {
        this.isMaleSelected = true;
        this.isFemaleSelected = false;
        this.sexe = 'MALE';
      }
    } else if (sexe === 'FEMELLE') {
      if (this.isFemaleSelected) {
        this.isFemaleSelected = false;
        this.sexe = '';
      } else {
        this.isFemaleSelected = true;
        this.isMaleSelected = false;
        this.sexe = 'FEMELLE';
      }
    }
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  onPrixMinChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.prixMin = value ? parseFloat(value) : undefined;
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  onPrixMaxChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.prixMax = value ? parseFloat(value) : undefined;
    this.currentPage = 1;
    this.loadMarketplaces();
  }

  openDetail(marketplace: Marketplace): void {
    this.selectedMarketplace = marketplace;
    this.showDetailModal = true;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.selectedMarketplace = null;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMarketplaces();
  }
}