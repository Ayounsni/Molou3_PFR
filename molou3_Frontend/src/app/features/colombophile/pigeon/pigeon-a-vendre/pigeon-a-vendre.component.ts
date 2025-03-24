import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { User } from '../../../../shared/models/user.model';
import { MarketplaceService } from '../../../../core/services/marketplace.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Marketplace } from '../../../../shared/models/marketplace.model';
import { Pigeon } from '../../../../shared/models/pigeon.model';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { DeleteConfirmationModalComponent } from '../../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { SellModifyModalComponent } from '../../../../shared/components/forms/marketplace/sell-modify-modal/sell-modify-modal.component';

@Component({
  selector: 'app-pigeon-a-vendre',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NotificationComponent,
    DeleteConfirmationModalComponent,
    SellModifyModalComponent
  ],
  templateUrl: './pigeon-a-vendre.component.html',
  styleUrls: ['./pigeon-a-vendre.component.css']
})
export class PigeonAVendreComponent implements OnInit {
  bg = 'assets/bg100.jpg';
  currentUser: User | null = null;
  marketplaces: Marketplace[] = [];
  menuVisible: boolean = false;
  selectedPigeonIdForMenu: number | null = null;
  image: string = 'assets/pardefaut.webp';

  // Propriétés pour le modal de confirmation
  showDeleteConfirmation: boolean = false;
  actionType: 'retirer' | 'vendu' | null = null;
  marketplaceIdToAction: number | null = null;

  // Propriétés pour le modal de modification
  showSellModal: boolean = false;
  selectedMarketplace: Marketplace | null = null;

  constructor(
    private marketplaceService: MarketplaceService,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  /** Charge l'utilisateur actuel depuis le store */
  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      console.log('Utilisateur actuel:', this.currentUser);
      if (this.currentUser) {
        this.loadMarketplaces();
      }
    });
  }

  /** Charge les marketplaces et filtre pour l'utilisateur actuel */
  loadMarketplaces(): void {
    this.marketplaceService.getAllMarketplaces().subscribe({
      next: (marketplaces) => {
        this.marketplaces = marketplaces.filter(m => 
          Number(m.pigeon?.colombophile?.id) === Number(this.currentUser?.id) && 
          m.statusVente === 'DISPONIBLE'
        );
        console.log('Marketplaces filtrés:', this.marketplaces);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des marketplaces', error);
      }
    });
  }

  /** Gère l'affichage du menu contextuel */
  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
    const target = event.currentTarget as HTMLElement;
    const pigeonId = target.closest('.relative')?.querySelector('input[name="pigeonId"]')?.getAttribute('value');
    this.selectedPigeonIdForMenu = pigeonId ? +pigeonId : null;
  }

  /** Ouvre le modal de confirmation pour retirer */
  openRetirerConfirmation(marketplaceId: number): void {
    this.actionType = 'retirer';
    this.marketplaceIdToAction = marketplaceId;
    this.showDeleteConfirmation = true;
  }

  /** Ouvre le modal de confirmation pour vendu */
  openVenduConfirmation(marketplaceId: number): void {
    this.actionType = 'vendu';
    this.marketplaceIdToAction = marketplaceId;
    this.showDeleteConfirmation = true;
  }

  /** Confirme l'action après la confirmation du modal */
  confirmAction(): void {
    if (this.actionType === 'retirer' && this.marketplaceIdToAction !== null) {
      this.retirerDuMarketplace(this.marketplaceIdToAction);
    } else if (this.actionType === 'vendu' && this.marketplaceIdToAction !== null) {
      this.marquerCommeVendu(this.marketplaceIdToAction);
    }
    this.closeDeleteConfirmation();
  }

  /** Ferme le modal de confirmation */
  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.actionType = null;
    this.marketplaceIdToAction = null;
  }

  /** Retire un pigeon du marketplace */
  retirerDuMarketplace(marketplaceId: number): void {
    this.marketplaceService.deleteMarketplace(marketplaceId).subscribe({
      next: () => {
        this.marketplaces = this.marketplaces.filter(m => m.id !== marketplaceId);
        this.notificationService.showNotification('Pigeon retiré', 'success');
      },
      error: (error) => {
        console.error('Erreur lors du retrait', error);
      }
    });
  }

  /** Marque un pigeon comme vendu */
  marquerCommeVendu(marketplaceId: number): void {
    this.marketplaceService.updateMarketplace(marketplaceId, { statusVente: 'VENDU' }).subscribe({
      next: (updatedMarketplace) => {
        this.marketplaces = this.marketplaces.map(m => 
          m.id === marketplaceId ? updatedMarketplace : m
        ).filter(m => m.statusVente === 'DISPONIBLE');
        this.notificationService.showNotification('Pigeon vendu', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
      }
    });
  }

  /** Ouvre le modal pour modifier le prix du pigeon */
  modifierPigeon(pigeon: Pigeon): void {
    const marketplace = this.marketplaces.find(m => m.pigeon?.id === pigeon.id);
    this.menuVisible = false;
    if (marketplace) {
      this.selectedMarketplace = marketplace;
      this.showSellModal = true;
    }
  }

  /** Gère la soumission du modal de modification */
  onSubmitSellModify(price: number): void {
    if (this.selectedMarketplace) {
      this.marketplaceService.updateMarketplace(this.selectedMarketplace.id!, { prix: price }).subscribe({
        next: (updatedMarketplace) => {
          this.marketplaces = this.marketplaces.map(m => 
            m.id === updatedMarketplace.id ? updatedMarketplace : m
          );
          this.notificationService.showNotification('Prix mis à jour', 'success');
          this.closeSellModal();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du prix', error);
          this.notificationService.showNotification('Erreur lors de la mise à jour', 'error');
        }
      });
    }
  }

  /** Ferme le modal de modification */
  closeSellModal(): void {
    this.showSellModal = false;
    this.selectedMarketplace = null;
  }

  get confirmationTitle(): string {
    return this.actionType === 'retirer' ? 'Confirmer le retrait' : 'Confirmer la vente';
  }

  get confirmationMessage(): string {
    return this.actionType === 'retirer' 
      ? 'Êtes-vous sûr de vouloir retirer ce pigeon du marketplace ?' 
      : 'Êtes-vous sûr de vouloir marquer ce pigeon comme vendu ?';
  }
}