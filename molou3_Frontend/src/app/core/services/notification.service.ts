import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Renommer l'interface pour éviter le conflit
export interface FlashMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<FlashMessage | null>(null);
  notification$: Observable<FlashMessage | null> = this.notificationSubject.asObservable();

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000): void {
    this.notificationSubject.next({ message, type });
    setTimeout(() => {
      this.clearNotification();
    }, duration);
  }

  clearNotification(): void {
    this.notificationSubject.next(null);
  }
}