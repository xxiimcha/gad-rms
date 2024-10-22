import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViolenceAgainstChildren } from '../../../model/vac.model';

@Component({
    selector: 'app-cases-vac-form',
    templateUrl: './cases-vac-form.component.html',
    styleUrls: ['./cases-vac-form.component.scss']
})
export class CasesVacFormComponent implements OnInit {

    @Input() vacData: ViolenceAgainstChildren | undefined;
    @Output() recordCreatedVac: EventEmitter<ViolenceAgainstChildren> = new EventEmitter<ViolenceAgainstChildren>();
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    barangay = localStorage.getItem('barangayUser');

    violenceAgainstChildren: ViolenceAgainstChildren | any;

    genderList: string[] = ['Male', 'Female'];
    genderRows: { gender: string, genderValue: number }[] = [];
    selectedGenders: string[] = [];

    ageList: string[] = ['0-4yr', '6-9yr', '10-14yr', '15-17yr', '18 up PWD'];
    ageRows: { age: string, ageValue: number }[] = [];
    selectedAges: string[] = [];

    abuseList: string[] = ['Physical Abuse', 'Sexual Abuse', 'Psychological Abuse', 'Neglect', 'Others'];
    abuseRows: { abuseType: string, abuseValue: number }[] = [];
    selectedAbuses: string[] = [];

    perpetratorsList: string[] = ['Immediate Family', 'Other Close Relative(s)', 'Acquaintance', 'Stranger', 'Local Official', 'Law Enforcer', 'Other (Guardians)'];
    perpetratorsRows: { perpetrator: string, perpetratorValue: number }[] = [];
    selectedPerpetrators: string[] = [];

    actionList: string[] = ['Referred to PNP', 'Referred to NBI', 'Referred for Medical', 'Referred for Legal Assist', 'Others: (NGO, GBOS)'];
    actionRows: { action: string, actionValue: number }[] = [];
    selectedActions: string[] = [];

    programsList: string[] = ['Trainings/Seminars', 'Counseling', 'IEC', 'Fund Allocation'];
    programsRows: { program: string, programValue: number }[] = [];
    selectedPrograms: string[] = [];

    remarks: string = "";
    month: string = "";
    totalProgramValue: number = 0;

