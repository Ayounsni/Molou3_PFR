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

  if (authService.getToken()) {
    return store.select(selectCurrentUser).pipe(
      filter(currentUser => currentUser !== null), 
      take(1), 
      map(currentUser => {
        if (currentUser) {
          return router.createUrlTree([getDashboardPath(currentUser.role?.roleName)]);
        }
        return router.createUrlTree(['/']); 
      })
    );
  }

  return true; 
};

function getDashboardPath(role?: string): string {
  switch (role) {
    case 'ROLE_ADMIN': return '/admin/dashboard';
    case 'ROLE_ASSOCIATION': return '/association/dashboard';
    case 'ROLE_COLOMBOPHILE': return '/colombophile/dashboard';
    default: return '/';
  }
}