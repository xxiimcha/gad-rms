import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Audits } from '../../../model/audits.model';

@Component({
    selector: 'app-audit-logs',
    templateUrl: './audit-logs.component.html',
    styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {

    users: Audits[] = [];
	displayedColumns: string[] = ['Name', 'Event', 'Old Values', 'New Values', 'Date'];
  	dataSource = new MatTableDataSource<Audits>();
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;

	constructor(
		private apiService: ApiService, 
		private router: Router,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
        this.apiService.getAudits().subscribe(res => {
            this.setDataSource(res);
			// this.dataSource.data = res;
			this.dataSource.paginator = this.paginator;
        });
    }

	setDataSource(data: any) {
		let new_data = data.filter((r: Audits) => (!Array.isArray(r.old_values) || !Array.isArray(r.new_values)));
		this.dataSource.data = new_data;
	}

	getKeys(obj: any): string[] {
		return Object.keys(obj);
	}

	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
