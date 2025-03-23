// src/app/core/services/marketplace.service.ts
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

  getAllMarketplacesPaginated(page: number = 0, size: number = 3): Observable<PageDTO<Marketplace>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageDTO<Marketplace>>(this.apiUrl, { params }).pipe(
      catchError(error => throwError(() => error.error || 'Erreur lors de la récupération des pigeons en vente'))
    );
  }
}