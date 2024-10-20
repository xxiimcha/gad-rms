import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CommonComponent } from './pages/ui-components/common/common.component';
import { ForgotPasswordComponent } from './pages/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/authentication/reset-password/reset-password.component';
import { TwoFactorComponent } from './pages/authentication/two-factor/two-factor.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'app/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'app',
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				component: CommonComponent, // Load CommonComponent as the main component for the dashboard route
				children: [
					{
						path: '',
						loadChildren: () =>
							import('./pages/ui-components/ui-components.module').then(
								(m) => m.UicomponentsModule
							),
					},
				]
			},
		]
	},
	{
		path: 'login',
		loadChildren: () =>
			import('./pages/authentication/authentication.module').then(
				(m) => m.AuthenticationModule
			)
	},
	{
		path: '**',
		redirectTo: 'dashboard'
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent
	},
	{
        path: "reset-password",
        component: ResetPasswordComponent,
    },
	{
        path: "two-factor-authorization",
        component: TwoFactorComponent,
    }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
