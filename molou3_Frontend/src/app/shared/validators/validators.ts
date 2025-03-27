import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { catchError, map, Observable, of } from 'rxjs';

export function notInFuture(control: AbstractControl): { [key: string]: boolean } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const inputDate = new Date(control.value);
  return inputDate > today ? { futureDate: true } : null;
}

export function notTodayOrFuture(control: AbstractControl): { [key: string]: boolean } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const inputDate = new Date(control.value);
  return inputDate >= today ? { todayOrFutureDate: true } : null;
}

export function uniqueEmailValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email) return of(null);
  
      return authService.getAllUsers().pipe(
        map(users => {
          const emailExists = users.some(user => user.email === email);
          return emailExists ? { emailExists: true } : null;
        }),
        catchError(() => of(null)) 
      );
    };
  }