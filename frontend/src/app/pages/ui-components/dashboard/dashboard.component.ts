import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
	ApexChart,
	ChartComponent,
	ApexDataLabels,
	ApexLegend,
	ApexStroke,
	ApexTooltip,
	ApexAxisChartSeries,
	ApexXAxis,
	ApexYAxis,
	ApexGrid,
	ApexPlotOptions,
	ApexFill,
	ApexMarkers,
	ApexResponsive,
	ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { ApiService } from '../../../services/api.service';
import { PrescriptiveAnalysisService } from '../../../services/prescriptive-analysis.service';
import { VawPredictiveAnalysisService } from '../../../services/vaw-predictive-analysis.service';

import { User } from '../../../model/user.model';
import { forkJoin } from 'rxjs';
import { ViolenceAgainstChildren } from '../../../model/vac.model';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal-content/model-content.component';

interface Month {
	value: string;
	viewValue: string;
}

export interface SalesOverviewChart {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	yaxis: ApexYAxis;
	xaxis: ApexXAxis;
	fill: ApexFill;
	tooltip: ApexTooltip;
	stroke: ApexStroke;
	legend: ApexLegend;
	grid: ApexGrid;
	marker: ApexMarkers;
}

export type ChartOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	responsive?: ApexResponsive[];
	labels: any[];
};

interface Stats {
	id: number;
	time: string;
	color: string;
	title?: string;
	subtext?: string;
	link?: string;
}

interface PrescriptiveAnalysis {
barangayName: string;
caseCount: number;
action: string;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	@ViewChild('chart') chart: ChartComponent = Object.create(null);

	users: User[] = [];
	barangays: any[] = [];

	public vawOverviewBarChart!: Partial<SalesOverviewChart> | any;
	public vawOverviewBarChartMonthly!: Partial<SalesOverviewChart> | any;
	public vawOverviewBarChartQuarterly!: Partial<SalesOverviewChart> | any;
	public vawOverviewLineChart!: Partial<SalesOverviewChart> | any;

	public vacOverviewBarChart!: Partial<SalesOverviewChart> | any;
	public vacOverviewBarChartMonthly!: Partial<SalesOverviewChart> | any;
	public vacOverviewBarChartQuarterly!: Partial<SalesOverviewChart> | any;
	public vacOverviewLineChart!: Partial<SalesOverviewChart> | any;

	public chartOptions: Partial<ChartOptions> | any;
	public vawOverviewChart!: Partial<SalesOverviewChart> | any;
	public vacOverviewChart!: Partial<SalesOverviewChart> | any;

	displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
	vac: ViolenceAgainstChildren[] = [];
	vaw: ViolenceAgainstWomen[] = [];
	totalVaw: number[] = [];
	totalVac: number[] = [];
	totalCases: number = 0;

	months: Month[] = [];
	currentYear = new Date().getFullYear();
	currentMonth: string = "";
	currentBarangay: string = "All";
	currentUserRole = localStorage.getItem('userRole');
	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
	reportType: string[] = ['Year', 'Monthly', 'Quarterly'];
	selectedVawReportType: string = 'Year';
	selectedVacReportType: string = 'Year';

	totalVawCaseSubmitted = 0;
	totalVacCaseSubmitted = 0;

	allVacs: any[] = [];
	allVaws: any[] = [];

	isLoading = true;

	allYearVawData: any[] = [];
	allYearVacData: any[] = [];

	percentageVaws: any;
	percentageVacs: any;

	allYearPredictiveVawData: any[] = [];
	allYearPredictiveVacData: any[] = [];
	
	prescriptiveAnalysis: any[] = [];
	errorMessage: string = '';
	currentMonthIndex: number = 0;
  	uniqueMonths: string[] = [];
	
	vawAnalysis: any[] = [];

	constructor(
		private apiService: ApiService,
		private modalService: NgbModal,
		private analysisService: PrescriptiveAnalysisService,
		private vawService: VawPredictiveAnalysisService
	) {
		this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
		this.months = this.generateMonthsForCurrentYear();
		this.uniqueMonths = this.getUniqueMonths(this.prescriptiveAnalysis);
		
	}

