import { Routes } from '@angular/router';
import { HomeComponent } from './shared/features/home/home.component';
import { WeatherComponent } from './shared/features/weather/weather.component';
import { RegisterComponent } from './shared/features/auth/register/register.component';
import { LoginComponent } from './shared/features/auth/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'meteo', component: WeatherComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
];
