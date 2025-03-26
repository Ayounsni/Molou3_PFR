import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Association } from '../../../shared/models/association.model';
import { PageDTO } from '../../../shared/models/dtos/page.model';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

export type StatusInscription = 'PENDING' | 'APPROVED' | 'REJECTED';

@Component({
  selector: 'app-verification-associations',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PaginationComponent, NotificationComponent],
  templateUrl: './verification-associations.component.html',
  styleUrls: ['./verification-associations.component.css']
})
export class VerificationAssociationsComponent implements OnInit {
  bg = 'assets/bg89.jpg';
  associations: Association[] = [];
  currentPage: number = 1; // Commencer à 1
  pageSize: number = 5;    // Taille de page
  totalPages: number = 0;
  totalElements: number = 0;
  isLastPage: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAssociations();
  }

  loadAssociations(): void {
    this.authService.getAllAssociationsPaginated(this.currentPage - 1, this.pageSize).subscribe({
      next: (pageData: PageDTO<Association>) => {
        this.associations = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1; // Ajuster pour commencer à 1
      },
      error: (err) => {
        console.error('Erreur lors du chargement des associations:', err);
        this.errorMessage = 'Impossible de charger les associations.';
        this.notificationService.showNotification(this.errorMessage, 'error');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAssociations();
  }

  approveAssociation(association: Association): void {
    const updateDTO = { statusInscription: 'APPROVED' as StatusInscription };
    this.updateAssociationStatus(association, updateDTO, 'approuvée');
  }

  rejectAssociation(association: Association): void {
    const updateDTO = { statusInscription: 'REJECTED' as StatusInscription };
    this.updateAssociationStatus(association, updateDTO, 'rejetée');
  }

  private updateAssociationStatus(association: Association, updateDTO: any, action: string): void {
    const originalStatus = association.statusInscription;
    association.statusInscription = updateDTO.statusInscription;

    this.authService.updateAssociation(association.id, updateDTO).subscribe({
      next: (response) => {
        console.log('Mise à jour réussie:', response);
        this.notificationService.showNotification(
          `Association ${action} avec succès`,
          'success'
        );
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du statut.';
        this.notificationService.showNotification(this.errorMessage, 'error');
        association.statusInscription = originalStatus; // Restauration en cas d’erreur
      }
    });
  }
}