	ngOnInit() {
		forkJoin([
			this.apiService.getVaws(),
			this.apiService.getVacs(),
			this.apiService.getUsers(),
			this.apiService.getBarangays(),
			this.apiService.getAllVacs(this.currentYear, this.currentMonth),
			this.apiService.getAllVaws(this.currentYear, this.currentMonth),
			this.apiService.getAllVawsByParameter(),
			this.apiService.getAllVacsByParameter(),
			this.apiService.getVawsForecast(),
			this.apiService.getVacsForecast()
		]).subscribe(([res1, res2, res3, res4, res5, res6, res7, res8, res9, res10]) => {
			if (res1 && res2) {
				this.vaw = res1;
				this.vac = res2;
				this.users = res3;
				this.barangays = res4;
				this.currentBarangay = localStorage.getItem('userRole') === 'super admin' ? "All" : this.barangays.find(r => r.id == localStorage.getItem('barangayUser')).name;
				this.totalVaw = res1.map(item => item.number_vaw);
				this.totalVac = res2.map(item => item.number_vac);
				this.totalCases = this.totalVaw.reduce((acc, curr) => acc + curr, 0) + this.totalVac.reduce((acc, curr) => acc + curr, 0);

				this.totalVawCaseSubmitted = res1.filter(r => r.status === 'Submitted' || r.status === 'Received').length;
				this.totalVacCaseSubmitted = res2.filter(r => r.status === 'Submitted' || r.status === 'Received').length;

				this.allVacs = res5;
				this.allVaws = res6;
				this.isLoading = false;
				this.allYearVawData = res7;
				this.allYearVacData = res8;
				this.allYearPredictiveVawData = res9;
				this.allYearPredictiveVacData = res10;
				this.updateVawCharts();
				this.updateVacCharts();
				this.initializeVawCasePercentage(this.currentMonth);
				this.initializeVacCasePercentage(this.currentMonth);

				this.loadPrescriptiveAnalysis();
				this.fetchVawAnalysis();
			}
		});
	}

	getUniqueMonths(data: any[]): string[] {
		const months = data.map(item => item.month);
		return [...new Set(months)];
	  }
	
	  getRecommendationsByMonth(month: string) {
		return this.prescriptiveAnalysis.filter(item => item.month === month);
	  }
	  getVawRecommendationsByMonth(month: string): any[] {
		return this.vawAnalysis.filter(item => item.month === month);
	  }
	  nextMonth() {
		if (this.currentMonthIndex < this.uniqueMonths.length - 1) {
		  this.currentMonthIndex++;
		}
	  }
	
	  previousMonth() {
		if (this.currentMonthIndex > 0) {
		  this.currentMonthIndex--;
		}
	  }

	loadPrescriptiveAnalysis() {
		this.analysisService.getPrescriptiveAnalysis().subscribe(
			(data) => {
				this.prescriptiveAnalysis = data;
			},
			(error) => {
				console.error('Error fetching prescriptive analysis:', error);
				this.errorMessage = error.message;
			}
		);
	}

	fetchVawAnalysis(): void {
		this.vawService.getPredictiveAnalysis()
			.subscribe(
			data => {
				this.vawAnalysis = data;
				this.uniqueMonths = this.getUniqueMonths(data);
				this.currentMonthIndex = 0; // Reset to the first month available
			},
			error => {
				console.error('Error fetching VAW analysis data', error);
			}
		);
	}
	updateVawCharts() {
		if (this.selectedVawReportType === 'Year') {
			this.initializeVawChart();
			this.initializeVawPredictveChart();
		} else if (this.selectedVawReportType === 'Monthly') {
			this.initializeMonthlyVawChart(this.currentMonth);
		} else if (this.selectedVawReportType === 'Quarterly') {
			this.initializeQuarterlyVawChart('Q1');
		}
	}

