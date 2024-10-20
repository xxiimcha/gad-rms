import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViolenceAgainstChildren } from '../../../model/vac.model';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx-js-style';

@Component({
	selector: 'app-vac-summary',
	templateUrl: './vac-summary.component.html',
	styleUrls: ['./vac-summary.component.scss'],
})
export class VacSummaryComponent implements OnInit {

	dataSource = new MatTableDataSource<ViolenceAgainstChildren>();
	displayedColumns: string[] = [
		'Month',
		'No Of Cases',
		'Physical Abuse',
		'Sexual Abuse',
		'Psychological Abuse',
		'Neglect',
		'Others',

		'Referred to PNP',
		'Referred to NBI',
		'Referred to Medical',
		'Referred to Legal',
		'Referred to Others',

		'Trainings',
		'Counseling',
		'Iec',
		'Fund Allocation',
		'Remarks'
	];

	currentYear = new Date().getFullYear();

	barangay = localStorage.getItem('barangayUser');
	barangayNameArr: string[] = [];
	barangayName: string = "";
	vaws: ViolenceAgainstChildren[] = [];

	constructor(
		private apiService: ApiService
	) { }

	ngOnInit() {
		forkJoin([
			this.apiService.getBarangayById(this.barangay),
			this.apiService.getVacs()
		]).subscribe(([res1, res2]) => {
			if (res1 && res2) {
				this.barangayNameArr.push(res1?.name);
				this.barangayName = res1?.name;
				this.vaws = res2;
				this.dataSource.data = res2;
			}
		});
	}

	getTotalCases(column: keyof ViolenceAgainstChildren) {
		return this.vaws.map(t => Number(t[column])).reduce((acc, value) => acc + value, 0);
	}

	exportToExcel(): void {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('dataTable'));
		for (var i in ws) {
			if (typeof ws[i] != 'object') continue;
			let cell = XLSX.utils.decode_cell(i);
			ws[i].s = {
				alignment: {
					vertical: 'center',
					horizontal: 'center',
					wrapText: '1', // any truthy value here
				},
				border: {
					top: {
						style: 'thin',
						color: '000000',
					},
					bottom: {
						style: 'thin',
						color: '000000',
					},
					right: {
						style: 'thin',
						color: '000000',
					},
					left: {
						style: 'thin',
						color: '000000',
					},
				},
			};

			if (cell.r == 0) {
				ws[i].s.border.bottom = {
					style: 'thin',
					color: '#FFBF00'
				};
				ws[i].s.fill = {
					// background color
					patternType: 'solid',
					fgColor: { rgb: 'FFBF00' },
					bgColor: { rgb: 'FFBF00' },
				};
			}

			if (cell.r == 1) {
				ws[i].s.border.bottom = {
					style: 'thin',
					color: '#FFBF00'
				};
				ws[i].s.fill = {
					patternType: 'solid',
					fgColor: { rgb: 'FBCEB1' },
					bgColor: { rgb: 'FBCEB1' },
				};
			}

			if (cell.r == 2) {
				ws[i].s.alignment.textRotation = 90;
			}

			if (cell.r == 15) {
				ws[i].s.fill = {
					patternType: 'solid',
					fgColor: { rgb: 'FFFF8F' },
					bgColor: { rgb: 'FFFF8F' },
				};
			}
			
			if (cell.r == 3) {
				ws['!rows'] = ws['!rows'] || [];
				ws['!rows'][cell.r] = { hpx: 40 }; // Set the desired height in pixels
			}
		}

		if(ws['!ref']) {
			const range = XLSX.utils.decode_range(ws['!ref']);
			for (let R = range.s.r; R <= range.e.r; ++R) {
				for (let C = range.s.c; C <= range.e.c; ++C) {
					const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
					if (!ws[cellAddress]) {
						ws[cellAddress] = {};
					}
					if (!ws[cellAddress].s) {
						ws[cellAddress].s = {};
					}
					ws[cellAddress].s.border = {
						top: {
							style: 'thin',
							color: '000000',
						},
						bottom: {
							style: 'thin',
							color: '000000',
						},
						right: {
							style: 'thin',
							color: '000000',
						},
						left: {
							style: 'thin',
							color: '000000',
						},
					};
				}
			}
			const lastColumnIndex = range.e.c;
			ws['!cols'] = [];
			for (let i = 0; i <= lastColumnIndex; i++) {
				if (i === lastColumnIndex) {
					ws['!cols'].push({ wch: 50 });
				} else if(i === 0) {
					ws['!cols'].push({ wch: 20 });
				} else {
					ws['!cols'].push({ wch: 10 });
				}
			}
		}
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, `${this.barangayName} ${this.currentYear}`);
		XLSX.writeFile(wb, 'VAC.xlsx');
	}
}
