import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'GAD-RMS';
    private idleTimeout = 15 * 60 * 1000;
    private inactivityWarning = 2 * 60 * 1000;
    private timeoutId: any;
    private warningTimeoutId: any;
    private eventsSubscription: Subscription[] = [];

    constructor(
        private router: Router, 
        private ngZone: NgZone,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.setupIdleListener();
        this.startTimer();
    }
    private setupIdleListener() {
        const events = [
            'mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'
        ];

        events.forEach(event => {
            const subscription = fromEvent(window, event)
                .pipe(debounceTime(500))
                .subscribe(() => this.resetTimer());
            this.eventsSubscription.push(subscription);
        });
    }

    private startTimer() {
        this.ngZone.runOutsideAngular(() => {
            this.timeoutId = setTimeout(() => {
                this.ngZone.run(() => this.logout());
            }, this.idleTimeout);

            this.warningTimeoutId = setTimeout(() => {
                // Optionally show a warning to the user
            }, this.idleTimeout - this.inactivityWarning);
        });
    }

    private resetTimer() {
        clearTimeout(this.timeoutId);
        clearTimeout(this.warningTimeoutId);
        this.startTimer();
    }

    private logout() {
        this.authService.logout().subscribe(
            () => {
				this.router.navigate(['login']);
            }
        );
    }

    ngOnDestroy() {
        clearTimeout(this.timeoutId);
        clearTimeout(this.warningTimeoutId);
        this.eventsSubscription.forEach(subscription => subscription.unsubscribe());
    }
}
