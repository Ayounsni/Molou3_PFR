import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { CommonModule, NgClass } from '@angular/common';
import { PigeonService } from '../../../core/services/pigeon.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Pigeon } from '../../../shared/models/pigeon.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-pigeon',
  standalone: true,
  imports: [NotificationComponent, SidebarComponent, FormsModule, CommonModule, RouterLink, RouterOutlet, NgClass],
  templateUrl: './pigeon.component.html',
  styleUrls: ['./pigeon.component.css']
})
export class PigeonComponent implements OnInit, OnDestroy {
  bg = 'assets/bg100.jpg';

  allCount = 0; 
  disponibleCount = 0;
  perduCount = 0;
  venduCount = 0;

  pigeons: Pigeon[] = [];
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private pigeonService: PigeonService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    window.addEventListener('pigeonAdded', this.handlePigeonAdded.bind(this));
    window.addEventListener('pigeonUpdated', this.handlePigeonUpdated.bind(this));
    window.addEventListener('pigeonDeleted', this.handlePigeonDeleted.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('pigeonAdded', this.handlePigeonAdded.bind(this));
    window.removeEventListener('pigeonUpdated', this.handlePigeonUpdated.bind(this));
    window.removeEventListener('pigeonDeleted', this.handlePigeonDeleted.bind(this));
  }

  loadCurrentUser(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.loadAllPigeons();
      }
    });
  }

  loadAllPigeons(): void {
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté');
      return;
    }

    const pageSize = 50;
    let allPigeons: Pigeon[] = [];
    let currentPage = 0;

    const loadPage = () => {
      this.pigeonService.getAllPigeons(currentPage, pageSize, this.currentUser!.id).subscribe({
        next: (pageData) => {
          allPigeons = allPigeons.concat(pageData.content);
          if (!pageData.last) {
            currentPage++;
            loadPage();
          } else {
            this.pigeons = allPigeons;
            this.updatePigeonCounts();
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des pigeons :', error);
        }
      });
    };

    loadPage();
  }

  updatePigeonCounts(): void {
    this.allCount = this.pigeons.length; // Total des pigeons
    this.disponibleCount = this.pigeons.filter(p => p.statusPigeon === 'DISPONIBLE').length;
    this.perduCount = this.pigeons.filter(p => p.statusPigeon === 'PERDU').length;
    this.venduCount = this.pigeons.filter(p => p.statusPigeon === 'VENDU').length;
  }

  handlePigeonAdded(event: Event): void {
    const customEvent = event as CustomEvent<Pigeon>;
    this.pigeons.push(customEvent.detail);
    this.updatePigeonCounts();
  }

  handlePigeonUpdated(event: Event): void {
    const customEvent = event as CustomEvent<Pigeon>;
    const updatedPigeon = customEvent.detail;
    const index = this.pigeons.findIndex(p => p.id === updatedPigeon.id);
    if (index !== -1) {
      this.pigeons[index] = updatedPigeon;
      this.updatePigeonCounts();
    }
  }

  handlePigeonDeleted(event: Event): void {
    const customEvent = event as CustomEvent<number>;
    this.pigeons = this.pigeons.filter(p => p.id !== customEvent.detail);
    this.updatePigeonCounts();
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(`/colombophile/pigeon/${route}`, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}