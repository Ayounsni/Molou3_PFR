import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PageDTO } from '../../shared/models/dtos/page.model';
import { Marketplace } from '../../shared/models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = `${environment.apiUrl}/public/marketplace`;

  constructor(private http: HttpClient) {}

  // Récupérer les marketplaces avec pagination et filtres
  getAllMarketplacesPaginated(
    page: number = 0,
    size: number = 6,
    status: string = 'DISPONIBLE',
    ville?: string,
    nationalite?: string,
    sexe?: string,
    prixMin?: number,
    prixMax?: number
  ): Observable<PageDTO<Marketplace>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status);
    if (ville) params = params.set('ville', ville);
    if (nationalite) params = params.set('nationalite', nationalite);
    if (sexe) params = params.set('sexe', sexe);
    if (prixMin !== undefined) params = params.set('prixMin', prixMin.toString());
    if (prixMax !== undefined) params = params.set('prixMax', prixMax.toString());

    return this.http.get<PageDTO<Marketplace>>(this.apiUrl, { params }).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la récupération des pigeons en vente'))
    );
  }

  // Créer une nouvelle marketplace
  createMarketplace(createMarketplaceDTO: { pigeonId: number; prix: number }): Observable<Marketplace> {
    return this.http.post<Marketplace>(this.apiUrl, createMarketplaceDTO).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la création de la marketplace'))
    );
  }

  // Supprimer une marketplace par ID
  deleteMarketplace(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la suppression de la marketplace'))
    );
  }
}