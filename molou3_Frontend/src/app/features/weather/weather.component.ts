import { Component, HostListener, LOCALE_ID, OnInit } from '@angular/core';

import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WeatherService } from '../../core/services/weather.service';

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
    DatePipe, 
    { provide: LOCALE_ID, useValue: 'fr' }
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
    this.forecastDays = [];
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

  getCompetitionCondition(): { message: string, color: string, icon: string } {
    if (!this.weatherData || !this.weatherData.current) {
      return {
        message: "Données météo non disponibles.",
        color: "bg-gray-500",
        icon: "fas fa-exclamation-circle"
      };
    }
  
    const isToday = this.activeTab === 'today';
  
    const wind = isToday ? this.weatherData.current.wind_kph : this.forecastDays[1]?.day.maxwind_kph;
    const visibility = isToday ? this.weatherData.current.vis_km : this.forecastDays[1]?.day.avgvis_km;
    const uv = isToday ? this.weatherData.current.uv : this.forecastDays[1]?.day.uv;
    const rainChance = isToday ? this.forecastDays[0]?.day.daily_chance_of_rain : this.forecastDays[1]?.day.daily_chance_of_rain;
    const airQuality = isToday ? this.weatherData.current.air_quality?.['us-epa-index'] : this.forecastDays[1]?.day.air_quality?.['us-epa-index'];
  
    if (
      wind > 30 ||
      visibility < 2 ||
      rainChance > 90 ||
      uv > 10 ||
      airQuality >= 5
    ) {
      return {
        message: "Dangereux : Compétition interdite " + (isToday ? "aujourd'hui." : "demain."),
        color: "bg-red-500",
        icon: "fas fa-exclamation-triangle"
      };
    }
    if (
      (wind >= 20 && wind <= 30) ||
      (visibility >= 2 && visibility <= 5) ||
      (rainChance >= 50 && rainChance <= 90) ||
      (uv >= 5 && uv <= 10) ||
      airQuality === 4
    ) {
      return {
        message: "Risqué : Compétition possible mais avec prudence " + (isToday ? "aujourd'hui." : "demain."),
        color: "bg-orange-400",
        icon: "fas fa-exclamation-circle"
      };
    }
    return {
      message: "Optimal : Bonnes conditions pour la compétition " + (isToday ? "aujourd'hui." : "demain."),
      color: "bg-green-500",
      icon: "fas fa-check-circle"
    };
  }
}

