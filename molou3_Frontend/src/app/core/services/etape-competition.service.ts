import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { EtapeCompetition } from '../../shared/models/etape-competition.model';

@Injectable({
  providedIn: 'root'
})
export class EtapeCompetitionService {
  private apiUrl = `${environment.apiUrl}/public/etapeCompetition`;

  constructor(private http: HttpClient) {}

  createEtapeCompetition(data: any): Observable<EtapeCompetition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<EtapeCompetition>(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la création de l\'étape');
      })
    );
  }

  updateEtapeCompetition(id: number, data: any, classementFile?: File): Observable<EtapeCompetition> {
    const formData = new FormData();
    if (data) {
      formData.append('updateDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    }
    if (classementFile) {
      formData.append('classementFile', classementFile); 
    }
    return this.http.put<EtapeCompetition>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la mise à jour de l\'étape');
      })
    );
  }

  deleteEtapeCompetition(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la suppression de l\'étape');
      })
    );
  }

  deleteEtapeClassement(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/etapeClassement/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la suppression du classement');
      })
    );
  }
}