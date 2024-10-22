import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-cases-vaw-form',
	templateUrl: './cases-vaw-form.component.html',
	styleUrls: ['./cases-vaw-form.component.scss']
})
export class CasesVawFormComponent implements OnInit {

	@Input() vawData: ViolenceAgainstWomen | undefined;
	@Output() recordCreatedVaw: EventEmitter<ViolenceAgainstWomen> = new EventEmitter<ViolenceAgainstWomen>();

    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    barangay = localStorage.getItem('barangayUser');

    abuseList: string[] = ['Physical Abuse', 'Sexual Abuse', 'Psychological Abuse', 'Economic Abuse'];
    abuseRows: { abuseType: string, abuseValue: number }[] = [];
    selectedAbuses: string[] = [];

    actionList: string[] = ['Issued BPO', 'Referred to LoWDO', 'Referred to PNP', 'Referred to NBI', 'Referred to Court', 'Referred to Medical'];
    actionRows: { action: string, actionValue: number }[] = [];
    selectedActions: string[] = [];

    programsList: string[] = ['Trainings/Seminars', 'Counseling', 'IEC', 'Fund Allocation'];
    programsRows: { program: string, programValue: number }[] = [];
    selectedPrograms: string[] = [];

    remarks: string = "";
    month: string = "";
    totalProgramValue: number = 0;

    isSuperAdmin: boolean = false;
    vawStatus: string = "";

	constructor(
		private formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
		public activeModal: NgbActiveModal
	) { 
        this.isSuperAdmin = localStorage.getItem('userRole') === 'super admin' ? true : false;
        const currentMonth = new Date().getMonth();
        this.month = this.months[currentMonth];
    }

