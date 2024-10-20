import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViolenceAgainstChildren } from '../../../model/vac.model';
import { CasesVacFormComponent } from '../cases-vac-form/cases-vac-form.component';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';

@Component({
	selector: 'app-cases-vac-list',
	templateUrl: './cases-vac-list.component.html',
	styleUrls: ['./cases-vac-list.component.scss']
})
export class CasesVacListComponent implements OnInit {

	@Input() vacData: ViolenceAgainstChildren[] = [];
	displayedColumns: string[] = [];
  	dataSource = new MatTableDataSource<ViolenceAgainstChildren>();
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;
	superAdmin: boolean = false;

	constructor(
		private apiService: ApiService,
		private modalService: NgbModal,
		private _snackBar: MatSnackBar
	) { 
		const userRole = localStorage.getItem('userRole');
		this.superAdmin = userRole && userRole === 'super admin' ? true : false;
		this.displayedColumns = userRole && userRole === 'super admin' ? (
			[
				'Month', 'Total #', 'Male', 'Female', 'Age 0-4', 'Age 6-9', 'Age 10-14', 'Age 15-17', '18 up PWD', 'Physical Abuse', 'Sexual Abuse', 'Psychological Abuse', 'Neglect', 'Others', 'Created Date', 'Last Updated Date',
			]
		) : (
			[
				'Month', 'Total #', 'Male', 'Female', 'Age 0-4','Age 6-9', 'Age 10-14', 'Age 15-17', '18 up PWD', 'Physical Abuse', 'Sexual Abuse', 'Psychological Abuse', 'Neglect', 'Others', 'Created Date','Last Updated Date', 'Action'
			]
		);
	}

	ngOnInit() {
		
	}

	ngOnChanges(changes: SimpleChanges) {
        if (changes['vacData'] && !changes['vacData'].firstChange) {
			this.dataSource.data = this.vacData;
			this.dataSource.paginator = this.paginator;
        }
    }
	loadData() {
        this.apiService.getVacs().subscribe(vacs => {
            this.dataSource.data = vacs;
            this.dataSource.paginator = this.paginator;
        });
    }

	editVac(vac: ViolenceAgainstChildren) {
		const modalRef = this.modalService.open(CasesVacFormComponent, { size: 'lg', backdrop: 'static', centered: true });
		modalRef.componentInstance.vacData = vac;
	}

	deleteVac(id: number) {
		const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
		modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
				this.apiService.deleteVacs(id).subscribe(vac => {
					if(vac) {
						const index = this.vacData.findIndex(vac => vac.id === id);
						if (index !== -1) {
							this.vacData.splice(index, 1);
							this.dataSource.data = this.vacData;
							this.openSnackBar('VAC Record deleted successfully', 'Close');
						}
					}
				});
            }
        });
	}
	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
