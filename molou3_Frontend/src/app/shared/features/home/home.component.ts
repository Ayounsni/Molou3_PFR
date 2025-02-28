import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  image = 'assets/image.png'; 
  logo= 'assets/molo.png';
  meteo= 'assets/meteo2.png';
  rank= 'assets/rank2.png';
  plan= 'assets/plan1.jpg';
  market= 'assets/market1.png';
  verified = 'assets/verified.png';

  cyclists = [
    { name: 'Teniel Campbell', image: 'assets/association.png' },
    { name: 'Ayesha McGowan', image: 'assets/association.png' },
    { name: 'Kate Courtney', image: 'assets/association.png' },
    { name: 'Demi Vollering', image: 'assets/association.png' },
    { name: 'Demi Vollering', image: 'assets/association.png' },
    { name: 'Demi Vollering', image: 'assets/association.png' },
  ];

  videoUrl: string = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  videoUrls: { title: string, safeUrl: SafeResourceUrl }[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
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
