import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-confirmation-dialog',
	templateUrl: './confirmation-dialog.component.html',
	styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
	@Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		public activeModal: NgbActiveModal
	) { }

	confirmAction() {
        this.confirmed.emit(true);
        this.activeModal.close();
    }

    cancelAction() {
        this.activeModal.dismiss();
    }
}
