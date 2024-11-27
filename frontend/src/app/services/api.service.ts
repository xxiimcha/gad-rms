import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';
import { User } from '../model/user.model';
import { ViolenceAgainstWomen } from '../model/vaw.model';
import { ViolenceAgainstChildren } from '../model/vac.model';
import { Settings } from '../model/settings.model';
import { Audits } from '../model/audits.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    apiUrl = 'http://localhost:8000/api';
    authToken: any = null;

    constructor(private http: HttpClient) {
        this.authToken = localStorage.getItem('authToken');
    }

    generateOtp(method: string): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            const params = { deliveryMethod: method }; // Add the delivery method as a query parameter
    
            console.log(`Attempting to generate OTP via ${method}...`); // Log the method of OTP delivery
    
            return this.http.get<any>(`${this.apiUrl}/2fa/generate`, { headers, params }).pipe(
                tap((response) => {
                    console.log('OTP Generation Response:', response); // Log the successful response
                }),
                catchError((error) => {
                    console.error('OTP Generation Error:', error); // Log the error response
                    return throwError(error); // Re-throw the error for handling by the caller
                })
            );
        } else {
            console.error('Authentication token is missing'); // Log missing authentication token
            return of([]); // Return an empty observable to prevent app crashes
        }
    }    

    verifyOtp(otp: string): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.post<any>(`${this.apiUrl}/2fa/verify`, { otp: otp }, { headers }).pipe(
                tap((response) => {
                    console.log(response)
                    
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getCities(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/cities`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching cities:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getBarangays(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/barangays`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching barangays:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getBarangaysByCity(cityId: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/barangays/${cityId}`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching barangays:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getBarangayById(id: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/barangay/${id}`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching barangays:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }
    /* START USER */
    getUserNotification(): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/notifications/by-barangay`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching notification:', error);
                    return of(null);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of(null);
        }
    }
    
    getUsers(): Observable<User[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/users`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveUser(user: FormGroup): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/users`, user.value, { headers }).pipe(
            tap ((response: any) => {
                console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateUser(user: FormGroup): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/users`, user.value, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    deleteUser(id: number): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getUserById(id: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/users/${id}`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }
    /* END USER */

    /* START VAWS */
    getAllVaws(year: number, month: any): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vaws/all/${year}/${month}`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }
    getAllVawsPercentage(month: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.post<any>(`${this.apiUrl}/vaws/all/by-percentage`, { month: month }, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getAllVawsByParameter(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vaws/all/by-param`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getVawsForecast(): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/vaws/forecast`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getVaw(id: number): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.get<any>(`${this.apiUrl}/vaw/${id}`, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getVaws(): Observable<ViolenceAgainstWomen[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vaws`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveVaws(vaws: any): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/vaws`, vaws, { headers }).pipe(
            tap ((response: any) => {
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateVaws(vaws: any): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/vaws`, vaws, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateAdminVaws(vaws: any): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/vaw/admin_update`, vaws, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    deleteVaws(id: number): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/vaws/${id}`, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }
    /* END VAWS */

    /* START VACS */
    getAllVacsPercentage(month: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.post<any>(`${this.apiUrl}/vacs/all/by-percentage`, { month: month }, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getAllVacsByParameter(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vacs/all/by-param`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getVacsForecast(): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/vacs/forecast`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getAllVacs(year: number, month: any): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vacs/all/${year}/${month}`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getVac(id: number): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.get<any>(`${this.apiUrl}/vac/${id}`, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getVacs(): Observable<ViolenceAgainstChildren[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vacs`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveVacs(vacs: any): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/vacs`, vacs, { headers }).pipe(
            tap (() => {
            }),
            catchError((error: any) => {
                console.error('Error saving vacs:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateVacs(vacs: any): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/vacs`, vacs, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vacs:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateAdminVacs(vaws: any): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/vac/admin_update`, vaws, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    deleteVacs(id: number): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/vacs/${id}`, { headers }).pipe(
            tap((response: any) => {
                // console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving vacs:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }
    /* END VACS */

    /* START USER */
    getSettings(): Observable<Settings[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/settings`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    updateSettings(user: any): Observable<Settings> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/settings`, user, { headers }).pipe(
            tap((response: any) => {
                console.log(response);
            }),
            catchError((error: any) => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getAudits(): Observable<Audits[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/audits`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getArchives(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/archives`, { headers }).pipe(
                catchError((error: any) => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    restoreRecords(value: any): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/restore`, value, { headers }).pipe(
            tap (() => {
            }),
            catchError((error: any) => {
                console.error('Error restoring records:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }
    /* END USER */
}