	updateVacCharts() {
		if (this.selectedVacReportType === 'Year') {
			this.initializeVacChart();
			this.initializeVacPredictveChart();
		} else if (this.selectedVacReportType === 'Monthly') {
			this.initializeMonthlyVacChart(this.currentMonth);
		} else if (this.selectedVacReportType === 'Quarterly') {
			this.initializeQuarterlyVacChart('Q1');
		}
	}

	initializeVawChart() {
		let seriesList: any[] = [];
		for (let i = 0; i < this.allYearVawData.length; i++) {
			let tempData = [];
			for (let j = 0; j < this.allYearVawData[i].data.length; j++) {
				tempData.push(this.allYearVawData[i].data[j].total);
			}
			seriesList.push({ name: this.allYearVawData[i].name, data: tempData });
		}
		seriesList = this.currentBarangay === 'All' ? seriesList : seriesList.filter(r => r.name === this.currentBarangay);
		this.vawOverviewBarChart = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'bar',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				},
			},
			xaxis: {
				categories: this.monthNames,
			}
		};
	}

	initializeVacChart() {
		let seriesList: any[] = [];
		for (let i = 0; i < this.allYearVacData.length; i++) {
			let tempData = [];
			for (let j = 0; j < this.allYearVacData[i].data.length; j++) {
				tempData.push(this.allYearVacData[i].data[j].total);
			}
			seriesList.push({ name: this.allYearVacData[i].name, data: tempData });
		}
		seriesList = this.currentBarangay === 'All' ? seriesList : seriesList.filter(r => r.name === this.currentBarangay);
		this.vacOverviewBarChart = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'bar',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				},
			},
			xaxis: {
				categories: this.monthNames,
			}
		};
	}

	initializeMonthlyVawChart(month: string) {
		let seriesList: any[] = [];

		for (let i = 0; i < this.allYearVawData.length; i++) {
			let filteredData = [];
			let filteredCategories = [];

			for (let j = 0; j < this.allYearVawData[i].data.length; j++) {
				const dataItem = this.allYearVawData[i].data[j];

				if (dataItem.month === month && (this.currentBarangay === 'All' || this.allYearVawData[i].name === this.currentBarangay)) {
					filteredData.push(dataItem.total);
					filteredCategories.push(dataItem.month);
				}
			}

			if (filteredData.length > 0) {
				seriesList.push({
					name: this.allYearVawData[i].name,
					data: filteredData
				});
			}
		}

		this.vawOverviewBarChartMonthly = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'bar',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: [month] // Updated to show all relevant months
			}
		};
	}

	initializeMonthlyVacChart(month: string) {
		let seriesList: any[] = [];

		for (let i = 0; i < this.allYearVacData.length; i++) {
			let filteredData = [];
			let filteredCategories = [];

			for (let j = 0; j < this.allYearVacData[i].data.length; j++) {
				const dataItem = this.allYearVacData[i].data[j];

				if (dataItem.month === month && (this.currentBarangay === 'All' || this.allYearVacData[i].name === this.currentBarangay)) {
					filteredData.push(dataItem.total);
					filteredCategories.push(dataItem.month);
				}
			}

			if (filteredData.length > 0) {
				seriesList.push({
					name: this.allYearVacData[i].name,
					data: filteredData
				});
			}
		}

		this.vacOverviewBarChartMonthly = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'bar',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: [month] // Updated to show all relevant months
			}
		};
	}

	initializeQuarterlyVawChart(q: string) {
		let currentQMonths: string[] = [];
		let seriesList: any[] = [];

		// Define months for each quarter
		if (q === 'Q1') {
			currentQMonths = ['January', 'February', 'March'];
		} else if (q === 'Q2') {
			currentQMonths = ['April', 'May', 'June'];
		} else if (q === 'Q3') {
			currentQMonths = ['July', 'August', 'September'];
		} else if (q === 'Q4') {
			currentQMonths = ['October', 'November', 'December'];
		}

		for (let i = 0; i < this.allYearVawData.length; i++) {
			let filteredData: number[] = [];
			let filteredCategories: string[] = [];

			for (let j = 0; j < this.allYearVawData[i].data.length; j++) {
				const dataItem = this.allYearVawData[i].data[j];

				// Check if the month is in the current quarter and barangay filter
				if (currentQMonths.includes(dataItem.month) &&
					(this.currentBarangay === 'All' || this.allYearVawData[i].name === this.currentBarangay)) {
					filteredData.push(dataItem.total);
					filteredCategories.push(dataItem.month);
				}
			}

			// Only add to seriesList if there is data to display
			if (filteredData.length > 0) {
				seriesList.push({
					name: this.allYearVawData[i].name,
					data: filteredData
				});
			}
		}

		this.vawOverviewBarChartQuarterly = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'bar',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: currentQMonths
			}
		};
	}

	initializeQuarterlyVacChart(q: string) {
		let currentQMonths: string[] = [];
		let seriesList: any[] = [];

		// Define months for each quarter
		if (q === 'Q1') {
			currentQMonths = ['January', 'February', 'March'];
		} else if (q === 'Q2') {
			currentQMonths = ['April', 'May', 'June'];
		} else if (q === 'Q3') {
			currentQMonths = ['July', 'August', 'September'];
		} else if (q === 'Q4') {
			currentQMonths = ['October', 'November', 'December'];
		}

		for (let i = 0; i < this.allYearVacData.length; i++) {
			let filteredData: number[] = [];
			let filteredCategories: string[] = [];

			for (let j = 0; j < this.allYearVacData[i].data.length; j++) {
				const dataItem = this.allYearVacData[i].data[j];

				// Check if the month is in the current quarter and barangay filter
				if (currentQMonths.includes(dataItem.month) &&
					(this.currentBarangay === 'All' || this.allYearVacData[i].name === this.currentBarangay)) {
					filteredData.push(dataItem.total);
					filteredCategories.push(dataItem.month);
				}
			}

			// Only add to seriesList if there is data to display
			if (filteredData.length > 0) {
				seriesList.push({
					name: this.allYearVacData[i].name,
					data: filteredData
				});
			}
		}

		this.vacOverviewBarChartQuarterly = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'bar',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: currentQMonths
			}
		};
	}

	generateMonthsForCurrentYear(): Month[] {
		const currentYear = new Date().getFullYear();
		return this.monthNames.map((name, i) => ({
			value: name,
			viewValue: `${name} ${currentYear}`
		}));
	}

	onReportTypeVawChange(event: any) {
		this.selectedVawReportType = event?.value;
		this.updateVawCharts();
	}

	onReportTypeVacChange(event: any) {
		this.selectedVacReportType = event?.value;
		this.updateVacCharts();
	}

	onBarangayVawChange(event: any) {
		this.currentBarangay = event?.value;
		this.updateVawCharts();
	}

	onBarangayVacChange(event: any) {
		this.currentBarangay = event?.value;
		this.updateVacCharts();
	}

	getCurrentMonth() {
		const currentMonthIndex = new Date().getMonth();
		return this.monthNames[currentMonthIndex];
	}

	view(type: string) {
		const modalRef = this.modalService.open(ModalContentComponent, {
			size: 'md',
			backdrop: 'static',
			centered: true
		});

		if (type === 'vaw') {
			modalRef.componentInstance.data = this.allVaws;
		} else if (type === 'vac') {
			modalRef.componentInstance.data = this.allVacs;
		} else {
			modalRef.componentInstance.data = [];
		}
	}

	initializeVawCasePercentage(value: string) {
		this.apiService.getAllVawsPercentage(value).subscribe(res => {
			if(res.sexual.barangay && res.physical.barangay && res.psychological.barangay && res.economic.barangay) {
				this.percentageVaws = res;
				const vawBrackets = [
					`Sexual Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.sexual.barangay}`,
					`Physical Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.physical.barangay}`,
					`Psychological Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.psychological.barangay}`,
					`Economic Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.economic.barangay}`
				];
				this.vawOverviewChart = {
					series: [
						res.sexual.percentage,
						res.physical.percentage,
						res.psychological.percentage,
						res.economic.percentage
					],
					chart: {
						width: 600,
						type: 'pie',
					},
					labels: vawBrackets,
					responsive: [{
						breakpoint: 480,
						options: {
							chart: {
								width: 600
							},
							legend: {
								position: 'bottom'
							}
						}
					}]
				};
			}
		})
	}

	initializeVacCasePercentage(value: string) {
		this.apiService.getAllVacsPercentage(value).subscribe(res => {
			if(
				res.male.barangay && 
				res.female.barangay && 
				res.range_one.barangay && 
				res.range_two.barangay && 
				res.range_three.barangay && 
				res.range_four.barangay && 
				res.range_five.barangay && 
				res.sexual_abuse.barangay && 
				res.physical_abuse.barangay && 
				res.psychological_abuse.barangay && 
				res.neglect.barangay && 
				res.others.barangay
			) {
				this.percentageVacs = res;
				const vacBrackets = [
					`Male Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.male.barangay}`,
					`Female Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.female.barangay}`,
					`0-4y <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.range_one.barangay}`,
					`6-9y <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.range_two.barangay}`,
					`10-14y <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.range_three.barangay}`,
					`15-17y <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.range_four.barangay}`,
					`18 up PWD <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.range_five.barangay}`,
					`Sexual Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.sexual_abuse.barangay}`,
					`Physical Abuse <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.physical_abuse.barangay}`,
					`Psychological Abus <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.psychological_abuse.barangay}`,
					`Neglect <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.neglect.barangay}`,
					`Others <br/> &nbsp;&nbsp;&nbsp;&nbsp; • ${res.others.barangay}`,
				];
				this.vacOverviewChart = {
					series: [
						res.male.percentage,
						res.female.percentage,
						res.range_one.percentage,
						res.range_two.percentage,
						res.range_three.percentage,
						res.range_four.percentage,
						res.range_five.percentage,
						res.sexual_abuse.percentage,
						res.physical_abuse.percentage,
						res.psychological_abuse.percentage,
						res.neglect.percentage,
						res.others.percentage,
					],
					chart: {
						width: 600,
						type: 'pie',
					},
					labels: vacBrackets,
					responsive: [{
						breakpoint: 480,
						options: {
							chart: {
								width: 600
							},
							legend: {
								position: 'bottom'
							}
						}
					}]
				};
			}
		})
	}

	initializeVawPredictveChart() {
		let seriesList: any[] = [];
		let monthNames: string[] = [];
		for (let i = 0; i < this.allYearPredictiveVawData.length; i++) {
			let tempData = [];
			for (let j = 0; j < this.allYearPredictiveVawData[i].data.length; j++) {
				tempData.push(this.allYearPredictiveVawData[i].data[j].total);
				monthNames.push(this.allYearPredictiveVawData[i].data[j].month);
			}
			seriesList.push({ name: this.allYearPredictiveVawData[i].name, data: tempData });
		}
		seriesList = this.currentBarangay === 'All' ? seriesList : seriesList.filter(r => r.name === this.currentBarangay);
		this.vawOverviewLineChart = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: monthNames,
			}
		};
	}

	initializeVacPredictveChart() {
		let seriesList: any[] = [];
		let monthNames: string[] = [];
		for (let i = 0; i < this.allYearPredictiveVacData.length; i++) {
			let tempData = [];
			for (let j = 0; j < this.allYearPredictiveVacData[i].data.length; j++) {
				tempData.push(this.allYearPredictiveVacData[i].data[j].total);
				monthNames.push(this.allYearPredictiveVacData[i].data[j].month);
			}
			seriesList.push({ name: this.allYearPredictiveVacData[i].name, data: tempData });
		}
		seriesList = this.currentBarangay === 'All' ? seriesList : seriesList.filter(r => r.name === this.currentBarangay);
		this.vacOverviewLineChart = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: monthNames,
			}
		};
	}
}
