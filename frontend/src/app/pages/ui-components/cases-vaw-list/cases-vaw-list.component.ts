import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasesVawFormComponent } from '../cases-vaw-form/cases-vaw-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';

@Component({
	selector: 'app-cases-vaw-list',
	templateUrl: './cases-vaw-list.component.html',
	styleUrls: ['./cases-vaw-list.component.scss']
})
export class CasesVawListComponent implements OnInit {

	@Input() vawData: ViolenceAgainstWomen[] = [];
	displayedColumns: string[] = [];
  	dataSource = new MatTableDataSource<ViolenceAgainstWomen>();
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
				'Month', 'Total #', 'Physical Abuse', 'Sexual Abuse', 'Psychological Abuse', 'Economic Abuse', 'Remarks', 'Created Date', 'Last Updated Date',
			]
		) : (
			[
				'Month', 'Total #', 'Physical Abuse', 'Sexual Abuse', 'Psychological Abuse', 'Economic Abuse', 'Remarks', 'Created Date', 'Last Updated Date', 'Action'
			]
		);
	 }

	ngOnInit() {
		
	}

	ngOnChanges(changes: SimpleChanges) {
        if (changes['vawData'] && !changes['vawData'].firstChange) {
			this.dataSource.data = this.vawData;
			this.dataSource.paginator = this.paginator;
        }
    }
	loadData() {
        this.apiService.getVaws().subscribe(vaws => {
            this.dataSource.data = vaws;
            this.dataSource.paginator = this.paginator;
        });
    }

	editVaw(vaw: ViolenceAgainstWomen) {
		const modalRef = this.modalService.open(CasesVawFormComponent, { size: 'lg', backdrop: 'static', centered: true });
		modalRef.componentInstance.vawData = vaw;
	}

	deleteVaw(id: number) {
		const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
		modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.apiService.deleteVaws(id).subscribe(vaw => {
					if(vaw) {
						const index = this.vawData.findIndex(vaw => vaw.id === id);
						if (index !== -1) {
							this.vawData.splice(index, 1);
							this.dataSource.data = this.vawData;
							this.openSnackBar('VAW Record deleted successfully', 'Close');
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
