import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { AgendaEvent } from '../../shared/models/agenda-event.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaEventService {
  private apiUrl = `${environment.apiUrl}/public/agendaEvent`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les événements
  getAllAgendaEvents(): Observable<AgendaEvent[]> {
    return this.http.get<AgendaEvent[]>(`${this.apiUrl}/all`).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la récupération des événements'))
    );
  }

  // Créer un nouvel événement
  createAgendaEvent(eventData: any): Observable<AgendaEvent> {
    return this.http.post<AgendaEvent>(this.apiUrl, eventData).pipe(
      catchError(error => {
        if (error.error && error.error.message) {
          return throwError(() => error.error.message);
        }
        return throwError(() => 'Erreur lors de la création de l\'événement');
      })
    );
  }

  // Récupérer un événement par ID
  getAgendaEventById(id: number): Observable<AgendaEvent> {
    return this.http.get<AgendaEvent>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la récupération de l\'événement'))
    );
  }

  // Supprimer un événement
  deleteAgendaEvent(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la suppression de l\'événement'))
    );
  }

  // Mettre à jour un événement
  updateAgendaEvent(id: number, eventData: any): Observable<AgendaEvent> {
    return this.http.put<AgendaEvent>(`${this.apiUrl}/${id}`, eventData).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la mise à jour de l\'événement'))
    );
  }
}