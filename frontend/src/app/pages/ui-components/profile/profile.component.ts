import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../model/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    user!: User;

    constructor(private apiService: ApiService) {}

    ngOnInit()  {
        const currentUser = localStorage.getItem('currentUser');
        this.apiService.getUserById(currentUser).subscribe(
			user => {
				this.user = user;
			}
		);
    }

    submitProfile() {
    }
}
