import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Colombophile } from '../../shared/models/colombophile.model';
import { Association } from '../../shared/models/association.model';
import { environment } from '../../environment/environment';
import { AppUser } from '../../shared/models/app-user.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { PageDTO } from '../../shared/models/dtos/page.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerColombophile(data: any, photo?: File): Observable<Colombophile> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (photo) {
      formData.append('photo', photo, photo.name);
    }
    return this.http.post<Colombophile>(`${this.apiUrl}/public/colombophile/register`, formData);
  }

  registerAssociation(data: any, preuveLegale: File, logo?: File): Observable<Association> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    formData.append('preuveLegale', preuveLegale, preuveLegale.name);
    if (logo) {
      formData.append('logo', logo, logo.name);
    }
    return this.http.post<Association>(`${this.apiUrl}/public/association/register`, formData);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/public/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateColombophile(id: number, updateDTO: any, photoFile?: File): Observable<any> {
    const formData = new FormData();
    if (updateDTO) {
      formData.append('updateDTO', new Blob([JSON.stringify(updateDTO)], { type: 'application/json' }));
    }
    if (photoFile) {
      formData.append('photoFile', photoFile, photoFile.name);
    }
    return this.http.put(`${this.apiUrl}/public/colombophile/${id}`, formData);
  }

  updateAssociation(id: number, updateDTO: any, preuveLegaleFile?: File, photoFile?: File): Observable<any> {
    const formData = new FormData();
    if (updateDTO) {
      formData.append('updateDTO', new Blob([JSON.stringify(updateDTO)], { type: 'application/json' }));
    }
    if (preuveLegaleFile) {
      formData.append('preuveLegaleFile', preuveLegaleFile, preuveLegaleFile.name);
    }
    if (photoFile) {
      formData.append('photoFile', photoFile, photoFile.name);
    }
    return this.http.put(`${this.apiUrl}/public/association/${id}`, formData);
  }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/public/users`);
  }

  getCurrentUser(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.apiUrl}/public/current-user`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    const body = { oldPassword, newPassword };
    return this.http.post<string>(`${this.apiUrl}/public/updatePassword`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAllAssociationsPaginated(page: number = 0, size: number = 3): Observable<PageDTO<Association>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageDTO<Association>>(`${this.apiUrl}/public/association`, { params });
  }

  getAllColombophilesPaginated(page: number = 0, size: number = 3): Observable<PageDTO<Colombophile>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageDTO<Colombophile>>(`${this.apiUrl}/public/colombophile`, { params });
  }


  searchAssociations(searchCriteria: any): Observable<Association[]> {
    return this.http.post<Association[]>(`${this.apiUrl}/public/association/search`, searchCriteria);
  }

  getAssociationById(id: number): Observable<Association> {
    return this.http.get<Association>(`${this.apiUrl}/public/association/${id}`);
  }

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