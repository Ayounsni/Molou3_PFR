import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Pigeon {
  id: string;
  serie: string;
  price: number;
  gender: 'Mâle' | 'Femelle';
  birthDate: string;
  nationality: string;
  seller: {
    name: string;
    location: string;
    email: string;
    phone: string;
  };
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  imports: [CommonModule],
  styleUrls: ['./marketplace.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('out', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in <=> out', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})

export class MarketplaceComponent {
  bg = 'assets/marketplace3.jpg';
  showDetailModal = false;
  showSellerInfo = false;

  // Exemple statique d'un pigeon
  pigeon: Pigeon = {
    id: 'PG-2345-X',
    serie: '#454825',
    price: 350,
    gender: 'Mâle',
    birthDate: '15/03/2022',
    nationality: 'Maroc',
    seller: {
      name: 'Jean Dupont',
      location: 'Casablanca, Maroc',
      email: 'jean.dupont@example.com',
      phone: '+212 6 12 34 56 78'
    }
  };

  openDetail(pigeon: Pigeon): void {
    this.showDetailModal = true;
    this.showSellerInfo = false;
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.showSellerInfo = false;
  }

  toggleSellerInfo(): void {
    this.showSellerInfo = !this.showSellerInfo;
  }
}