import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Association } from '../../../../shared/models/association.model';
import { AuthService } from '../../../../core/services/auth.service';


@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit {
  association: Association | null = null; 
  associationId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.associationId = +id;
        this.loadAssociationDetails(this.associationId);
      }
    });
  }

  loadAssociationDetails(id: number) {
    this.authService.getAssociationById(id).subscribe({
      next: (data: Association) => {
        this.association = data;
        console.log(this.association)
      },
      error: (error) => {
        console.error('Erreur API:', error);
      }
    });
  }
}