import { Component } from '@angular/core';

@Component({
	selector: 'app-branding',
	template: `
		<div class="branding d-flex align-items-center">
			<img src="/assets/images/logos/banner-logo.png" class="rounded-circle" alt="" style="width: 45px; height: 45px" />
			<span style="color: white;">&nbsp; GAD-RMS</span>
		</div>
  `,
})
export class BrandingComponent {
	constructor() { }
}
