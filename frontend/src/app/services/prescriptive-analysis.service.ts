import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  // Method to fetch prescriptive analysis data
  getPrescriptiveAnalysis(): Observable<PrescriptiveAnalysis[]> {
    return this.http.get<PrescriptiveAnalysis[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Method to handle errors in HTTP requests
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    // Return a user-friendly message or rethrow the error
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
