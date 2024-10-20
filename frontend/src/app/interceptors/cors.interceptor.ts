import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Modify the request to include CORS headers
        const modifiedReq = req.clone({
            setHeaders: {
                'Access-Control-Allow-Origin': '*', // Set appropriate origin(s) here
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Requested-With'
            }
        });

        // Pass the modified request to the next handler
        return next.handle(modifiedReq);
    }
}
