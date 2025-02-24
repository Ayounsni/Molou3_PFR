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
  image = 'assets/ciel.png'; 
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

  activateHoverEffect(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  }
  
}
