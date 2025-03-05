import { AbstractControl } from '@angular/forms';

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