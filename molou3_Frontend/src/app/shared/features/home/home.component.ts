import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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


}
