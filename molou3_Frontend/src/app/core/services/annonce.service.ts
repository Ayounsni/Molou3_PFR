import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PageDTO } from '../../shared/models/dtos/page.model';
import { Annonce } from '../../shared/models/annonce.model';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private apiUrl = `${environment.apiUrl}/public/annonce`;

  constructor(private http: HttpClient) {}

  getAllAnnonces(page: number = 0, size: number = 3, associationId?: number): Observable<PageDTO<Annonce>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (associationId) {
      params = params.set('associationId', associationId.toString());
    }
  
    return this.http.get<PageDTO<Annonce>>(this.apiUrl, { params }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la récupération des annonces');
      })
    );
  }

  createAnnonce(data: any): Observable<Annonce> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Annonce>(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la création de l\'annonces');
      })
    );
  }

  updateAnnonce(id: number, data: any): Observable<Annonce> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Annonce>(`${this.apiUrl}/${id}`, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error || 'Erreur lors de la mise à jour de l\'annonces');
      })
    );
  }

  deleteAnnonce(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la suppression de l\'étape');
      })
    );
  }

  getAllAnnoncesAll(): Observable<Annonce[]> {
     return this.http.get<Annonce[]>(`${this.apiUrl}/all`).pipe(
         catchError(error => { 
            return throwError(() => error.error || 'Erreur lors de la récupération des annoncess');
         }) );
         }
}