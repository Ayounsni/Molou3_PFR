import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Marketplace } from '../../models/marketplace.model';

@Component({
  selector: 'app-marketplace-detail',
  templateUrl: './marketplace-detail.component.html',
  styleUrls: ['./marketplace-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('out', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('in <=> out', [animate('300ms ease-in-out')])
    ])
  ]
})
export class MarketplaceDetailComponent {
  @Input() selectedMarketplace: Marketplace | null = null; // Reçu du parent
  @Input() showDetailModal: boolean = false; // Contrôle la visibilité du modal
  @Output() close = new EventEmitter<void>(); // Émetteur pour fermer le modal
  @Output() toggleSeller = new EventEmitter<void>(); // Émetteur pour basculer les infos vendeur

  showSellerInfo: boolean = false; // État local pour les infos vendeur
  bg = 'assets/pardefaut.webp'; // Image par défaut

  closeDetail(): void {
    this.close.emit();
  }

  toggleSellerInfo(): void {
    this.showSellerInfo = !this.showSellerInfo;
    this.toggleSeller.emit();
  }

  getWhatsAppLink(): string {
    const phoneNumber = this.selectedMarketplace?.pigeon?.colombophile?.telephone;
    if (phoneNumber) {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      return `https://wa.me/${cleanedNumber}`;
    }
    return '#';
  }
}