import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AuthenticationRoutes: Routes = [
	{
        path: '', // Change to 'login' instead of '/login'
        component: LoginComponent,
    }
];
