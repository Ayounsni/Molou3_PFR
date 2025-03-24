import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Remplace FormsModule
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
  selector: 'app-pigeon-vendu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, PigeonDetailModalComponent], // Remplace FormsModule par ReactiveFormsModule
  templateUrl: './pigeon-vendu.component.html',
  styleUrls: ['./pigeon-vendu.component.css']
})
export class PigeonVenduComponent implements OnInit {
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
  menuVisible: boolean = false;
  selectedPigeonIdForMenu: number | null = null;
  showTransferModal: boolean = false;
  transferForm: FormGroup; // Formulaire réactif
  errorMessage: string | null = null; // Message d'erreur backend

  constructor(
    private pigeonService: PigeonService,
    private notificationService: NotificationService,
    private store: Store<AppState>,
    private fb: FormBuilder // Injecter FormBuilder
  ) {
    // Initialisation du formulaire
    this.transferForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

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
        this.pigeons = pageData.content.filter(p => p.statusPigeon === 'VENDU');
        this.filteredPigeons = [...this.pigeons];
        this.totalElements = this.pigeons.length;
        this.totalPages = Math.ceil(pageData.totalElements / this.pageSize);
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

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
    const target = event.currentTarget as HTMLElement;
    const pigeonId = target.closest('.relative')?.querySelector('input[name="pigeonId"]')?.getAttribute('value');
    this.selectedPigeonIdForMenu = pigeonId ? +pigeonId : null;
  }

  openTransferModal(pigeonId: number): void {
    this.menuVisible = false;
    const pigeon = this.pigeons.find(p => p.id === pigeonId);
    if (pigeon) {
      this.selectedPigeon = pigeon;
      this.showTransferModal = true;
      this.errorMessage = null; // Réinitialiser le message d'erreur
      this.transferForm.reset(); // Réinitialiser le formulaire
    }
  }

  closeTransferModal(): void {
    this.showTransferModal = false;
    this.errorMessage = null;
    this.transferForm.reset();
  }

  submitTransfer(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched(); // Marquer tous les champs comme touchés pour afficher les erreurs
      return;
    }
    if (!this.selectedPigeon) {
      this.errorMessage = 'Aucun pigeon sélectionné';
      return;
    }

    const email = this.transferForm.get('email')?.value;
    this.pigeonService.sendPigeonToOwner(email, this.selectedPigeon.id!).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response, 'success');
        this.loadPigeons();
        this.closeTransferModal();
      },
      error: (error) => {
        this.errorMessage = error; // Afficher le message d'erreur du backend
      }
    });
  }
}