import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticationService,
  CommonService,
  LocalStorageService
} from '../shared/services/index';
import { Message, ConfirmationService } from 'primeng/primeng';
import { RouteService } from '../../shared/';
import { TopNavbarComponent } from '../top-navbar/';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { TruncatePipe } from '../../components/shared';
import { MasterService } from '../../components/shared'
import { CustomDDO } from '../../components/shared/models/custom-ddo.model';
import { DefaultRole } from '../../components/shared/enums/base.enum';
import { LabService } from '../../components/lab';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, DoCheck {
  userIcon: string = '';
  currentUser: any = {};
  labDDO: Array<CustomDDO> = [];
  logo: string = '';
  labId: number = 0;
  currentTime: Date = new Date();
  breadcrumbs: string = 'No Breadcrumbs';
  errorMsg: Message[] = [];
  showDialog: boolean = false;
  changePasswordDialog: boolean = false;
  loggedAsAdmin: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  isInvalidPasswordValidation = false;
  isLoggedUser: boolean = false;
  private subscription: Subscription;
  count: number = 0;



  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private loaderService: LoaderService,
    public confirmationService: ConfirmationService,
    private commonService: CommonService,
    public route: ActivatedRoute,
    private masterService: MasterService,
    private labService: LabService,
    private localStorageService: LocalStorageService,
    public routeService: RouteService) {
    this.userIcon = this.localStorageService.getUserIcon();
    this.setUserLogo();
  }

  ngOnInit() {
    if (this.localStorageService.getLoggedUser()) {
      this.isLoggedUser = true;
    } else {
      this.isLoggedUser = false;
    }


    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.currentUser.roleId === DefaultRole.User
      || this.currentUser.roleId === DefaultRole.LabAdmin) {
      this.isLoggedUser = true;
    }

    if (this.currentUser.roleId !== DefaultRole.User) {
      this.loggedAsAdmin = true;
    }
    this.setLogo();

    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'onSelected') {
        if (res.value === 'user profile upload') {
          this.setUserLogo();
        }
      }

      if (res.hasOwnProperty('option') && res.option === 'onLogoChange') {
        if (res.value > 0) {
          if (this.count === 0) {
            this.onLogoChange(res.value);
            this.count++;
          }

        }
      }

    });
  }

  ngDoCheck() {
    this.currentUser = this.localStorageService.getCurrentUser();
    this.setLogo();
  }

  setUserLogo() {
    this.userIcon = this.localStorageService.getUserIcon();
    if (this.userIcon === "null") {
      this.userIcon = null;
    }
    if (this.userIcon) {
      this.userIcon = this.userIcon.replace(/\"/g, "");
    }
  }

  setLogo() {
    let logo = this.localStorageService.getLabLogo();
    if (logo) {
      this.logo = logo.replace(/\"/g, "");
    } else {
      this.logo = null;
    }
  }

  openProfile() {
    let admin = this.localStorageService.getLoggedUser();
    this.errorMsg = [];

    if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
      this.getLabDDOForApplicationUser(); /* Application Admin get all labs*/
    } else {
      this.password = '';
      this.confirmPassword = '';
      this.changePasswordDialog = true;
    }

    this.loggedAsAdmin = false;
    if (admin === null) {
      this.loggedAsAdmin = true;
    } else {
      this.labId = this.currentUser.labIds[0];
    }
  }

  checkPasswordValidation(event) {
    this.isInvalidPasswordValidation = false;
    if (this.password.length < 4) {
      this.isInvalidPasswordValidation = true;
    }
  }

  changePassword() {
    this.errorMsg = [];
    if (this.password.trim() === '') {
      this.errorMsg.push({
        severity: 'warn',
        summary: '', detail: 'Both fields are mandatory'
      });
      return;
    }

    if (this.isInvalidPasswordValidation) {
      return;
    }

    if (this.password.trim() !== this.confirmPassword.trim()) {
      this.errorMsg.push({
        severity: 'warn',
        summary: '', detail: ' Please enter same password'
      });
      return;
    } else {
      let admin = this.localStorageService.getLoggedUser();
      this.changePasswordDialog = false;
      this.loaderService.show();
      if (admin) {
        this.authenticationService.changeSuperUserPassword(this.password, admin.userId).then(result => {
          this.loaderService.hide();
          this.logout();
        });
      } else {
        this.authenticationService.changeUserPassword(this.password).then(result => {
          this.loaderService.hide();
          this.logout();
        });
      }
    }

  }

  adminSignIn() {
    let admin = this.localStorageService.getLoggedUser();
    this.localStorageService.setCurrentUser(admin);
    this.localStorageService.removeLoggedUser();
    this.showDialog = false;
    this.loggedAsAdmin = true;
    let domainName = ''
    if (admin.roleId === DefaultRole.SuperUser) {
      domainName = 'user';
    } else {
      domainName = this.route.snapshot.url[1].path;
    }
    this.commonService.notifyOther({ option: 'onSelected', value: admin.roleId });
    if (domainName === 'user') {
      this.routeService.openRoute('user/all');
    }
    localStorage.removeItem('labLogo');
    localStorage.removeItem('QCDashboard');
    this.labId = 0;
  }

  getLabDDOForApplicationUser() {
    this.loaderService.show();
    this.masterService.getLabDDOForApplicationUser().then(result => {
      this.labDDO = [];
      this.labDDO = result;
      this.loaderService.hide();
      this.showDialog = true;
    })
  }

  onLabSelect() {
    this.errorMsg = [];
    if (!this.labId) {
      this.errorMsg.push({
        severity: 'warn',
        summary: '', detail: 'Please Select Lab'
      });
      return;
    }
    if (this.labId === this.currentUser.labIds[0] && this.currentUser === null) {
      this.errorMsg.push({
        severity: 'warn',
        summary: '', detail: 'Already selected the same lab'
      });
      return;
    }
    this.showDialog = false;
    this.loaderService.show();
    this.authenticationService.changeLab(this.labId).then(result => {
      if (this.localStorageService.getLoggedUser() === null) {
        this.localStorageService.setLoggedUser();
      }
      this.localStorageService.setCurrentUser(result.data);
      this.localStorageService.setTopMenu('dashboard');

      this.commonService.notifyOther({ option: 'onSelected', value: DefaultRole.LabAdmin });
      this.loggedAsAdmin = false;
      let domainName = this.route.snapshot.url[1].path;
      this.onLogoChange(this.labId);
      if (domainName === 'dashboard') {
        this.commonService.notifyOther({ option: 'onSelected', value: 'dashboard' });
      }

    });
  }

  onLogoChange(id) {
    this.labService.getLogo(id).then(result => {
      if (result.data) {
        this.localStorageService.setLabLogo(result.data);
      } else {
        localStorage.removeItem('labLogo');
      }

      this.showDialog = false;
      this.loaderService.hide();
      this.setLogo();
    });
  }

  logout() {
    this.localStorageService.removeLogin();
    this.router.navigate(['login']);
  }
}
