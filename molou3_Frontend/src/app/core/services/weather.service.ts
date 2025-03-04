import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string) {
    const params = new HttpParams()
      .set('key', environment.weatherApiKey)
      .set('q', city)
      .set('lang', 'fr');

    return this.http.get(`${environment.weatherApiUrl}/current.json`, { params });
  }

  getForecast(city: string, days: number = 3) {
    const params = new HttpParams()
      .set('key', environment.weatherApiKey)
      .set('q', city)
      .set('days', days.toString())
      .set('lang', 'fr')
      .set('aqi', 'yes')
      .set('alerts', 'yes');

    return this.http.get(`${environment.weatherApiUrl}/forecast.json`, { params });
  }

  getAutocomplete(query: string) {
    const params = new HttpParams()
      .set('key', environment.weatherApiKey)
      .set('q', query);
  
    return this.http.get<any[]>(`${environment.weatherApiUrl}/search.json`, { params });
  }
}