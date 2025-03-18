import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service'; // Ajuste le chemin selon ton projet
import { Association } from '../../shared/models/association.model';
import { PageDTO } from '../../shared/models/dtos/page.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  image = 'assets/image.png';
  logo = 'assets/molo.png';
  meteo = 'assets/meteo2.png';
  rank = 'assets/rank2.png';
  plan = 'assets/plan1.jpg';
  market = 'assets/market1.png';
  verified = 'assets/verified.png';

  associations: Association[] = []; // Remplace cyclists

  videoUrl: string = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  videoUrls: { title: string, safeUrl: SafeResourceUrl }[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService // Injection du service
  ) {}

  ngOnInit() {
    this.loadAssociations(); // Charge les associations au démarrage
    this.loadVideos(); // Charge les vidéos (fonction séparée pour clarté)
  }

  /**
   * Charge les associations depuis le backend et filtre pour celles avec photoUrl
   */
  loadAssociations() {
    this.authService.getAllAssociationsPaginated(0, 10).subscribe({ // On demande 10 pour avoir assez de données à filtrer
      next: (pageData: PageDTO<Association>) => {
        // Filtrer les associations avec photoUrl et limiter à 6
        this.associations = pageData.content
          .filter(association => association.photoUrl && association.photoUrl.trim() !== '')
          .slice(0, 6);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des associations:', error);
        this.associations = []; // En cas d'erreur, tableau vide
      }
    });
  }

  /**
   * Charge les URLs des vidéos YouTube
   */
  loadVideos() {
    const videos = [
      { title: "L’histoire fascinante des pigeons voyageurs", id: "XyAiAlG096g" },
      { title: "Comment entraîner un pigeon voyageur ?", id: "yS7b505Fwhc" },
      { title: "Les plus grandes courses de pigeons au monde", id: "TShLpROYX0o" },
      { title: "Bien nourrir et prendre soin de ses pigeons", id: "iw1pCCbz91s" },
      { title: "Les records incroyables des pigeons voyageurs", id: "Je4x6m9TfCs" },
      { title: "Les secrets des colombophiles professionnels", id: "lcE6qmlvVhw" }
    ];

    this.videoUrls = videos.map(video => ({
      title: video.title,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${video.id}`)
    }));
  }
}