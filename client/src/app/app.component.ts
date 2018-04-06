import { Component } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { LocalStorageService } from '../app/core/shared/services/index';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../app/core/shared/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  display: boolean = false;
  idleState = 'Not started.';
  private subscription: Subscription;

  constructor(
    private idle: Idle,
    private localStorageService: LocalStorageService,
    private commonService: CommonService,
    public route: ActivatedRoute,
    private router: Router,
  ) {
    this.idleFindEvent();

    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'onIdleFindEvent') {
        this.idleFindEvent();
      }
    });
  }

  idleFindEvent() {
    // sets an idle timeout of 1 hour, for testing purposes.
    let interval = 60 * 60;
    this.idle.setIdle(interval);
    // sets a timeout period of 10 seconds. after 5 mins of inactivity, the user will be considered timed out.
    this.idle.setTimeout(10);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.display = false;
      this.logout();
    });

    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      let url: any = this.route.snapshot;
      if (url._routerState.url.split('/')[1] !== 'login') {
        this.display = true;
      };
      this.idleState = 'You will loggout out in ' + countdown + ' seconds!. Please click on ignore to stop.';
    });
    this.reset();
  }

  reset() {
    this.display = false;
    this.idle.watch();
    this.idleState = 'Started.';
  }

  logout() {
    this.display = false;
    this.localStorageService.removeLogin();
    this.router.navigate(['login']);
  }

}
