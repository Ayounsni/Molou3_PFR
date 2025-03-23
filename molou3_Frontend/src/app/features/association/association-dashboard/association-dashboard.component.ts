import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../../core/services/auth.service'; // Assure-toi du bon chemin
import { Association } from '../../../shared/models/association.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Pour ngModel
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PageDTO } from '../../../shared/models/dtos/page.model';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-association-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink, FooterComponent],
  templateUrl: './association-dashboard.component.html',
  styleUrls: ['./association-dashboard.component.css']
})
export class AssociationDashboardComponent implements OnInit {
  bg = 'assets/bg56.jpg';
  verified = 'assets/verified.png';
  association = 'assets/assoc.jpg'
  associations: Association[] = [];
  currentPage = 0; // Commence à 0 pour le backend
  pageSize = 4; // Correspond à la valeur par défaut du backend
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;
  searchNomAssociation: string = '';
  searchVille: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadAssociations(); // Charge toutes les associations au démarrage
  }

  loadAssociations(page: number = 0) {
    this.authService.getAllAssociationsPaginated(page, this.pageSize).subscribe({
      next: (pageData: PageDTO<Association>) => {
        this.associations = pageData.content;
        this.currentPage = pageData.pageNumber;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.isLastPage = pageData.last;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des associations:', error);
      }
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchNomAssociation || this.searchVille) {
      this.searchAssociations();
    } else {
      this.loadAssociations(page);
    }
  }

  /**
   * Effectue la recherche des associations
   */
  searchAssociations() {
    const searchCriteria = {
      nomAssociation: this.searchNomAssociation || null,
      ville: this.searchVille || null
    };
    this.authService.searchAssociations(searchCriteria).subscribe({
      next: (associations: Association[]) => {
        this.associations = associations;
        // Pas de pagination pour la recherche, on affiche tout
        this.totalPages = 1;
        this.currentPage = 0;
        this.totalElements = associations.length;
        this.isLastPage = true;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des associations:', error);
      }
    });
  }

  /**
   * Gère les changements dans les champs de recherche (temps réel)
   */
  onSearchChange() {
    if (this.searchNomAssociation || this.searchVille) {
      this.searchAssociations();
    } else {
      this.loadAssociations(0);
    }
  }
}