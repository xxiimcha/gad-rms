import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function PasswordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const password = formGroup.get('password');
        const confirmPassword = formGroup.get('confirm_password');

        if (!password || !confirmPassword) {
            return null;
        }

        return password.value === confirmPassword.value
            ? null
            : { 'passwordMismatch': true };
    };
}