    isSuperAdmin: boolean = false;
    vacStatus: string = "";

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
        if (this.vacData) {
            this.initializeForm();
        } else {
            this.addGenderRow(0);
            this.addAgeRow(0);
            this.addAbuseRow(0);
            this.addPerpetratorRow(0);
            this.addActionRow(0);
            this.addProgramRow(0);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vacData'] && !changes['vacData'].firstChange) {
            this.initializeForm();
        }
    }

    private initializeForm() {
        const vacData = this.vacData!;

        this.remarks = vacData.remarks;
        this.totalProgramValue = vacData.number_vac;
        this.month = vacData.month;
        this.vacStatus = vacData.status;

        this.genderList.forEach((g, index) => {
            let getVal = vacData[g.toLocaleLowerCase() as keyof ViolenceAgainstChildren];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addGenderRow(index, g, value);
        });
        
        
        const ageRanges: string[] = [
            'range_one',
            'range_two',
            'range_three',
            'range_four',
            'range_five'
        ];

        ageRanges.forEach((g, index) => {
            let getVal = vacData[g.toLocaleLowerCase() as keyof ViolenceAgainstChildren];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addAgeRow(index, this.ageList[index], value);
        });

        const abuseRanges: string[] = [
            'physical_abuse',
            'sexual_abuse',
            'psychological_abuse',
            'neglect',
            'others',
        ];

        abuseRanges.forEach((g, index) => {
            let getVal = vacData[g.toLocaleLowerCase() as keyof ViolenceAgainstChildren];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addAbuseRow(index, this.abuseList[index], value);
        });

        const perpetratorsRanges: string[] = [
            'immediate_family',
            'other_close_relative',
            'acquaintance',
            'stranger',
            'local_official',
            'law_enforcer',
            'other_guardians',
        ];

        perpetratorsRanges.forEach((g, index) => {
            let getVal = vacData[g.toLocaleLowerCase() as keyof ViolenceAgainstChildren];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addPerpetratorRow(index, this.perpetratorsList[index], value);
        });

        const actionRanges: string[] = [
            'referred_pnp',
            'referred_nbi',
            'referred_medical',
            'referred_legal_assist',
            'referred_others',
        ];

        actionRanges.forEach((g, index) => {
            let getVal = vacData[g.toLocaleLowerCase() as keyof ViolenceAgainstChildren];
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
            let getVal = vacData[g.toLocaleLowerCase() as keyof ViolenceAgainstChildren];
            let value = typeof getVal === 'number' ? getVal : parseInt(getVal as string, 10);
            value = isNaN(value) ? 0 : value;
            this.addProgramRow(index, this.programsList[index], value);
        });
    }
    //GENDER
    addGenderRow(index: number, gender: string = "", genderValue: number = 0) {
        if(this.vacData) {
            if(genderValue > 0) {
                const newRow = { gender: gender, genderValue: genderValue };
                this.genderRows.splice(index + 1, 0, newRow);
            } else {
                if(gender === '') {
                    const newRow = { gender: '', genderValue: 0 };
                    this.genderRows.splice(index + 1, 0, newRow);
                }
            }
        } else {
            const newRow = { gender: '', genderValue: 0 };
            this.genderRows.splice(index + 1, 0, newRow);
        }
    }

    removeGenderRow(index: number) {
        const removed = this.genderRows[index].gender;
        this.genderRows.splice(index, 1);
        this.selectedGenders = this.selectedGenders.filter(gender => gender !== removed);
    }

    availableGenders(index: number): string[] {
        const selectedGenders = this.genderRows.map((row, rowIndex) => rowIndex !== index ? row.gender : null);
        return this.genderList.filter(gender => !selectedGenders.includes(gender));
    }

    //AGE
    addAgeRow(index: number, age: string = "", ageValue: number = 0){
        if(this.vacData) {
            if(ageValue > 0) {
                const newRow = { age: age, ageValue: ageValue };
                this.ageRows.splice(index + 1, 0, newRow);
            } else {
                if(age === '') {
                    const newRow = { age: '', ageValue: 0 };
                    this.ageRows.splice(index + 1, 0, newRow);
                }
            }
        } else {
            const newRow = { age: '', ageValue: 0 };
            this.ageRows.splice(index + 1, 0, newRow);
        }
    }

    removeAgeRow(index: number) {
        const removed = this.ageRows[index].age;
        this.ageRows.splice(index, 1);
        this.selectedAges = this.selectedAges.filter(age => age !== removed);
    }

    availableAges(index: number): string[] {
        const selectedAges = this.ageRows.map((row, rowIndex) => rowIndex !== index ? row.age : null);
        return this.ageList.filter(age => !selectedAges.includes(age));
    }

    //ABUSE
    addAbuseRow(index: number, abuseType: string = "", abuseValue: number = 0){
        if(this.vacData) {
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

    //Perpetrator
    addPerpetratorRow(index: number, perpetrator: string = "", perpetratorValue: number = 0){
        if(this.vacData) {
            if(perpetratorValue > 0) {
                const newRow = { perpetrator: perpetrator, perpetratorValue: perpetratorValue };
                this.perpetratorsRows.splice(index + 1, 0, newRow);
            } else {
                if(perpetrator === '') {
                    const newRow = { perpetrator: '', perpetratorValue: 0 };
                    this.perpetratorsRows.splice(index + 1, 0, newRow);
                }
            }
        } else {
            const newRow = { perpetrator: '', perpetratorValue: 0 };
            this.perpetratorsRows.splice(index + 1, 0, newRow);
        }
    }

    removePerpetratorRow(index: number) {
        const removed = this.perpetratorsRows[index].perpetrator;
        this.perpetratorsRows.splice(index, 1);
        this.selectedPerpetrators = this.selectedPerpetrators.filter(perp => perp !== removed);
    }

    availablePerpetrators(index: number): string[] {
        const selectedPerpetrators = this.perpetratorsRows.map((row, rowIndex) => rowIndex !== index ? row.perpetrator : null);
        return this.perpetratorsList.filter(age => !selectedPerpetrators.includes(age));
    }

    //ACTIONS
    addActionRow(index: number, action: string = "", actionValue: number = 0){
        if(this.vacData) {
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
        if(this.vacData) {
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
        this.genderRows.forEach(row => {
            total += row.genderValue;
        });
        this.ageRows.forEach(row => {
            total += row.ageValue;
        });
        this.abuseRows.forEach(row => {
            total += row.abuseValue;
        });
        return total;
    }

    saveAsDraft() {
        const values = {
            id: this.vacData?.id ?? 0,
            remarks: this.remarks,
            month: this.month,
            barangay: this.barangay,
            number_vac: this.totalProgramValue,
            genderRows: this.genderRows,
            ageRows: this.ageRows,
            abuseRows: this.abuseRows,
            perpetratorsRows: this.perpetratorsRows,
            actionRows: this.actionRows,
            programsRows: this.programsRows,
            status: 'Draft'
        }
        if (this.vacData) {
            this.apiService.updateVacs(values).subscribe((res: ViolenceAgainstChildren | undefined) => {
                this.activeModal.close();
                this.openSnackBar('VACs Record updated successfully', 'Close');
                this.recordCreatedVac.emit(res);
            });
        } else {
            this.apiService.saveVacs(values).subscribe((res: ViolenceAgainstChildren | undefined) => {
                this.activeModal.close();
                this.openSnackBar('VACs Record Created successfully', 'Close');
                this.recordCreatedVac.emit(res);
            });
        }
    }

    receivedVac() {
        const values = {
            id: this.vacData?.id ?? 0,
            remarks: this.remarks,
            status: 'Received'
        }
        if (this.vacData) {
            this.apiService.updateAdminVacs(values).subscribe((res: ViolenceAgainstChildren | undefined) => {
                this.activeModal.close();
                this.openSnackBar('VACs Record updated successfully', 'Close');
                this.recordCreatedVac.emit(res);
            });
        }
    }

    submitReport() {
        const values = {
            id: this.vacData?.id ?? 0,
            remarks: this.remarks,
            status: 'Submitted'
        }
        if (this.vacData) {
            this.apiService.updateAdminVacs(values).subscribe((res: ViolenceAgainstChildren | undefined) => {
                this.activeModal.close();
                this.openSnackBar('VACs Record updated successfully', 'Close');
                this.recordCreatedVac.emit(res);
            });
        }
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
