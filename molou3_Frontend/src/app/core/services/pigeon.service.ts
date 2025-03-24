// src/app/core/services/pigeon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { Pigeon } from '../../shared/models/pigeon.model';
import { PageDTO } from '../../shared/models/dtos/page.model';

@Injectable({
  providedIn: 'root'
})
export class PigeonService {
  private apiUrl = `${environment.apiUrl}/public/pigeon`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les pigeons avec pagination et filtrage par colombophileId
  getAllPigeons(page: number = 0, size: number = 6, colombophileId?: number): Observable<PageDTO<Pigeon>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (colombophileId) {
      params = params.set('colombophileId', colombophileId.toString());
    }
    return this.http.get<PageDTO<Pigeon>>(this.apiUrl, { params }).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la récupération des pigeons'))
    );
  }

  createPigeon(data: any, photoFile?: File): Observable<Pigeon> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (photoFile) {
      formData.append('photo', photoFile, photoFile.name);
    }
    return this.http.post<Pigeon>(this.apiUrl, formData).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la création du pigeon'))
    );
  }

  // Mettre à jour un pigeon (adapté au même style)
  updatePigeon(id: number, data: any, photoFile?: File): Observable<Pigeon> {
    const formData = new FormData();
    if (data) {
      formData.append('updateDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    }
    if (photoFile) {
      formData.append('photo', photoFile, photoFile.name);
    }
    return this.http.put<Pigeon>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la mise à jour du pigeon'))
    );
  }

  // Supprimer un pigeon
  deletePigeon(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        return throwError(() => error.error?.message || 'Erreur lors de la suppression du pigeon');
      })
    );
  }

  // Récupérer un pigeon par ID
  getPigeonById(id: number): Observable<Pigeon> {
    return this.http.get<Pigeon>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la récupération du pigeon'))
    );
  }

  sendPigeonToOwner(email: string, pigeonId: number): Observable<string> {
    let params = new HttpParams()
      .set('email', email)
      .set('pigeonId', pigeonId.toString());
    return this.http.post<string>(`${this.apiUrl}/send`, null, { params, responseType: 'text' as 'json' }).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors du transfert du pigeon'))
    );
  }
}