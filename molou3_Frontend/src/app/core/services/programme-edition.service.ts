import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ProgrammeEdition } from '../../shared/models/programme-edition.model';
import { PageDTO } from '../../shared/models/dtos/page.model';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeEditionService {
  private apiUrl = `${environment.apiUrl}/public/programmeEdition`;

  constructor(private http: HttpClient) {}

  getAllProgrammeEditions(page: number = 0, size: number = 3, associationId?: number): Observable<PageDTO<ProgrammeEdition>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (associationId) {
      params = params.set('associationId', associationId.toString());
    }
  
    return this.http.get<PageDTO<ProgrammeEdition>>(this.apiUrl, { params }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la récupération des éditions');
      })
    );
  }

  createProgrammeEdition(data: any): Observable<ProgrammeEdition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ProgrammeEdition>(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la création de l\'édition');
      })
    );
  }

  updateProgrammeEdition(id: number, data: any): Observable<ProgrammeEdition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ProgrammeEdition>(`${this.apiUrl}/${id}`, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la mise à jour de l\'édition');
      })
    );
  }

  deleteProgrammeEdition(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la suppression de l\'édition');
      })
    );
  }

  getAllProgrammeEditionsAll(): Observable<ProgrammeEdition[]> {
     return this.http.get<ProgrammeEdition[]>(`${this.apiUrl}/all`).pipe(
         catchError(error => { 
            return throwError(() => error.error || 'Erreur lors de la récupération des éditions');
         }) );
         }
}