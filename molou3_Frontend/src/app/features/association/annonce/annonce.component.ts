import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../shared/components/sidebar/sidebar.component";
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-annonce',
  imports: [SidebarComponent, NotificationComponent, CommonModule, PaginationComponent],
  templateUrl: './annonce.component.html',
  styleUrl: './annonce.component.css'
})
export class AnnonceComponent implements OnInit {
  bg = 'assets/bg19.jpg';
  currentPage = 1;
  pageSize = 6;
  totalPages = 3;
  totalElements = 0;
  isLastPage = false;


  ngOnInit(): void {
    
  }


  onPageChange(page: number): void {
    this.currentPage = page;
  }

}
