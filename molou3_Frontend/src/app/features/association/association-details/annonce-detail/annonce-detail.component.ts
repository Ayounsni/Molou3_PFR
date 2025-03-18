import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Association } from '../../../../shared/models/association.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Annonce } from '../../../../shared/models/annonce.model';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-annonce-detail',
  templateUrl: './annonce-detail.component.html',
  imports: [CommonModule, PaginationComponent],
  styleUrls: ['./annonce-detail.component.css']
})
export class AnnonceDetailComponent implements OnInit {
  association: Association | null = null;
  associationId: number | null = null;
  annonces: Annonce[] = []; 
  currentPage: number = 1;
  totalPages: number = 0;
  isLastPage: boolean = false;
  itemsPerPage: number = 2; 

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.associationId = +id;
        this.loadAssociationDetails(this.associationId);
      } else {
        console.error('Aucun ID trouvé dans l’URL parent');
      }
    });
  }

  loadAssociationDetails(id: number) {
    this.authService.getAssociationById(id).subscribe({
      next: (data: Association) => {
        this.association = data;
        this.updatePagination();
        console.log('Données de l’association:', this.association);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails de l’association:', error);
      }
    });
  }

  updatePagination() {
    if (this.association?.annonces) {
      this.totalPages = Math.ceil(this.association.annonces.length / this.itemsPerPage);
      this.isLastPage = this.currentPage >= this.totalPages;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.annonces = this.association.annonces.slice(startIndex, endIndex);
    } else {
      this.annonces = [];
      this.totalPages = 0;
      this.isLastPage = true;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }
}