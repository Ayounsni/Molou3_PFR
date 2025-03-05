import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Colombophile } from '../../shared/models/colombophile.model';
import { Association } from '../../shared/models/association.model';
import { environment } from '../../environment/environment';
import { AppUser } from '../../shared/models/app-user.model';

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

  login(email: string, password: string): Observable<{ email: string, role: string, token: string }> {
    return this.http.post<{ email: string, role: string, token: string }>(
      `${this.apiUrl}/public/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/public/users`);
  }

  // Ajouter ces méthodes pour la gestion du token
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  clearToken(): void {
    localStorage.removeItem('jwt_token');
  }
}