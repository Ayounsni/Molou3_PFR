import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment'; 
import { ProgrammeEdition } from '../../shared/models/programme-edition.model';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeEditionService {
  private apiUrl = `${environment.apiUrl}/public/programmeEdition`;

  constructor(private http: HttpClient) {}

  // Créer une nouvelle édition
  createProgrammeEdition(data: any): Observable<ProgrammeEdition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ProgrammeEdition>(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la création de l\'édition');
      })
    );
  }

  // Récupérer toutes les éditions
  getAllProgrammeEditions(): Observable<ProgrammeEdition[]> {
    return this.http.get<ProgrammeEdition[]>(`${this.apiUrl}/all`).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la récupération des éditions');
      })
    );
  }

  // Mettre à jour une édition
  updateProgrammeEdition(id: number, data: any): Observable<ProgrammeEdition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ProgrammeEdition>(`${this.apiUrl}/${id}`, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la mise à jour de l\'édition');
      })
    );
  }

  // Supprimer une édition
  deleteProgrammeEdition(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la suppression de l\'édition');
      })
    );
  }
}