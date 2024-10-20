import {
	Component,
	Output,
	EventEmitter,
	Input,
	ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasesVawFormComponent } from '../../cases-vaw-form/cases-vaw-form.component';
import { ViolenceAgainstWomen } from '../../../../model/vaw.model';
import { CasesVacFormComponent } from '../../cases-vac-form/cases-vac-form.component';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
	@Input() showToggle = true;
	@Input() toggleChecked = false;
	@Output() toggleMobileNav = new EventEmitter<void>();
	@Output() toggleMobileFilterNav = new EventEmitter<void>();
	@Output() toggleCollapsed = new EventEmitter<void>();

	showFiller = false;
	barangay = localStorage.getItem('barangayUser');
	barangayName: string[] = [];
	superAdmin: boolean = false;

	notificationList: any[] = [];

	constructor(
		public dialog: MatDialog,
		private authService: AuthService,
		private router: Router,
		private apiService: ApiService,
		private modalService: NgbModal
	) {
		const userRole = localStorage.getItem('userRole');
		this.superAdmin = userRole && userRole === 'super admin' ? true : false;
	}

	ngOnInit() {
		this.loadNotification()
	}

	loadNotification() {
		this.apiService.getBarangayById(this.barangay).subscribe(res => {
			if (res) {
				this.barangayName = res?.name;
			}
		})
		this.apiService.getUserNotification().subscribe(res => {
			if (res) {
				this.notificationList = res;
			}
		})
	}

	logout() {
		this.authService.logout().subscribe(
			() => {
				this.router.navigate(['login']);
			}
		);
	}

	openNotification(data: any) {
		if (data.type === 'VAW') {
			this.apiService.getVaw(data.id).subscribe(res => {
				if (res) {
					const modalRef = this.modalService.open(CasesVawFormComponent, { size: 'lg', backdrop: 'static', centered: true });
					modalRef.componentInstance.vawData = res;
				}
			})
		}
		if (data.type === 'VAC') {
			this.apiService.getVac(data.id).subscribe(res => {
				if (res) {
					const modalRef = this.modalService.open(CasesVacFormComponent, { size: 'lg', backdrop: 'static', centered: true });
					modalRef.componentInstance.vacData = res;
				}
			})
		}
	}

	isToday(deadline: string): boolean {
		const today = new Date();
		const deadlineDate = new Date(deadline);
		return today.getFullYear() === deadlineDate.getFullYear() &&
			today.getMonth() === deadlineDate.getMonth() &&
			today.getDate() === deadlineDate.getDate();
	}

	isInTwoDays(deadline: string): boolean {
		const inTwoDays = new Date();
		inTwoDays.setDate(inTwoDays.getDate() + 1);
		const deadlineDate = new Date(deadline);
		return inTwoDays.getFullYear() === deadlineDate.getFullYear() &&
			inTwoDays.getMonth() === deadlineDate.getMonth() &&
			inTwoDays.getDate() === deadlineDate.getDate();
	}

	isInThreeDays(deadline: string): boolean {
		const inThreeDays = new Date();
		inThreeDays.setDate(inThreeDays.getDate() + 2);
		const deadlineDate = new Date(deadline);
		return inThreeDays.getFullYear() === deadlineDate.getFullYear() &&
			inThreeDays.getMonth() === deadlineDate.getMonth() &&
			inThreeDays.getDate() === deadlineDate.getDate();
	}
}
