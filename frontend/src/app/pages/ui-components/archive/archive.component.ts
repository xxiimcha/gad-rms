import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Audits } from '../../../model/audits.model';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

    archives: any[] = [];
	displayedColumns: string[] = ['File Name', 'File Type', 'Date', 'Action'];
  	dataSource = new MatTableDataSource<any>();
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;

	constructor(
		private apiService: ApiService, 
		private router: Router,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
        this.apiService.getArchives().subscribe(res => {
			this.dataSource.data = res;
			this.dataSource.paginator = this.paginator;
        });
    }

	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

	restore(value: any) {
		this.apiService.restoreRecords(value).subscribe((res: any | undefined) => {
			this.openSnackBar('Record restored successfully', 'Close');
			this.ngOnInit();
		});
	}
}
