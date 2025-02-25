import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  image = 'assets/bird.png'; 
  logo= 'assets/molo.png';
  meteo= 'assets/meteo2.png';
  rank= 'assets/rank2.png';
  plan= 'assets/plan1.jpg';
  market= 'assets/market1.png';

}
