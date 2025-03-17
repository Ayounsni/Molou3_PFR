import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-association-dashboard',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './association-dashboard.component.html',
  styleUrl: './association-dashboard.component.css'
})
export class AssociationDashboardComponent implements OnInit {
  bg = 'assets/bg56.jpg';
  verified = 'assets/verified.png';
  currentPage = 1;
  pageSize = 6;
  totalPages = 2;
  totalElements = 0;
  isLastPage = false;

  constructor() {}

  ngOnInit() {

  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
