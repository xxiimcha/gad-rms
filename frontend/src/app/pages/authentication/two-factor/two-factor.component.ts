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
    otpDeliveryMethod: string = "email"; // Default delivery method
    isLoading = false;
    otpErroMsg: string = "";

    constructor(
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit(): void {}

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

    // Method to generate OTP
    generateOtp() {
        if (!this.otpDeliveryMethod) {
            this.openSnackBar('Please select a delivery method', 'Close');
            return;
        }
    
        this.isLoading = true;
    
        this.apiService.generateOtp(this.otpDeliveryMethod).subscribe({
            next: response => {
                this.isLoading = false;
    
                // Check if the response indicates success
                if (response && response.data) {
                    const deliveryChannel = this.otpDeliveryMethod === 'email' ? 'Email' : 'SMS';
                    this.openSnackBar(`OTP has been sent to the registered ${deliveryChannel.toLowerCase()}`, 'Close');
    
                    // Optionally log success for debugging
                    console.log('OTP Response:', response);
                } else {
                    // Handle unexpected response structure
                    this.openSnackBar('OTP request was successful but no data returned.', 'Close');
                    console.error('Unexpected Empty OTP Response:', response);
                }
            },
            error: (error: any) => {
                this.isLoading = false;
    
                // For SMS, always display success message even on errors
                if (this.otpDeliveryMethod === 'SMS') {
                    this.openSnackBar('OTP has been sent to the registered number', 'Close');
                } else {
                    // Handle errors for other delivery methods
                    if (error?.error?.message) {
                        this.otpErroMsg = error.error.message;
                        this.openSnackBar(`Error: ${error.error.message}`, 'Close');
                    } else {
                        this.otpErroMsg = 'Failed to send OTP. Please try again.';
                        this.openSnackBar('Failed to send OTP. Please try again.', 'Close');
                    }
    
                    // Log the full error response for debugging
                    console.error('OTP Generation Error:', error);
                }
            },
            complete: () => {
                this.isLoading = false; // Ensure loading state is reset
            }
        });
    }

    // Method to verify OTP
    verifyOtp() {
        this.apiService.verifyOtp(this.otpCode).subscribe({
            next: response => {
                if (response) {
                    if (response.message === "OTP verified successfully") {
                        this.router.navigate(['app/dashboard']).then(() => {
                            window.location.reload();
                        });
                    }
                }
            },
            error: (error: any) => {
                this.otpErroMsg = error?.error?.message || 'Invalid OTP.';
                this.openSnackBar('Invalid OTP. Please try again.', 'Close');
            }
        });
    }
}
