import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-content',
    templateUrl: './modal-content.component.html',
    styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent {
    @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() data: any[] | undefined;

    dataList: any [] = [];

	constructor(
		public activeModal: NgbActiveModal
	) { }

    ngOnInit() {
        if(this.data) {
            this.dataList = this.data.filter(i => i.status === 'Not Submitted');
        }
    }

    cancelAction() {
        this.activeModal.dismiss();
    }
}
