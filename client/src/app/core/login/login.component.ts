import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteService } from '../../shared/route.service';
import { AuthenticationService, LocalStorageService, CommonService } from '../shared/services/index';
import { Token, Login } from './login.model';
import { Message } from 'primeng/primeng';
import { LabService } from '../../components/lab';
import { LoaderService } from '../loader/loader.service';
import { DefaultRole } from '../../components/shared/enums';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit {

  model: Login = new Login();
  defaultMenu: string = '';
  dropdownMenuItems = [];
  returnUrl: string = '';
  topMenus = [];
  loading = false;
  token: Token;
  public message: string;
  public moduleName: string = 'dashboard';
  public messages: Array<Message> = []

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    public routeService: RouteService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private labService: LabService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService) {
    this.dropdownMenuItems = this.routeService.topModuleMenus();
  }

  ngOnInit() {
    this.message = this.route.snapshot.params['message'];
    let currentUser = this.localStorageService.getCurrentUser();
    if (currentUser) {
      if (this.localStorageService.getModuleName()) {
        this.moduleName = this.localStorageService.getModuleName();
      }

      let selectedModule = this.dropdownMenuItems.filter(val => val.sref === this.moduleName)[0];
      if (selectedModule) {
        this.defaultMenu = selectedModule.defaultMenu;
      }

      this.returnUrl = this.checkUserRole();
      this.router.navigate([this.returnUrl]);

    } else {
      this.localStorageService.removeLogin();
      this.router.navigate(['/login']);
    }
  }

  checkUserRole() {
    let isUser = this.localStorageService.checkUserRole();
    switch (isUser) {
      case 'ApplicationAdmin':
        this.moduleName = 'ApplicationAdmin';
        this.defaultMenu = 'user';
        break;
      case 'SuperAdmin':
        this.moduleName = 'SuperAdmin';
        this.defaultMenu = 'lab';
        break;
      case 'LabAdmin':
        this.moduleName = 'LabAdmin';
        this.defaultMenu = 'dashboard';
        break;
      case 'LabUser':
        this.moduleName = 'LabUser';
        this.defaultMenu = 'dashboard';
        break;
      case 'SuperUser':
        this.moduleName = 'SuperUser';
        this.defaultMenu = 'lab';
        break;
    }
    return '/' + this.moduleName + '/' + this.defaultMenu;
  }

  login() {
    if (this.model.UserName === '') {
      this.messages.push({ severity: 'warn', summary: '', detail: 'UserName required!' });
      return;
    }
    if (this.model.Password === '') {
      this.messages.push({ severity: 'warn', summary: '', detail: 'Password required!' });
      return;
    }

    this.loading = true;
    this.loaderService.show();
    this.authenticationService.login(this.model.UserName, this.model.Password).then(result => {
      this.token = result.data;
      this.commonService.notifyOther({ option: 'onIdleFindEvent', value: 0 });
      if (this.token && this.token.access_token) {
        this.localStorageService.setCurrentUser(this.token);
        if (this.token.userIcon && this.token.userIcon !== 'null') {
          this.localStorageService.setUserIcon(this.token.userIcon);
        }
      }
      if (this.token.roleId === DefaultRole.LabAdmin || this.token.roleId === DefaultRole.User) {
        this.labService.getLogo(this.token.labIds[0]).then(result2 => {
          let data: any = result2.data;
          this.loaderService.hide();
          if (data) {
            this.localStorageService.setLabLogo(data);
          }

          this.setCurrentUser();
        });
      } else {
        this.setCurrentUser();
      }
    }).catch(error => {
      this.loading = false;
      this.messages.push({ severity: 'error', summary: '', detail: error.statusText });
    });
  }

  setCurrentUser() {
    this.returnUrl = this.checkUserRole();
    let splitUrl = this.returnUrl.split('/')[1];
    if (splitUrl) {
      this.localStorageService.setModuleName(splitUrl);
    }
    this.router.navigate([this.returnUrl]);
    this.loading = false;
  }

  public routeForReset() {
    this.router.navigate(['forgot']);
  }
}
