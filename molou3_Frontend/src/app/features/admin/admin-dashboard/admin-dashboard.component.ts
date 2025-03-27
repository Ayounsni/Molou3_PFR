import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../shared/models/user.model';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { PigeonService } from '../../../core/services/pigeon.service';
import { MarketplaceService } from '../../../core/services/marketplace.service';
import { CompetitionService } from '../../../core/services/competition.service';
import { Association } from '../../../shared/models/association.model';
import { Pigeon } from '../../../shared/models/pigeon.model';
import { Marketplace } from '../../../shared/models/marketplace.model';
import { Competition } from '../../../shared/models/competition.model';
import { PageDTO } from '../../../shared/models/dtos/page.model';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent,RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  bg = 'assets/bg89.jpg';
  currentUser: User | null = null;

  totalAssociations: number = 0;
  totalColombophiles: number = 0;
  totalPigeons: number = 0;
  totalMarketplace: number = 0;

  recentCompetitions: Competition[] = [];
  pigeonsEnVente: Marketplace[] = [];
  associationsEnAttente: Association[] = [];

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private pigeonService: PigeonService,
    private marketplaceService: MarketplaceService,
    private competitionService: CompetitionService
  ) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    });

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      associations: this.authService.getAllAssociationsPaginated(0, 1000), 
      colombophiles: this.authService.getAllColombophilesPaginated(), 
      pigeons: this.pigeonService.getAllPigeons(0, 1000), 
      marketplaces: this.marketplaceService.getAllMarketplacesPaginated(0, 1000), 
      competitions: this.competitionService.getAllCompetitions(), 
      associationsPending: this.authService.getAllAssociationsPaginated(0, 1000) 
    }).subscribe({
      next: ({ associations, colombophiles, pigeons, marketplaces, competitions, associationsPending }) => {
        this.totalAssociations = associations.content.length;
        this.totalColombophiles = colombophiles.content.length; 
        this.totalPigeons = pigeons.content.length;
        this.totalMarketplace = marketplaces.content.length;

        this.recentCompetitions = competitions
          .sort((a, b) => new Date(b.competitionDate).getTime() - new Date(a.competitionDate).getTime())
          .slice(0, 3);

        this.pigeonsEnVente = marketplaces.content.filter(m => m.statusVente === 'DISPONIBLE').slice(0, 2);

        this.associationsEnAttente = associationsPending.content
          .filter(a => a.statusInscription === 'PENDING')
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données du dashboard:', err);
      }
    });
  }

  getAssociationInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
  }
}