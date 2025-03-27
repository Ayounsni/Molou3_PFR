import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { Observable, of } from 'rxjs';
import { filter, take, timeout, map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRoles = route.data['roles'] as string[];

    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    this.store.dispatch(AuthActions.checkLogin());

    return this.store.select(selectCurrentUser).pipe(
      filter(currentUser => currentUser !== null), 
      take(1), 
      timeout(5000), 
      map(currentUser => {
        const userRole = currentUser!.role?.roleName;

        if (expectedRoles && !expectedRoles.includes(userRole!)) {
          this.router.navigate([getDashboardPath(userRole)]);
          return false;
        }

        return true;
      }),
      catchError(() => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}

function getDashboardPath(role?: string): string {
  switch (role) {
    case 'ROLE_ADMIN': return '/admin/dashboard';
    case 'ROLE_ASSOCIATION': return '/association/dashboard';
    case 'ROLE_COLOMBOPHILE': return '/colombophile/dashboard';
    default: return '/';
  }
}