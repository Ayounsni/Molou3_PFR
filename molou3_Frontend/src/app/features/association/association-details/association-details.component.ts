import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Association } from '../../../shared/models/association.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-association-details',
  imports: [RouterLink,RouterOutlet,NgClass],
  templateUrl: './association-details.component.html',
  styleUrl: './association-details.component.css'
})
export class AssociationDetailsComponent {
  bg = 'assets/bg56.jpg';
  associationImg = 'assets/assoc.jpg'
  associationId: number | null = null;
  association: Association | null = null; 
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.associationId = +id; 
        this.loadAssociationDetails(this.associationId);
      }
    });
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(`/association/details/${this.associationId}/${route}`, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
  loadAssociationDetails(id: number) {
    this.authService.getAssociationById(id).subscribe({
      next: (data: Association) => {
        this.association = data;
      },
      error: (error) => {
        console.error('Erreur API:', error);
      }
    });
  }


}
