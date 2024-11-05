import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PredictiveAnalysis {
  barangay: string;
  month: string;
  case_type: string;
  case_count: number;
  recommended_action: string;
}

@Injectable({
  providedIn: 'root'
})
export class VawPredictiveAnalysisService {
  private apiUrl = 'http://localhost:8000/api/vaw-predictive-analysis';

  constructor(private http: HttpClient) {}

  getPredictiveAnalysis(barangay?: string): Observable<PredictiveAnalysis[]> {
    const token = localStorage.getItem('authToken'); // Retrieve token from Local Storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    let params = new HttpParams();
    if (barangay) {
      params = params.set('barangay', barangay);
    }

    return this.http.get<PredictiveAnalysis[]>(this.apiUrl, { headers, params });
  }
}
