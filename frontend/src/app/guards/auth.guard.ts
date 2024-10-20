import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string): Observable<boolean | UrlTree> {
        return this.authService.isLoggedIn().pipe(
            map((res) => {
                if (res) {
                    return true;
                } else {
                    // Redirect to the login page with returnUrl as a query parameter
                    return this.router.createUrlTree(['/login']);
                }
            })
        );
    }
}
