import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const LoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store<AppState>);

  // Vérifie d'abord le token dans le localStorage
  if (authService.getToken()) {
    return store.select(selectCurrentUser).pipe(
      filter(currentUser => currentUser !== null), // Attend que l'utilisateur soit chargé
      take(1), // Prend la première valeur émise
      map(currentUser => {
        if (currentUser) {
          return router.createUrlTree([getDashboardPath(currentUser.role?.roleName)]);
        }
        return router.createUrlTree(['/']); // Fallback si user non chargé
      })
    );
  }

  return true; // Permet l'accès si aucun token n'est trouvé
};

function getDashboardPath(role?: string): string {
  switch (role) {
    case 'ROLE_ADMIN': return '/admin/dashboard';
    case 'ROLE_ASSOCIATION': return '/association/dashboard';
    case 'ROLE_COLOMBOPHILE': return '/colombophile/dashboard';
    default: return '/';
  }
}