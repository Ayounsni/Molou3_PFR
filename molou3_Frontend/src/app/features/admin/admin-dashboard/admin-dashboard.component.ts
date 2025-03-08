import { Component } from '@angular/core';
import { UploadService } from '../../../core/services/upload.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  safeFileUrl: SafeResourceUrl | null = null; // URL sécurisée pour l’iframe

  constructor(
    private uploadService: UploadService,
    private sanitizer: DomSanitizer
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.uploadService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          this.fileUrl = response.url; // URL brute
          this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl); // URL sécurisée
          console.log('Fichier uploadé : ', this.fileUrl);
        },
        error: (err) => console.error('Erreur : ', err)
      });
    }
  }
}