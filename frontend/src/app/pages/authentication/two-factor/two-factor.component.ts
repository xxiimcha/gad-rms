import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-two-factor',
    templateUrl: './two-factor.component.html',
    styleUrls: ['./two-factor.component.scss']
})
export class TwoFactorComponent {

    otpCode: string = "";

    isLoading = false;
    otpErroMsg: string = "";

    constructor(
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    generateOtp() {
        this.isLoading = true;
        this.apiService.generateOtp().subscribe(response => {
            if(response) {
                this.isLoading = false;
            }
        });
    }

    verifyOtp() {
        this.apiService.verifyOtp(this.otpCode).subscribe({
            next: response => {
                if (response) {
                    if(response.message === "OTP verified successfully") {
                        this.router.navigate(['app/dashboard']).then(() => {
                            window.location.reload();
                        });
                    }
                }
            },
            error: (error: any) => {
                this.otpErroMsg = error?.error?.message;
            }
        });
    }
}
