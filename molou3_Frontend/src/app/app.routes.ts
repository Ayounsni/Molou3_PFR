import { Routes } from '@angular/router';
import { HomeComponent } from './shared/features/home/home.component';
import { WeatherComponent } from './shared/features/weather/weather.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'meteo', component: WeatherComponent },
];
