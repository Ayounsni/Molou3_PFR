import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { AnnonceService } from '../../../core/services/annonce.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Annonce } from '../../../shared/models/annonce.model';
import { User } from '../../../shared/models/user.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { DeleteConfirmationModalComponent } from "../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AnnonceFormComponent } from '../../../shared/components/forms/annonce/annonce-form/annonce-form.component';

@Component({
  selector: 'app-annonce',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    NotificationComponent,
    AnnonceFormComponent,
    DeleteConfirmationModalComponent,
    PaginationComponent
  ],
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.css']
})
export class AnnonceComponent implements OnInit {
  bg = 'assets/bg19.jpg';
  showAnnonceModal = false;
  annonces: Annonce[] = [];
  currentUser: User | null = null;
  currentAnnonce: Annonce | null = null;
  showDeleteConfirmation = false;
  annonceToDeleteId: number | null = null;
  errorMessage: string | null = null;
  currentPage = 1;
  pageSize = 3;
  totalPages = 0;
  totalElements = 0;
  isLastPage = false;

  constructor(
    private annonceService: AnnonceService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      console.log('Current User:', user);
      this.currentUser = user;
      if (this.currentUser) {
        this.loadAnnonces();
      }
    });
  }

  loadAnnonces(): void {
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté');
      return;
    }
    this.annonceService.getAllAnnonces(this.currentPage - 1, this.pageSize, this.currentUser.id).subscribe({
      next: (pageData) => {
        console.log('Données paginées du backend:', pageData);
        this.annonces = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.pageSize = pageData.pageSize;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1;

        if (this.annonces.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadAnnonces();
        }
        console.log('Annonces chargées:', this.annonces);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des annonces:', error);
        this.errorMessage = 'Erreur lors du chargement des annonces';
        this.notificationService.showNotification(this.errorMessage, 'error');
      }
    });
  }

  openAnnonceModal(annonce?: Annonce): void {
    this.showAnnonceModal = true;
    this.currentAnnonce = annonce || null;
    this.errorMessage = null;
  }

  closeAnnonceModal(): void {
    this.showAnnonceModal = false;
    this.currentAnnonce = null;
  }

  handleAnnonceSaved(annonce: Annonce): void {
    if (this.currentAnnonce) {
      const index = this.annonces.findIndex(a => a.id === annonce.id);
      if (index !== -1) {
        this.annonces[index] = annonce;
      }
    } else {
      this.annonces.push(annonce);
    }
    this.annonces = [...this.annonces];
    this.loadAnnonces(); 
  }

  openDeleteConfirmation(annonceId: number | undefined): void {
    if (annonceId !== undefined) {
      this.annonceToDeleteId = annonceId;
      this.showDeleteConfirmation = true;
    } else {
      console.error('Impossible de supprimer : ID de l\'annonce non défini');
      this.errorMessage = 'Erreur : Cette annonce ne peut pas être supprimée (ID manquant)';
      this.notificationService.showNotification(this.errorMessage, 'error');
    }
  }

  closeDeleteConfirmation(): void {
    this.annonceToDeleteId = null;
    this.showDeleteConfirmation = false;
  }

  confirmDelete(): void {
    if (this.annonceToDeleteId && this.currentUser) {
      this.annonceService.deleteAnnonce(this.annonceToDeleteId).subscribe({
        next: () => {
          this.notificationService.showNotification('Annonce supprimée avec succès', 'success');
          this.closeDeleteConfirmation();
          this.loadAnnonces();
        },
        error: (error) => {
          this.errorMessage = error || 'Erreur lors de la suppression';
          this.closeDeleteConfirmation();
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAnnonces();
  }
}