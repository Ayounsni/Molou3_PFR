import { Routes } from '@angular/router';
import { HomeComponent } from './shared/features/home/home.component';
import { MeteoComponent } from './shared/features/meteo/meteo.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'meteo', component: MeteoComponent },
];
