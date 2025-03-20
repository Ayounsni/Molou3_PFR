import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pigeon-disponible',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pigeon-disponible.component.html',
  styleUrls: ['./pigeon-disponible.component.css']
})
export class PigeonDisponibleComponent {
  image = 'assets/bg20.jpg';
  searchQuery: string = '';
  isMaleChecked: boolean = false;
  isFemaleChecked: boolean = false;
  menuVisible: boolean = false;
  showDetailModal = false;
  selectedPigeon: any = null;

  pigeons = [{
    serieBague: '551123',
    sexe: 'MALE',
    dateNaissance: new Date('2022-03-15'),
    nationalite: 'Maroc',
    photoUrl: 'assets/bg20.jpg',
    statusPigeon: 'DISPONIBLE',
    estFavori: false
  }];

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuVisible = !this.menuVisible;
  }

  toggleGender(gender: string): void {
    if (gender === 'male') {
      this.isMaleChecked = !this.isMaleChecked;
      if (this.isMaleChecked) this.isFemaleChecked = false;
    } else if (gender === 'female') {
      this.isFemaleChecked = !this.isFemaleChecked;
      if (this.isFemaleChecked) this.isMaleChecked = false;
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.isMaleChecked = false;
    this.isFemaleChecked = false;
  }

  openDetail(pigeon: any) {
    this.selectedPigeon = pigeon;
    this.showDetailModal = true;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.selectedPigeon = null;
  }
}