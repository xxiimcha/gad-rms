import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

    credentialsForm: FormGroup;
    loginError: boolean = false;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) { 
        this.credentialsForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    forgotPassword() {
        this.isLoading = true;
        this.authService.forgotPassword(this.credentialsForm).subscribe(response => {
            if(response) {
                this.isLoading = false;
                this.router.navigate(['login']);
            }
        });
    }
}
