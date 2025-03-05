import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { WeatherComponent } from './features/weather/weather.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'meteo', component: WeatherComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
];
