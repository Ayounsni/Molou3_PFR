import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  imagepath = 'assets/logo1.png'; 
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen) {
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('.dropdown-trigger') || target.closest('.dropdown-menu');  
      if (!clickedInside) {
        this.isDropdownOpen = false;
      }
    }
  }

}
