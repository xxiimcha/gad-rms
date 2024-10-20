import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Settings } from '../../../model/settings.model';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    settings: Settings[] = [];
	displayedColumns: string[] = ['User', 'Deadlines', 'Email'];
  	dataSource = new MatTableDataSource<Settings>();
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;

	constructor(
		private apiService: ApiService, 
		private router: Router,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
        this.apiService.getSettings().subscribe(res => {
            // this.users = res;
			this.dataSource.data = res;
			this.dataSource.paginator = this.paginator;
        });
    }

	updateDeadline(data: any) {
		this.apiService.updateSettings(data).subscribe(user => {
				if(user) {
					this.openSnackBar('Deadline Updated', 'Close');
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
