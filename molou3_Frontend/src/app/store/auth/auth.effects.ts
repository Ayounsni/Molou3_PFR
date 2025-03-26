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
  
            // Vérifier si le rôle est "ROLE_ASSOCIATION"
            if (response.role === 'ROLE_ASSOCIATION') {
              // Gérer les différents statuts d'inscription pour les associations
              switch (response.statusInscription) {
                case 'APPROVED':
                  // Connexion autorisée : stocker le token et rediriger
                  this.authService.setToken(response.token);
                  this.router.navigate([this.getDashboardRoute(response.role)]);
                  break;
                case 'PENDING':
                  // Pas de connexion : rediriger sans stocker le token
                  this.authService.clearToken();
                  this.router.navigate(['/association/pending']);
                  break;
                case 'REJECTED':
                  // Pas de connexion : rediriger sans stocker le token
                  this.authService.clearToken();
                  this.router.navigate(['/association/rejected']);
                  break;
                default:
                  console.error('Statut d\'inscription inconnu:', response.statusInscription);
                  this.authService.clearToken();
                  this.router.navigate(['/error']);
                  break;
              }
            } else {
              // Pour ROLE_ADMIN et ROLE_COLOMBOPHILE : connexion normale
              this.authService.setToken(response.token);
              this.router.navigate([this.getDashboardRoute(response.role)]);
            }
          }),
          map((response: LoginResponse) => {
            // Ne déclencher loginSuccess que pour ROLE_ADMIN, ROLE_COLOMBOPHILE ou ROLE_ASSOCIATION avec APPROVED
            if (response.role !== 'ROLE_ASSOCIATION' || response.statusInscription === 'APPROVED') {
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
            }
            // Pour ROLE_ASSOCIATION avec PENDING ou REJECTED : pas de loginSuccess
            return { type: '[Auth] No Action' };
          }),
          catchError((error: any) => {
            const errorMessage = error.error?.message || 'Une erreur inconnue est survenue lors de la connexion.';
            console.error('Erreur login:', error.error?.message);
            this.authService.clearToken();
            return of(AuthActions.loginFailure({ error: errorMessage }));
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

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap(({ id, updateDTO, photoFile, preuveLegaleFile }) =>
        this.authService.getCurrentUser().pipe(
          mergeMap((currentUser: LoginResponse) => {
            if (currentUser.role === 'ROLE_COLOMBOPHILE') {
              return this.authService.updateColombophile(id, updateDTO, photoFile).pipe(
                map((response) => {
                  const updatedUser: User = {
                    ...currentUser,
                    role: { roleName: currentUser.role }, // Garder la structure AppRole
                    nomComplet: response.nomComplet || currentUser.nomComplet,
                    dateNaissance: response.dateNaissance || currentUser.dateNaissance,
                    niveauExperience: response.niveauExperience || currentUser.niveauExperience,
                    adresse: response.adresse || currentUser.adresse,
                    ville: response.ville || currentUser.ville,
                    description: response.description || currentUser.description,
                    telephone: response.telephone || currentUser.telephone,
                    photoUrl: response.photoUrl || currentUser.photoUrl
                  };
                  return AuthActions.updateProfileSuccess({ user: updatedUser });
                })
              );
            } else if (currentUser.role === 'ROLE_ASSOCIATION') {
              return this.authService.updateAssociation(id, updateDTO, preuveLegaleFile, photoFile).pipe(
                map((response) => {
                  const updatedUser: User = {
                    ...currentUser,
                    role: { roleName: currentUser.role }, // Garder la structure AppRole
                    nomAssociation: response.nomAssociation || currentUser.nomAssociation,
                    responsable: response.responsable || currentUser.responsable,
                    dateCreation: response.dateCreation || currentUser.dateCreation,
                    adresse: response.adresse || currentUser.adresse,
                    ville: response.ville || currentUser.ville,
                    description: response.description || currentUser.description,
                    telephone: response.telephone || currentUser.telephone,
                    photoUrl: response.photoUrl || currentUser.photoUrl
                  };
                  return AuthActions.updateProfileSuccess({ user: updatedUser });
                })
              );
            }
            return of(AuthActions.updateProfileFailure({ error: 'Rôle non reconnu' }));
          }),
          catchError((error) => {
            console.error('Erreur lors de la mise à jour du profil:', error);
            return of(AuthActions.updateProfileFailure({ error: error.error?.message || 'Erreur lors de la mise à jour' }));
          })
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      mergeMap(({ oldPassword, newPassword }) =>
        this.authService.changePassword(oldPassword, newPassword).pipe(
          map((response) => AuthActions.changePasswordSuccess({ message: response })),
          catchError((error) => {
            console.error('Erreur lors du changement de mot de passe:', error);
            return of(AuthActions.changePasswordFailure({ error: error.error?.message || 'Erreur lors du changement de mot de passe' }));
          })
        )
      )
    )
  );

  private getDashboardRoute(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN': return '/admin/dashboard';
      case 'ROLE_COLOMBOPHILE': return '/profile';
      case 'ROLE_ASSOCIATION': return '/profile';
      default: return '/';
    }
  }
}