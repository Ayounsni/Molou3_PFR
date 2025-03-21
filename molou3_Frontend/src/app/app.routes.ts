import { ProgrammeDetailComponent } from './features/association/association-details/programme-detail/programme-detail.component';
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
import { ProfileDetailComponent } from './features/association/association-details/profile-detail/profile-detail.component';
import { AnnonceDetailComponent } from './features/association/association-details/annonce-detail/annonce-detail.component';
import { ParticipationDetailComponent } from './features/association/association-details/participation-detail/participation-detail.component';
import { PigeonComponent } from './features/colombophile/pigeon/pigeon.component';
import { PigeonDisponibleComponent } from './features/colombophile/pigeon/pigeon-disponible/pigeon-disponible.component';
import { PigeonPerduComponent } from './features/colombophile/pigeon/pigeon-perdu/pigeon-perdu.component';
import { PigeonVenduComponent } from './features/colombophile/pigeon/pigeon-vendu/pigeon-vendu.component';
import { PigeonAllComponent } from './features/colombophile/pigeon/pigeon-all/pigeon-all.component';
import { PigeonFavorisComponent } from './features/colombophile/pigeon/pigeon-favoris/pigeon-favoris.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'association/dashboard', component: AssociationDashboardComponent },
    { path: 'association/details/:id', component: AssociationDetailsComponent , children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Redirection par défaut vers le profil
      { path: 'profile', component: ProfileDetailComponent },
      { path: 'programme', component: ProgrammeDetailComponent },
      { path: 'annonce', component: AnnonceDetailComponent },
      { path: 'participation', component: ParticipationDetailComponent },
    ]},
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
          },
          {
            path: 'pigeon',
            component: PigeonComponent,
            children: [
              { path: '', redirectTo: 'all', pathMatch: 'full' }, // Redirection par défaut vers "disponible"
              { path: 'disponible', component: PigeonDisponibleComponent },
              { path: 'perdu', component: PigeonPerduComponent },
              { path: 'vendu', component: PigeonVenduComponent },
              { path: 'all', component: PigeonAllComponent },
            ]
          },
          {
            path: 'pigeons-favoris',
            component: PigeonFavorisComponent
          },
        ]
      },
      { path: '**', redirectTo: '' }

    
];
