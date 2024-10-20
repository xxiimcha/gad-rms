// nav-item.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from '../../../../../services/nav.service';
import { NavItem } from './nav-item';

@Component({
    selector: 'app-nav-item',
    templateUrl: './nav-item.component.html'
})
export class NavItemComponent implements OnChanges {
    @Input() item: NavItem | any;
    @Input() depth: any;

    constructor(public navService: NavService, public router: Router) {
        if (this.depth === undefined) {
            this.depth = 0;
        }
    }

    ngOnChanges() {
        this.navService.currentUrl.subscribe((url: string) => {
            if (this.item.route && url) {
                // Add any logic related to highlighting the active menu item based on the current URL
            }
        });
    }

    onItemSelected(item: NavItem) {
        if (!item.children || !item.children.length) {
            this.router.navigate([item.route]);
        }

        document.querySelector('.page-wrapper')?.scroll({
            top: 0,
            left: 0,
        });
    }

    shouldDisplayItem(item: NavItem): boolean {
		const authToken = localStorage.getItem('userRole');
		if (item.requiredRole) {
            const hasAccess = item.requiredRole.find(r => r === authToken);
            if(!hasAccess) {
                return false;
            }
		}
		return true;
	}
}
