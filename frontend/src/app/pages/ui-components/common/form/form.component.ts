import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../../../../model/user.model';
import { ApiService } from '../../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'form-component',
    templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

    @Input() userData: User | undefined;
    @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
    profileForm: FormGroup;
    cities: any[] = [];
    barangays: any[] = [];
    isSuperAdmin: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar
    ) {
        this.isSuperAdmin = localStorage.getItem('userRole') === 'super admin' ? true : false;
        this.profileForm = this.formBuilder.group({
            id: null,
            first_name: '',
            middle_name: '',
            last_name: '',
            contact_number: '',
            position: '',
            email: ['', [Validators.required, Validators.email]],
            city: null,
            barangay: [{value: '', disabled: !this.isSuperAdmin}],
            address_line_1: '',
            password: '',
            role: ''
        });
    }

    ngOnInit() {
        this.apiService.getCities().subscribe(cities => {
            this.cities = cities;
        });

        if (this.userData) {
            this.initializeForm();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['userData'] && !changes['userData'].firstChange) {
            this.initializeForm();
        }
    }

    private initializeForm() {
        this.profileForm.patchValue({
            id:  this.userData!.id,
            email: this.userData!.email,
            first_name: this.userData!.first_name,
            last_name: this.userData!.last_name,
            position: this.userData!.position,
            contact_number: this.userData!.contact_number,
            city: this.userData!.city,
            barangay: this.userData!.barangay,
            address_line_1: this.userData!.address_line_1,
            password: this.userData!.password,
            role: this.userData!.role,
        });
        this.filterBarangays();
    }

    filterBarangays() {
        const selectedCityId = this.profileForm.get('city')!.value;
        if (selectedCityId) {
            this.apiService.getBarangaysByCity(selectedCityId).subscribe(barangays => {
                this.barangays = barangays;
            });
        } else {
            this.barangays = [];
        }
    }

    submitProfile() {
        if(this.userData) {
            this.apiService.updateUser(this.profileForm).subscribe(() => {
                this.openSnackBar('User Profile updated successfully', 'Close');
                this.formSubmitted.emit();
            });
        } else {
            this.apiService.saveUser(this.profileForm).subscribe(() => {
                this.formSubmitted.emit();
            });
        }
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
