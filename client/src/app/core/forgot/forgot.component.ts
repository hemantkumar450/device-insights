import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from './../../shared/route.service';
import { ForgotPasswordModel } from './forgot.model';
import { Message } from 'primeng/primeng';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot.component.html'
})

export class ForgotPasswordComponent {

  public errorMsg: Message[] = [];
  public forgotPassword = new ForgotPasswordModel();
  constructor(
    public route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    public routeService: RouteService,
    private authenticationService: AuthenticationService,
  ) {

  }

  public sendLink() {
    if (this.forgotPassword.Email.trim() === '') {
      this.errorMsg.push({
        severity: 'warn',
        summary: '', detail: 'Please enter email'
      });
      return;
    }
    this.loaderService.show();
    this.authenticationService.emailVerification(this.forgotPassword.Email).then(result => {
      this.loaderService.hide();
      this.cancel();
    }).catch(error => {
      this.loaderService.hide();
      this.errorMsg.push({ severity: 'error', summary: '', detail: error.statusText });
    });
  }

  public cancel() {
    this.router.navigate(['login']);
  }
}


