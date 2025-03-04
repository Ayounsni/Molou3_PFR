import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';
import { Colombophile } from '../../shared/models/colombophile.model';
import { Association } from '../../shared/models/association.model';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  registerColombophile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerColombophile),
      mergeMap(({ data }) =>
        this.authService.registerColombophile(data).pipe(
          tap(response => console.log('Réponse réussie pour colombophile:', response)),
          map((user: Colombophile) => AuthActions.registerSuccess({ user })),
          catchError((error) => {
            console.error('Erreur API pour colombophile:', error);
            // Passer l'erreur complète, incluant la réponse du backend
            return of(AuthActions.registerFailure({ error: error.error || error }));
          })
        )
      )
    )
  );

  registerAssociation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerAssociation),
      mergeMap(({ data }) =>
        this.authService.registerAssociation(data).pipe(
          tap(response => console.log('Réponse réussie pour association:', response)),
          map((user: Association) => AuthActions.registerSuccess({ user })),
          catchError((error) => {
            console.error('Erreur API pour association:', error);
            // Passer l'erreur complète, incluant la réponse du backend
            return of(AuthActions.registerFailure({ error: error.error || error }));
          })
        )
      )
    )
  );
}