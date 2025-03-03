import { Component, HostListener, LOCALE_ID, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { WeatherService } from '../../../core/services/weather.service';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

interface WeatherData {
  current: any;
  location: any;
  forecast: any;
}

registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-weather',
  imports: [FooterComponent,CommonModule,FormsModule],
  providers: [
    DatePipe, // Fournir DatePipe
    { provide: LOCALE_ID, useValue: 'fr' } // Configurer la locale française
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  weatherData!: WeatherData;
  forecastDays: any[] = [];
  searchQuery: string = 'Casablanca';
  isLoading: boolean = false;
  hasError: boolean = false;
  searchResults: any[] = [];
  showSuggestions = false;
  activeTab: 'today' | 'tomorrow' = 'today';
  private searchTerms = new Subject<string>();

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.getWeather();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.weatherService.getAutocomplete(query))
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSuggestions = true;
      },
      error: (err) => {
        this.searchResults = [];
        this.showSuggestions = false;
      }
    });
  }

  getTomorrowDate(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString();
  }

  clearSearch() {
    this.searchQuery = ''; 
    this.showSuggestions = false;
    this.searchResults = []; 
  }


  getUvIntensity(uv: number): string {
    if (uv <= 2) return 'Faible';
    if (uv <= 5) return 'Modéré';
    if (uv <= 7) return 'Élevé';
    if (uv <= 10) return 'Très élevé';
    return 'Extrême';
  }
  
  getAirQualityLabel(index: number): string {
    const qualityLabels = [
      'Excellente', // Index 1 de l'API
      'Bonne',      // Index 2
      'Modérée',    // Index 3
      'Médiocre',   // Index 4
      'Mauvaise',   // Index 5
      'Dangereuse'  // Index 6
    ];
    return qualityLabels[index - 1] || 'Inconnue';
  }

  onSearchInput() {
    if (this.searchQuery.length > 2) {
      this.searchTerms.next(this.searchQuery);
    } else {
      this.searchResults = [];
      this.showSuggestions = false;
    }
  }

  selectCity(city: any) {
    this.searchQuery = `${city.name}, ${city.region}, ${city.country}`;
    this.showSuggestions = false;
    this.getWeather();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      this.showSuggestions = false;
    }
  }

  

  getWeather() {
    this.isLoading = true;
    this.hasError = false;

    this.weatherService.getForecast(this.searchQuery,3).subscribe({
      next: (data: any) => {
        this.weatherData = data;
        this.processForecast(data.forecast);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  private processForecast(forecast: any) {
    this.forecastDays = forecast.forecastday.map((day: any) => ({
      date: day.date,
      day: {
        ...day.day,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon
        }
      },
      astro: day.astro
    }));
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.getWeather();
    }
  }
}

