import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx-js-style';
import { DatePipe } from '@angular/common';

interface month {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-vaw-monitoring',
	templateUrl: './vaw-monitoring.component.html',
	styleUrls: ['./vaw-monitoring.component.scss'],
})
export class VawMonitoringComponent implements OnInit {

	dataSource = new MatTableDataSource<ViolenceAgainstWomen>();
	topHeaderColumns: string[] = [
		'blank-header', 
		'vaw-victims', 
		'total-cases-acted', 
		'actions-taken', 
		'blank-actions-taken-last'
	]
	displayedColumns: string[] = [
		'barangay-header',
		'No Of Cases',
		'Physical Abuse',
		'Sexual Abuse',
		'Psychological Abuse',
		'Economic Abuse',

		'Issued BPO',
		'Referred to LSWDO',
		'Referred to PNP',
		'Referred to NBI',
		'Referred to Medical',
		'Referred to Court',
		'actions-taken-last',
		'total-actions-taken-last'
	];

	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	currentYear = new Date().getFullYear();
	currentMonth: string = "";
	dateRange: string = "";
	months: month[] = [];
	barangay = localStorage.getItem('barangayUser');
	barangayNameArr: string[] = [];
	barangayName: string = "";
	vaws: ViolenceAgainstWomen[] = [];
	superAdmin: boolean = false;


	selectedMonthAndYear = { month: '', year: 0 };
	isLoading = true;

	constructor(
		private apiService: ApiService,
		private datePipe: DatePipe
	) {
		const userRole = localStorage.getItem('userRole');
		this.superAdmin = userRole && userRole === 'super admin' ? true : false;
		this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
		this.months = this.generateMonthsForCurrentYear();
	}

	ngOnInit() {
		forkJoin([
			this.apiService.getBarangayById(this.barangay),
		]).subscribe(([res1]) => {
			if (res1) {
				this.barangayNameArr.push(res1?.name);
				this.barangayName = res1?.name;
				this.initializeMonthly(this.currentMonth);
			}
		});
	}

	initializeMonthly(month: any) {
		this.isLoading = true;
		this.selectedMonthAndYear = month;
		this.generateSampleDateRange(month, this.currentYear);
		this.apiService.getAllVaws(this.currentYear, month).subscribe(res => {
			if(res) {
				let totalIssuedBPO = 0;
				let totalReferredLSWDO = 0;
				let totalReferredPNP = 0;
				let totalReferredNBI = 0;
				let totalReferredMedical = 0;
				let totalReferredCourt = 0;

				res.forEach(item => {
					totalIssuedBPO += item.issued_bpo || 0;
					totalReferredLSWDO += item.referred_lowdo || 0;
					totalReferredPNP += item.referred_pnp || 0;
					totalReferredNBI += item.referred_nbi || 0;
					totalReferredMedical += item.referred_medical || 0;
					totalReferredCourt += item.referred_court || 0;
				});

				const dataSourceData = res.map(item => ({ ...item }));
				this.dataSource.data = dataSourceData;
				this.isLoading = false;
			}
		});
	}

	generateSampleDateRange(month: string, year: number) {
		const monthNumber = this.getMonthNumber(month);
		const startDate = new Date(year, monthNumber, 1);
		const endDate = new Date(year, monthNumber + 1, 0);

		const dateRange: string[] = [];
		let currentDate = startDate;
		const formattedStartDate = this.datePipe.transform(currentDate, 'dd');
		const formattedEndDate = this.datePipe.transform(endDate, 'dd');
		this.dateRange = `${month} ${formattedStartDate} - ${formattedEndDate}, ${year}`;
	}

	getMonthNumber(month: string): number {
		const months: { [key: string]: number } = {
			'January': 0,
			'February': 1,
			'March': 2,
			'April': 3,
			'May': 4,
			'June': 5,
			'July': 6,
			'August': 7,
			'September': 8,
			'October': 9,
			'November': 10,
			'December': 11
		};

		return months[month] || -1;
	}



	getTotalCases(column: keyof ViolenceAgainstWomen) {
		return this.vaws.map(t => Number(t[column])).reduce((acc, value) => acc + value, 0);
	}

	generateMonthsForCurrentYear(): month[] {
		const currentYear = new Date().getFullYear();
		const months: month[] = [];

		for (let i = 0; i < 12; i++) {
			const monthValue = ('0' + (i + 1)).slice(-2);
			const monthName = this.monthNames[i];
			months.push({ value: monthName, viewValue: `${monthName} ${currentYear}` });
		}
		return months;
	}

	exportToExcel(): void {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('dataTable'));
		// console.log(ws);
		ws['A1'].v = `MONITORING OF INCIDENCE ON VIOLENCE AGAINST WOMEN (VAW)\nFor the Period of ${this.dateRange} \nNational Capital Region`;
		for (var i in ws) {
			if (typeof ws[i] != 'object') continue;
			let cell = XLSX.utils.decode_cell(i);
			if (cell.r == 1) {
				if (!ws[i].s) ws[i].s = {};
				if (!ws[i].s.fill) ws[i].s.fill = {};
				switch (cell.c) {
					case 0:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'F0D0C9' },
							bgColor: { rgb: 'F0D0C9' },
						};
						break;
					case 1:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'FBCEB1' },
							bgColor: { rgb: 'FBCEB1' },
						};
						break;
					case 2:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'C5E1C0' },
							bgColor: { rgb: 'C5E1C0' },
						};
						break;
					case 3:
					case 4:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'E7C3C3' },
							bgColor: { rgb: 'E7C3C3' },
						};
						break;
					case 5:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'E7C3C3' },
							bgColor: { rgb: 'E7C3C3' },
						};
						break;
					default:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'E7C3C3' },
							bgColor: { rgb: 'E7C3C3' },
						};
						break;
				}
			}
			if (cell.r == 2) {
				console.log(ws[i]);
				if (!ws[i].s) ws[i].s = {};
				if (!ws[i].s.fill) ws[i].s.fill = {};
				switch (cell.c) {
					case 0:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'F0D0C9' },
							bgColor: { rgb: 'F0D0C9' },
						};
						break;
					case 1:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'FBCEB1' },
							bgColor: { rgb: 'FBCEB1' },
						};
						break;
					case 2:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'C5E1C0' },
							bgColor: { rgb: 'C5E1C0' },
						};
						break;
					case 3:
					case 4:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'C5E1C0' },
							bgColor: { rgb: 'C5E1C0' },
						};
						break;
					case 5:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'C5E1C0' },
							bgColor: { rgb: 'C5E1C0' },
						};
						break;
					default:
						ws[i].s.fill = {
							patternType: 'solid',
							fgColor: { rgb: 'E7C3C3' },
							bgColor: { rgb: 'E7C3C3' },
						};
						break;
				}
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
					// Cell styling
					ws[cellAddress].s.alignment = {
						vertical: 'center',
						horizontal: 'center',
						wrapText: true
					};
					ws[cellAddress].s.border = {
						top: { style: 'thin', color: { rgb: '000000' } },
						bottom: { style: 'thin', color: { rgb: '000000' } },
						right: { style: 'thin', color: { rgb: '000000' } },
						left: { style: 'thin', color: { rgb: '000000' } }
					};
				}
			}
		}
		
		ws['!cols'] = [
			{ wch: 15 },
			{ wch: 10 },
		];
	
		ws['!rows'] = [{ hpx: 45 }];
	
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, `${this.barangayName} ${this.currentYear}`);
		XLSX.writeFile(wb, 'VAW Monitoring.xlsx');
	}
}
