import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { Colombophile } from '../../shared/models/colombophile.model';
import { Association } from '../../shared/models/association.model';
import { User } from '../../shared/models/user.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerColombophile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerColombophile),
      mergeMap(({ data, photo }) =>
        this.authService.registerColombophile(data, photo).pipe(
          tap(response => console.log('Réponse réussie pour colombophile:', response)),
          map((user: Colombophile) => AuthActions.registerSuccess({ user })),
          catchError((error) => {
            console.error('Erreur API pour colombophile:', error);
            return of(AuthActions.registerFailure({ error: error.error?.message || error.message || 'Erreur inconnue' }));
          })
        )
      )
    )
  );

  registerAssociation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerAssociation),
      mergeMap(({ data, preuveLegale, logo }) =>
        this.authService.registerAssociation(data, preuveLegale, logo).pipe(
          tap(response => console.log('Réponse réussie pour association:', response)),
          map((user: Association) => AuthActions.registerSuccess({ user })),
          catchError((error) => {
            console.error('Erreur API pour association:', error);
            return of(AuthActions.registerFailure({ error: error.error?.message || error.message || 'Erreur inconnue' }));
          })
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          tap((response) => {
            console.log('Login réussi, token:', response.token);
            this.authService.setToken(response.token);
            this.router.navigate([this.getDashboardRoute(response.role)]);
          }),
          map((response: LoginResponse) => {
            const user: User = {
              id: response.id,
              email: response.email,
              password: '',
              role: { roleName: response.role } as any,
              ville: response.ville,
              telephone: response.telephone,
              photoUrl: response.photoUrl,
              adresse: response.adresse,
              description: response.description,
              enabled: response.enabled,
              nomComplet: response.nomComplet,
              niveauExperience: response.niveauExperience,
              dateNaissance: response.dateNaissance,
              nomAssociation: response.nomAssociation,
              responsable: response.responsable,
              dateCreation: response.dateCreation,
              statusInscription: response.statusInscription,
              preuveLegalePath: response.preuveLegalePath
            };
            return AuthActions.loginSuccess({
              user,
              token: response.token
            });
          }),
          catchError((error) => {
            console.error('Erreur login:', error);
            this.authService.clearToken();
            return of(AuthActions.loginFailure({ error: 'Email ou mot de passe incorrect' }));
          })
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  checkLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      mergeMap(() => {
        const token = this.authService.getToken();
        console.log('CheckLogin - Token trouvé dans localStorage:', token);
        if (!token) {
          console.log('Aucun token trouvé, pas de restauration de session');
          return of({ type: '[Auth] No Action' });
        }
        return this.authService.getCurrentUser().pipe(
          tap((response) => console.log('Réponse getCurrentUser:', response)),
          timeout(5000),
          map((response: LoginResponse) => {
            const user: User = {
              id: response.id,
              email: response.email,
              password: '',
              role: { roleName: response.role } as any,
              ville: response.ville,
              telephone: response.telephone,
              photoUrl: response.photoUrl,
              adresse: response.adresse,
              description: response.description,
              enabled: response.enabled,
              nomComplet: response.nomComplet,
              niveauExperience: response.niveauExperience,
              dateNaissance: response.dateNaissance,
              nomAssociation: response.nomAssociation,
              responsable: response.responsable,
              dateCreation: response.dateCreation,
              statusInscription: response.statusInscription,
              preuveLegalePath: response.preuveLegalePath
            };
            console.log('Utilisateur restauré:', user);
            return AuthActions.loginSuccess({ user, token });
          }),
          catchError((error) => {
            console.error('Erreur getCurrentUser:', error);
            this.authService.clearToken();
            return of(AuthActions.loginFailure({ error: error.error?.message || 'Erreur de récupération de l’utilisateur' }));
          })
        );
      })
    )
  );

  private getDashboardRoute(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN': return '/admin/dashboard';
      case 'ROLE_COLOMBOPHILE': return '/colombophile/dashboard';
      case 'ROLE_ASSOCIATION': return '/association/dashboard';
      default: return '/';
    }
  }
}