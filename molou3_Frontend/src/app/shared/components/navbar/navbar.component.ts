import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  imagepath = 'assets/logo.png'; 
  image = 'assets/pingo.png'; 
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen) {
      // Vérifie si le clic est à l'intérieur du bouton ou du dropdown
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('.dropdown-trigger') || target.closest('.dropdown-menu');
      
      // Ferme le dropdown si le clic est en dehors
      if (!clickedInside) {
        this.isDropdownOpen = false;
      }
    }
  }
  
}
