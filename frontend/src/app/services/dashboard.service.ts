import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api';
  private authToken: string | null = localStorage.getItem('authToken'); // Adjust based on your token storage

  constructor(private http: HttpClient) {}

  /**
   * Fetch yearly Violence Against Women cases
   */
  getVawsByYear(): Observable<any[]> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
      return this.http.get<any[]>(`${this.apiUrl}/vaws/yearly`, { headers });
  }

}
