import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../model/user.model';

@Component({
	selector: 'app-gad-workers-form',
	templateUrl: './gad-workers-form.component.html',
	styleUrls: ['./gad-workers-form.component.scss']
})
export class GadWorkersFormComponent {

	user: User | undefined;
	id: number | undefined;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private apiService: ApiService
	) {
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.id = params['id'];
			if (this.id) {
				this.getUserById(this.id); // Call getUserById if id is available
			}
		});
	}

	getUserById(id: number): void {
		this.apiService.getUserById(id).subscribe(
			user => {
				this.user = user;
			}
		);
	}

	navigateBackToList() {
		this.router.navigate(['/app/gad-workers']);
    }
}
