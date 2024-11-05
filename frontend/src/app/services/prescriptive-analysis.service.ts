import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface PrescriptiveAnalysis {
  barangayName: string;
  caseCount: number;
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptiveAnalysisService {

  private apiUrl = 'http://localhost:8000/api/prescriptive-analysis';

  constructor(private http: HttpClient) { }

  getPrescriptiveAnalysis(): Observable<PrescriptiveAnalysis[]> {
    const token = localStorage.getItem('authToken'); // Retrieve token from Local Storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<PrescriptiveAnalysis[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
