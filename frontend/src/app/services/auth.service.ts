import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    apiUrl = 'http://localhost:8000/api';
    private authTokenKey = 'authToken';
    private userRoleKey = 'userRole';
    private currentUserKey = 'currentUser';
    private barangayUserKey = 'barangayUser';

    constructor(private http: HttpClient) { }

    login(credentials: FormGroup): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials.value).pipe(
            tap((response) => {
                if (response.token) {
                    localStorage.setItem(this.authTokenKey, response.token);
                    localStorage.setItem(this.userRoleKey, response.role);
                    localStorage.setItem(this.currentUserKey, response.currentUser);
                    localStorage.setItem(this.barangayUserKey, response.barangay);
                }
            })
        );
    }

    logout(): Observable<any> {
        const authToken = localStorage.getItem(this.authTokenKey);
        if (!authToken) {
            return of(null);
        }

        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken);
        return this.http.post<any>(`${this.apiUrl}/logout`, null, { headers }).pipe(
            tap(() => {
                localStorage.removeItem(this.authTokenKey);
                localStorage.removeItem(this.userRoleKey); 
                localStorage.removeItem(this.currentUserKey); 
                localStorage.removeItem(this.barangayUserKey);
            }),
            catchError((error) => {
                // Handle logout error
                console.error('Logout failed:', error);
                return of(null);
            })
        );
    }

    isLoggedIn(): Observable<boolean> {
        const authToken = localStorage.getItem(this.authTokenKey);
        return authToken ? of(true) : of(false);
    }

    getUserRole(): Observable<string | null> {
        return of(localStorage.getItem(this.userRoleKey));
    }

    forgotPassword(credentials: FormGroup): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/forgot-password`, credentials.value).pipe(
            tap((response) => {
                console.log(response)
                
            })
        );
    }

    resetPassword(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/reset-password`, credentials).pipe(
            tap((response) => {
                console.log(response)
                
            })
        );
    }
}
