import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:8080/api/public/files'; // URL de ton backend

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ url: string }> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
