import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from './../../shared/route.service';
import { ResetPasswordModel } from './reset-password.model';
import { Message } from 'primeng/primeng';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoaderService } from '../../core/loader/loader.service';
import { LocalStorageService } from '../shared/services/index';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {

  public message: Message[] = [];
  public resetPassword = new ResetPasswordModel();
  isInvalidToken: boolean = false;
  isInvalidPasswordValidation = false;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public routeService: RouteService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private authenticationService: AuthenticationService,
  ) {

  }

  ngOnInit() {
    this.checkToken();
  }


  checkPasswordValidation(event) {
    this.isInvalidPasswordValidation = false;
    if (this.resetPassword.Password.length < 4) {
      this.isInvalidPasswordValidation = true;
    }
  }

  public reset() {

    if (this.resetPassword.Password === '' && this.resetPassword.ConfirmPassword === '') {
      this.message.push({
        severity: 'error',
        summary: 'error Message', detail: 'Password can not be blank'
      });
      return;
    }

    if (this.isInvalidPasswordValidation) {
      return;
    }
    
    if (this.resetPassword.Password !== this.resetPassword.ConfirmPassword) {
      this.message.push({
        severity: 'error',
        summary: 'error Message', detail: 'new password does not match with confirm password'
      });
      return;
    }
    this.loaderService.show();
    this.authenticationService.ResetPassword(this.resetPassword.UserId, this.resetPassword.Password).then(res => {
      this.message.push({
        severity: 'success',
        summary: 'success Message', detail: 'Password successfully changed'
      });
      this.loaderService.hide();
      this.localStorageService.removeLogin();
      this.router.navigate(['login/' + this.message[this.message.length - 1].detail]);
    }).catch(error => {
        console.log(error);
      });
    return this.message;
  }

  private checkToken() {
    let token = this.route.snapshot.params['token'] || 0;
    this.authenticationService.CheckToken(token).then(res => {
      let user = res.data;
      this.resetPassword.UserName = user.FirstName + ' ' + user.LastName + '(' + user.Email + ')';
      this.resetPassword.UserId = res.data.Id;
    }).catch(error => {
      this.isInvalidToken = true;
    });
  }
}
