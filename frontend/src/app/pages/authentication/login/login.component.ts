import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    credentialsForm: FormGroup;
    loginError: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) { 
        this.credentialsForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    login() {
        this.authService.login(this.credentialsForm).subscribe(response => {
            if(response) {
                if(response.twoFactorAuth) {
                    this.router.navigate(['app/dashboard']).then(() => {
                        window.location.reload();
                    });
                } else {
                    this.router.navigate(['two-factor-authorization']);
                }
            }
        });
    }
}
