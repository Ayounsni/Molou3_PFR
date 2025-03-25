import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { PageDTO } from '../../../shared/models/dtos/page.model';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Colombophile } from '../../../shared/models/colombophile.model';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";


@Component({
  selector: 'app-gestion-colombophile',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PaginationComponent, NotificationComponent],
  templateUrl: './gestion-colombophile.component.html',
  styleUrls: ['./gestion-colombophile.component.css']
})
export class GestionColombophileComponent implements OnInit {
  bg = 'assets/bg99.jpg';
  colombophiles: Colombophile[] = [];
  currentPage: number = 1; // Commencer à 1
  pageSize: number = 5;    // Taille de page
  totalPages: number = 0;
  totalElements: number = 0;
  isLastPage: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadColombophiles();
  }

  loadColombophiles(): void {
    this.authService.getAllColombophilesPaginated(this.currentPage - 1, this.pageSize).subscribe({
      next: (pageData: PageDTO<Colombophile>) => {
        this.colombophiles = pageData.content;
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        this.isLastPage = pageData.last;
        this.currentPage = pageData.pageNumber + 1; // Ajuster pour commencer à 1

        // Si aucun colombophile et page > 1, revenir à la page précédente
        if (this.colombophiles.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadColombophiles();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des colombophiles:', err);
        this.errorMessage = 'Impossible de charger les colombophiles.';
      }
    });
  }

  toggleColombophileStatus(colombophile: Colombophile): void {
    const updateDTO = { enabled: !colombophile.enabled };
    const originalEnabled = colombophile.enabled;

    colombophile.enabled = !colombophile.enabled; // Mise à jour optimiste

    this.authService.updateColombophile(colombophile.id, updateDTO).subscribe({
      next: (response) => {
        console.log('Mise à jour réussie:', response);
        this.notificationService.showNotification(
          `Colombophile ${colombophile.enabled ? 'réactivé' : 'suspendu'} avec succès`,
          'success'
        ); 
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        colombophile.enabled = originalEnabled; // Revenir à l’état initial
        this.errorMessage = 'Erreur lors de la mise à jour du statut.';
        this.notificationService.showNotification(this.errorMessage, 'error'); // Notification erreur
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadColombophiles();
  }
}