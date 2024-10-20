import { Component, OnInit } from '@angular/core';
import { navItems, profileItems } from './sidebar-data';
import { ApiService } from '../../../../services/api.service';
import { User } from '../../../../model/user.model';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
	navItems = navItems;
	profileItems = profileItems;
	showCasesSubNav: boolean = false;
	user!: User;

	constructor(private apiService: ApiService) { }

	ngOnInit() {
		const currentUser = localStorage.getItem('currentUser');
        this.apiService.getUserById(currentUser).subscribe(
			user => {
				this.user = user;
			}
		);
	}

	uppercaseEachWord(value: string): string {
		return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	}

	toggleCasesSubNav(item: any) {
		if(item.displayName === 'Cases') {
			this.showCasesSubNav = !this.showCasesSubNav;
		}
	}
}
