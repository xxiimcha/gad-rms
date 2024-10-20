import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordMatchValidator } from '../../ui-components/common/validator/password-match.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

    credentialsForm: FormGroup;
    loginError: boolean = false;
    token: string | null = null;
    email: string | null = null;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private _snackBar: MatSnackBar
    ) {
        this.credentialsForm = this.formBuilder.group({
            password: ['', [Validators.required]],
            confirm_password: ['', [Validators.required]]
        }, { validator: PasswordMatchValidator() });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            this.email = params['email'];

            // Now you can use token and email as needed
            console.log('Token:', this.token);
            console.log('Email:', this.email);
        });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    resetPassword() {
        if (this.credentialsForm.valid) {
            let value = {
                token: this.token,
                email: this.email,
                password: this.credentialsForm.value.password,
                password_confirmation: this.credentialsForm.value.confirm_password
            }

            this.authService.resetPassword(value).subscribe({
                next: response => {
                    // Handle successful response
                    if (response) {
                        this.router.navigate(['login']);
                    }
                },
                error: (error: any) => {
                    this.openSnackBar(error?.error?.errors?.password[0], 'Close');
                }
            });
        }
    }
}
