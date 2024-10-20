import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { User } from '../../../model/user.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-gad-workers',
	templateUrl: './gad-workers.component.html',
	styleUrls: ['./gad-workers.component.scss'],
	standalone: true,
	imports: [MatTableModule, MatPaginatorModule],
})
export class GadWorkersComponent {

	users: User[] = [];
	displayedColumns: string[] = ['User', 'Action'];
  	dataSource = new MatTableDataSource<User>();
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;

	constructor(
		private apiService: ApiService, 
		private router: Router,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
        this.apiService.getUsers().subscribe(res => {
            // this.users = res;
			this.dataSource.data = res;
			this.dataSource.paginator = this.paginator;
        });
    }

	createUser() {
		this.router.navigate(['/app/gad-workers/edit']);
	}

	editUser(id: number) {
		this.router.navigate(['/app/gad-workers/edit'], { queryParams: { id: id } });
	}

	deleteUser(id: number) {
		this.apiService.deleteUser(id).subscribe(user => {
				if(user) {
					this.openSnackBar('User Profile deleted successfully', 'Close');
				}
			}
		);
	}

	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