	ngOnInit() {
        if(this.vawData) {
            this.initializeForm();
        } else {
            this.addAbuseRow(0);
            this.addActionRow(0);
            this.addProgramRow(0);
        }
	}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vawData'] && !changes['vawData'].firstChange) {
            this.initializeForm();
        }
    }

    private initializeForm() {
        const vawData = this.vawData!;
        this.remarks = vawData.remarks;
        this.totalProgramValue = vawData.number_vaw;
        this.month = vawData.month;
        this.vawStatus = vawData.status;

        const abuseRanges: string[] = [
            'physical_abuse',
            'sexual_abuse',
            'psychological_abuse',
            'economic_abuse'
        ];

        abuseRanges.forEach((g, index) => {
            let getVal = vawData[g.toLocaleLowerCase() as keyof ViolenceAgainstWomen];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addAbuseRow(index, this.abuseList[index], value);
        });

        const actionRanges: string[] = [
            'issued_bpo',
            'referred_lowdo',
            'referred_pnp',
            'referred_nbi',
            'referred_court',
            'referred_medical'
        ];

        actionRanges.forEach((g, index) => {
            let getVal = vawData[g.toLocaleLowerCase() as keyof ViolenceAgainstWomen];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addActionRow(index, this.actionList[index], value);
        });

        const programRanges: string[] = [
            'trainings',
            'counseling',
            'iec',
            'fund_allocation',
        ];

        programRanges.forEach((g, index) => {
            let getVal = vawData[g.toLocaleLowerCase() as keyof ViolenceAgainstWomen];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addProgramRow(index, this.programsList[index], value);
        });
    }

    //ABUSE
    addAbuseRow(index: number, abuseType: string = "", abuseValue: number = 0){
        if(this.vawData) {
            if(abuseValue > 0) {
                const newRow = { abuseType: abuseType, abuseValue: abuseValue };
                this.abuseRows.splice(index + 1, 0, newRow);
            } else {
                if(abuseType === '') {
                    const newRow = { abuseType: '', abuseValue: 0 };
                    this.abuseRows.splice(index + 1, 0, newRow);
                }
            }
        } else {
            const newRow = { abuseType: '', abuseValue: 0 };
            this.abuseRows.splice(index + 1, 0, newRow);
        }
    }

    removeAbuseRow(index: number) {
        const removed = this.abuseRows[index].abuseType;
        this.abuseRows.splice(index, 1);
        this.selectedAbuses = this.selectedAbuses.filter(abuse => abuse !== removed);
    }

    availableAbuses(index: number): string[] {
        const selectedAbuses = this.abuseRows.map((row, rowIndex) => rowIndex !== index ? row.abuseType : null);
        return this.abuseList.filter(age => !selectedAbuses.includes(age));
    }

    //ACTIONS
    addActionRow(index: number, action: string = "", actionValue: number = 0){
        if(this.vawData) {
            if(actionValue > 0) {
                const newRow = { action: action, actionValue: actionValue };
                this.actionRows.splice(index + 1, 0, newRow);
            } else {
                if(action === '') {
                    const newRow = { action: '', actionValue: 0 };
                    this.actionRows.splice(index + 1, 0, newRow);
                }
            }
        } else {
            const newRow = { action: '', actionValue: 0 };
            this.actionRows.splice(index + 1, 0, newRow);
        }
    }

    removeActionRow(index: number) {
        const removed = this.actionRows[index].action;
        this.actionRows.splice(index, 1);
        this.selectedActions = this.selectedActions.filter(perp => perp !== removed);
    }

    availableActions(index: number): string[] {
        const selectedActions = this.actionRows.map((row, rowIndex) => rowIndex !== index ? row.action : null);
        return this.actionList.filter(age => !selectedActions.includes(age));
    }

    //PROGRAMS
    addProgramRow(index: number, program: string = "", programValue: number = 0){
        if(this.vawData) {
            if(programValue > 0) {
                const newRow = { program: program, programValue: programValue };
                this.programsRows.splice(index + 1, 0, newRow);
            } else {
                if(program === '') {
                    const newRow = { program: '', programValue: 0 };
                    this.programsRows.splice(index + 1, 0, newRow);
                }
            }
        } else {
            const newRow = { program: '', programValue: 0 };
            this.programsRows.splice(index + 1, 0, newRow);
        }
    }

    removeProgramRow(index: number) {
        const removed = this.programsRows[index].program;
        this.programsRows.splice(index, 1);
        this.selectedPrograms = this.selectedPrograms.filter(perp => perp !== removed);
    }

    availablePrograms(index: number): string[] {
        const selectedPrograms = this.programsRows.map((row, rowIndex) => rowIndex !== index ? row.program : null);
        return this.programsList.filter(age => !selectedPrograms.includes(age));
    }

    updateTotalProgramValue(): void {
        this.totalProgramValue = this.calculateTotalCases();
    }

    calculateTotalCases(): number {
        let total = 0;
        this.abuseRows.forEach(row => {
            total += row.abuseValue;
        });
        return total;
    }

	saveAsDraft() {
        const values = {
            id: this.vawData?.id ?? 0,
            remarks: this.remarks,
            month: this.month,
            barangay: this.barangay,
            number_vaw: this.totalProgramValue,
            abuseRows: this.abuseRows,
            actionRows: this.actionRows,
            programsRows: this.programsRows,
            status: 'Draft'
        }
		if(this.vawData) {
            this.apiService.updateVaws(values).subscribe((res) => {
				this.activeModal.close();
                this.openSnackBar('VAWs Record updated successfully', 'Close');
                this.recordCreatedVaw.emit(res);
            });
        } else {
            this.apiService.saveVaws(values).subscribe((res) => {
				this.activeModal.close();
				this.openSnackBar('VAWs Record Created successfully', 'Close');
				this.recordCreatedVaw.emit(res);
            });
        }
	}

    receivedVaw() {
        const values = {
            id: this.vawData?.id ?? 0,
            remarks: this.remarks,
            status: 'Received'
        }
		if(this.vawData) {
            this.apiService.updateAdminVaws(values).subscribe((res) => {
				this.activeModal.close();
                this.openSnackBar('VAWs Record updated successfully', 'Close');
                this.recordCreatedVaw.emit(res);
            });
        }
	}

    submitReport() {
        const values = {
            id: this.vawData?.id ?? 0,
            remarks: this.remarks,
            status: 'Submitted'
        }
		if(this.vawData) {
            this.apiService.updateAdminVaws(values).subscribe((res) => {
				this.activeModal.close();
                this.openSnackBar('VAWs Record updated successfully', 'Close');
                this.recordCreatedVaw.emit(res);
            });
        }
    }

	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
