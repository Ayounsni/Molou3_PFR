import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pigeon',
  standalone: true,
  imports: [NotificationComponent, SidebarComponent, FormsModule, CommonModule, RouterLink, RouterOutlet, NgClass],
  templateUrl: './pigeon.component.html',
  styleUrls: ['./pigeon.component.css']
})
export class PigeonComponent {
  bg = 'assets/bg100.jpg';

  constructor(private router: Router) {}

  // Vérifie si la route actuelle est active
  isRouteActive(route: string): boolean {
    return this.router.isActive(`colombophile/pigeon/${route}`, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}