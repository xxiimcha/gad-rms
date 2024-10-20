import { Component, ViewChild } from '@angular/core';
import { CasesVawFormComponent } from '../cases-vaw-form/cases-vaw-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { ApiService } from '../../../services/api.service';
import { CasesVacFormComponent } from '../cases-vac-form/cases-vac-form.component';
import { ViolenceAgainstChildren } from '../../../model/vac.model';

export interface Section {
	name: string;
	updated: Date;
}

@Component({
	selector: 'app-cases',
	templateUrl: './cases.component.html',
	styleUrls: ['./cases.component.scss'],
})
export class CasesComponent {
	
	vaws: ViolenceAgainstWomen[] = [];
	vacs: ViolenceAgainstChildren[] = [];
	isInitialized: boolean = false;
	superAdmin: boolean = false;
	
	constructor(
		private modalService: NgbModal,
		private apiService: ApiService
	) { 
		const userRole = localStorage.getItem('userRole');
		this.superAdmin = userRole && userRole === 'super admin' ? true : false;
	}

	ngOnInit() {
		if(!this.isInitialized) {
			this.loadVawsData();
			this.loadVacsData();
		}
	}

	loadVawsData() {
        this.apiService.getVaws().subscribe(vaws => {
			this.vaws = vaws;
			this.isInitialized = true;
        });
    }

	loadVacsData() {
        this.apiService.getVacs().subscribe(vacs => {
			this.vacs = vacs;
			this.isInitialized = true;
        });
    }

	openModal(type: string) { 
		if(type === 'vaw') {
			const modalRef = this.modalService.open(CasesVawFormComponent, { size: 'lg', backdrop: 'static', centered: true });
			modalRef.componentInstance.recordCreatedVaw.subscribe((response: ViolenceAgainstWomen) => {
				const index = this.vaws.findIndex(vaw => vaw.id === response.id);
				if (index !== -1) {
					this.vaws[index] = response;
				} else {
					this.vaws = [...this.vaws, response];
				}
			});
		}
		if(type === 'vac') {
			const modalRef = this.modalService.open(CasesVacFormComponent, { size: 'lg', backdrop: 'static', centered: true });
			modalRef.componentInstance.recordCreatedVac.subscribe((response: ViolenceAgainstChildren) => {
				const index = this.vacs.findIndex(vaw => vaw.id === response.id);
				if (index !== -1) {
					this.vacs[index] = response;
				} else {
					this.vacs = [...this.vacs, response];
				}
			});
		}
	}
}
