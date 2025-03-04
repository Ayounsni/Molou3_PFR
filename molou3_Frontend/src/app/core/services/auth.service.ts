import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Colombophile } from '../../shared/models/colombophile.model';
import { Association } from '../../shared/models/association.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerColombophile(data: any): Observable<Colombophile> {
    return this.http.post<Colombophile>(
      `${this.apiUrl}/public/colombophile/register`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  registerAssociation(data: any): Observable<Association> {
    return this.http.post<Association>(
      `${this.apiUrl}/public/association/register`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}