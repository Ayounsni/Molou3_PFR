import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { Competition } from '../../shared/models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private apiUrl = `${environment.apiUrl}/public/competition`;

  constructor(private http: HttpClient) {}

  createCompetition(data: any): Observable<Competition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Competition>(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la création de la compétition');
      })
    );
  }

  updateCompetition(id: number, data: any, classementFile?: File): Observable<Competition> {
    const formData = new FormData();
    if (data) {
      formData.append('updateDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    }
    if (classementFile) {
      formData.append('classementFile', classementFile);
    }
    return this.http.put<Competition>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la mise à jour de la compétition');
      })
    );
  }

  deleteCompetition(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la suppression de la compétition');
      })
    );
  }

  deleteCompetitionClassement(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/competitionClassement/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la suppression du classement');
      })
    );
  }
}