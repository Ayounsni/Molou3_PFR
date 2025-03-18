import { AssociationDetailsComponent } from './features/association/association-details/association-details.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { WeatherComponent } from './features/weather/weather.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AssociationDashboardComponent } from './features/association/association-dashboard/association-dashboard.component';
import { ColombophileDashboardComponent } from './features/colombophile/colombophile-dashboard/colombophile-dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { EditionComponent } from './features/association/programme/edition/edition.component';
import { EtapeComponent } from './features/association/programme/etape/etape.component';
import { CompetitionComponent } from './features/association/programme/competition/competition.component';
import { ResultatComponent } from './features/association/programme/resultat/resultat.component';
import { AnnonceComponent } from './features/association/annonce/annonce.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'association/dashboard', component: AssociationDashboardComponent },
    { path: 'association/details', component: AssociationDetailsComponent },
    { path: 'meteo', component: WeatherComponent },
    { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
    { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_COLOMBOPHILE', 'ROLE_ASSOCIATION'] } },
        {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ADMIN'] },
        children: [
          {
            path: 'dashboard',
            component: AdminDashboardComponent
          }
        ]
      },
      {
        path: 'association',
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ASSOCIATION'] },
        children: [
          {
            path: 'dashboard',
            component: AssociationDashboardComponent
          },
          {
            path: 'edition',
            component: EditionComponent
          },
          {
            path: 'etape',
            component: EtapeComponent
          },
          {
            path: 'competition',
            component: CompetitionComponent
          },
          {
            path: 'resultat',
            component: ResultatComponent
          },
          {
            path: 'annonce',
            component: AnnonceComponent
          }
        ]
      },
      {
        path: 'colombophile',
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_COLOMBOPHILE'] },
        children: [
          {
            path: 'dashboard',
            component: ColombophileDashboardComponent
          }
        ]
      },
      { path: '**', redirectTo: '' }

    
];
