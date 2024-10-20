import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponent } from './pages/ui-components/common/common.component';
import { SidebarComponent } from './pages/ui-components/common/sidebar/sidebar.component';
import { HeaderComponent } from './pages/ui-components/common/header/header.component';
import { BrandingComponent } from './pages/ui-components/common/sidebar/branding.component';
import { NavItemComponent } from './pages/ui-components/common/sidebar/nav-item/nav-item.component';
import { CorsInterceptor } from './interceptors/cors.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Vertical Layout

@NgModule({
	declarations: [
		AppComponent,
		CommonComponent,
		SidebarComponent,
		HeaderComponent,
		BrandingComponent,
		NavItemComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		TablerIconsModule.pick(TablerIcons),
		MatSnackBarModule
	],
	exports: [TablerIconsModule],
	bootstrap: [AppComponent],
	providers: [
		{
			provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true
		}
	]
})
export class AppModule { }
