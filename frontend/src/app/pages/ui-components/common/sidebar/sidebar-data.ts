import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
	{
		displayName: 'Dashboard',
		iconName: 'layout-dashboard',
		route: 'app/dashboard',
		requiredRole: ['super admin', 'admin']
	},
	{
		displayName: 'VAW',
		iconName: 'chart-bar',
		route: 'app/vaw', 
		requiredRole: ['super admin', 'admin']
	},
	{
		displayName: 'VAC',
		iconName: 'id',
		route: 'app/vac',
		requiredRole: ['super admin', 'admin']
	},
	{
		displayName: 'Cases', 
		iconName: 'briefcase',
		route: 'app/cases',
		requiredRole: ['super admin', 'admin']
	},
	{
		displayName: 'GAD Workers',
		iconName: 'user-square',
		route: 'app/gad-workers',
		requiredRole: ['super admin']
	},
	{
		displayName: 'Audit Log',
		iconName: 'align-box-left-middle',
		route: 'app/audit-logs',
		requiredRole: ['super admin', 'admin']
	},
	{
		displayName: 'Archive',
		iconName: 'book',
		route: 'app/archive',
		requiredRole: ['admin']
	}
];
export const profileItems: NavItem[] = [
	{
		displayName: 'Profile',
		iconName: 'user',
		route: 'app/profile',
		requiredRole: ['super admin', 'admin']
	},
	{
		displayName: 'Settings',
		iconName: 'settings',
		route: 'app/settings',
		requiredRole: ['super admin']
	}
];