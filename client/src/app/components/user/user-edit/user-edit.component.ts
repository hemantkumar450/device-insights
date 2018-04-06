import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from './../../../shared';
import { UserModel, UserService } from '../shared';
import { Message } from 'primeng/primeng';
import { CustomDDO } from './../../shared/models/custom-ddo.model';
import { LocalStorageService, CommonService } from '../../../core/shared/services/index';
import { PaginationEnum, DefaultRole } from '../../shared/enums';
import { LabService } from '../../lab/shared/lab.service';
import { EmailValidateService } from '../../shared/services/email-validate.component';
import { MasterService } from '../../shared/master.service';
import { LoaderService } from '../../../core/loader/loader.service';
import { ConfirmationService } from 'primeng/primeng';


export class SuperCustomDDO {
  id: number = 0;
  itemName: string = '';
}


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: any;
  @ViewChild('dropDownThing') dropDownThing: any;
  labId: number;
  showUserType: boolean = true;
  currentUser: any;
  errorMsg: Message[] = [];
  user: UserModel = new UserModel();
  gender: Array<any> = [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }];
  martialStatus: Array<any> = [{ label: 'Single', value: 'Single' }, { label: 'Married', value: 'Married' }];
  labList: Array<CustomDDO> = [];
  superLabList: Array<any> = [];
  labIds: Array<any> = [];
  userRoleId: string = '4';
  isSuperAdminLogin: boolean = false;
  isEmailExist: boolean = false;
  isEmailValid: boolean = false;
  isGetUserByAppAdmin: boolean = false;
  pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  dropdownSettings = {
    singleSelection: false,
    text: "Select Lab",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: "myclass custom-class"
  };

  constructor(
    private userService: UserService,
    private routeService: RouteService,
    private router: Router,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    public route: ActivatedRoute, private labService: LabService,
    public confirmationService: ConfirmationService,
    public masterService: MasterService,
    private emailValidateService: EmailValidateService) { }

  ngOnInit() {
    this.user.USER_ID = this.route.snapshot.params['id'] || 0;
    this.getDefaultParams();
    this.currentUser = this.localStorageService.getCurrentUser();
    if (this.localStorageService.getLoggedUser()) {
      if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
        this.isGetUserByAppAdmin = true;
      }
    }
    if (this.currentUser.userId === +this.user.USER_ID && this.currentUser.roleId === DefaultRole.SuperAdmin) {
      this.isSuperAdminLogin = true;
    }
    this.superLabDDOLoad(this.currentUser.roleId);
    this.setUserRole(true);
  }

  getDefaultParams(): void {
    if (this.user.USER_ID > 0) {
      this.getUserById();
    } else {
      this.user.IS_ACTIVE = true;
    }
  }

  private getUserById(): void {
    this.loaderService.show();
    this.userService.getUserById(this.user.USER_ID).then((result) => {
      this.user = result.data;
      if (this.user.ICON === 'null') {
        this.user.ICON = null;
      }
      this.user.CONFIRM_PASSWORD = '';
      switch (this.user.RoleId) {
        case 1:
          this.userRoleId = '1';
          break;
        case 2:
          this.userRoleId = '2';
          this.setLabIds();
          break;
        case 3:
          this.userRoleId = '3';
          this.user.LabId = this.user.LabIds[0];
          break;
        case 4:
          this.userRoleId = '4';
          this.user.LabId = this.user.LabIds[0];
          break;
        case 5:
          this.userRoleId = '5';
          this.setLabIds();
          break;
      }
      this.loaderService.hide();
    });
  }

  setLabIds() {
    this.user.LabIds.forEach(id => {
      this.superLabList.forEach(lab => {
        if (id === lab.id) {
          this.labIds.splice(this.labIds.length, 0, lab);
        }
      });
    });
  }

  emailCheckHandler(event) {
    if (event.keyCode === 8) {
      this.isEmailValid = false;
    }
  }

  emailValidate() {

    this.isEmailExist = false;
    this.isEmailValid = false;

    if (this.currentUser.roleId === DefaultRole.LabAdmin) {
      this.user.LabId = this.currentUser.labIds[0];
    }
    if (this.user.RoleId === DefaultRole.SuperAdmin) {
      this.user.LabId = 0;
    }
    if (this.pattern.test(this.user.EMAIL_ID)) {
      this.loaderService.show();
      this.userService.emailValidate(this.user.EMAIL_ID).then((result) => {
        if (result.data === 1) {
          this.isEmailExist = true;
        }
        if (this.isEmailExist && this.user.USER_ID !== 0) {
          this.isEmailExist = false;
        }
        this.loaderService.hide();
      });
    } else {
      if (this.user.EMAIL_ID !== '') {
        this.isEmailValid = true;
      }
    }
  }

  showErrorMessage(message): void {
    this.errorMsg.push({
      severity: 'error',
      detail: message
    });
  }

  setUserRole(isLoad): void {
    if (this.dropDownThing) {
      this.dropDownThing.filterValue = '';
    }
    this.user.LabId = 0;
    this.labIds = [];
    if (this.userRoleId === '1') {
      this.user.RoleId = DefaultRole.ApplicationAdmin;
    } else if (this.userRoleId === '2') {
      this.user.RoleId = DefaultRole.SuperAdmin;
    } else if (this.userRoleId === '3') {
      this.user.RoleId = DefaultRole.LabAdmin;
      this.getLabDDO(this.currentUser.roleId, isLoad);
    } else if (this.userRoleId === '4') {
      this.user.RoleId = DefaultRole.User;
      this.getLabDDO(this.currentUser.roleId, isLoad);
    } else if (this.userRoleId === '5') {
      this.user.RoleId = DefaultRole.SuperUser;
    }
  }

  superLabDDOLoad(roleId) {
    if (roleId === DefaultRole.ApplicationAdmin) {
      this.loaderService.show();
      this.masterService.getLabDDOForApplicationUser().then((res) => {
        this.superLabList = [];
        res.forEach(element => {
          let item: SuperCustomDDO = { id: element.value, itemName: element.label };
          this.superLabList.push(item);
        });
      });
    } else if (roleId === DefaultRole.SuperAdmin) {
      this.loaderService.show();
      this.masterService.getLabDDOForSuperAdminByUserId(this.currentUser.userId).then(result => {
        this.superLabList = [];
        result.forEach(element => {
          let item: SuperCustomDDO = { id: element.value, itemName: element.label };
          this.superLabList.push(item);
        });
      })
    }
  }

  private getLabDDO(roleId, isLoad): void {
    if (roleId === DefaultRole.ApplicationAdmin) {
      this.loaderService.show();
      this.masterService.getLabDDOForApplicationUser().then((res) => {
        this.labList = [];
        this.labList = res;
        if (!isLoad) {
          this.loaderService.hide();
        } else if (this.user.USER_ID === 0) {
          this.loaderService.hide();
        }
      });
    } else if (roleId === DefaultRole.SuperAdmin) {
      this.loaderService.show();
      this.masterService.getLabDDOForSuperAdminByUserId(this.currentUser.userId).then(result => {
        this.labList = [];
        this.labList = result;
        if (!isLoad) {
          this.loaderService.hide();
        } else if (this.user.USER_ID === 0) {
          this.loaderService.hide();
        }
      })
    }
  }

  public imageUploadEvent(fileInput: any) {
    let image = fileInput.target.files[0];
    let size = fileInput.target.files[0].size
    if (size > 10240) {
      this.myInputVariable.nativeElement.value = '';
      this.user.ICON = '';
      let message = 'Image size should be less than 10 KB';
      this.showErrorMessage(message);
      return;
    }

    let FR = new FileReader();
    FR.onload = (e: any) => {
      let type = fileInput.target.files[0].type.split('/')[0];
      if (type === 'image') {
        this.user.ICON = (e.target as any).result;
      } else {
        this.myInputVariable.nativeElement.value = '';
        this.user.ICON = '';
        let message = 'Please choose only image file';
        this.showErrorMessage(message);
      }
    };
    FR.readAsDataURL(fileInput.target.files[0]);
  }

  deleteIcon() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete profile photo ?',
      accept: () => {
        this.loaderService.show();
        this.userService.deleteProfileImageById(this.user.USER_ID).then(result => {
          this.myInputVariable.nativeElement.value = '';
          this.user.ICON = '';
          this.errorMsg.push({ severity: 'success', summary: '', detail: 'image remove successfully' });
          if (this.currentUser.userId === this.user.USER_ID) {
            this.localStorageService.setUserIcon(null);
            this.commonService.notifyOther({ option: 'onSelected', value: 'user profile upload' });

          }
          this.loaderService.hide();
        })
      },
      reject: () => {
      }
    });
  }



  public save(isValid): void {
    let message = '';

    if (this.isEmailExist) {
      return;
    }

    if (this.user.FIRST_NAME.trim() === '') {
      this.user.FIRST_NAME = null;
      return;
    }

    if (this.user.EMAIL_ID.trim() === '') {
      return;
    }

    if (!this.pattern.test(this.user.EMAIL_ID)) {
      return;
    }

    if (this.user.USER_ID === 0 && (this.user.PASSWORD.trim() === '' || this.user.CONFIRM_PASSWORD.trim() === '')) {
      message = 'Please enter password and confirm password field'
      this.showErrorMessage(message);
      return;
    }

    if (this.user.RoleId === DefaultRole.LabAdmin || this.user.RoleId === DefaultRole.User) {
      this.user.LabIds = [];
      if (this.user.LabId && this.user.LabId !== 0) {
        this.user.LabIds.push(this.user.LabId)
      }
    }

    if (this.currentUser.roleId === DefaultRole.LabAdmin || this.currentUser.roleId === DefaultRole.User || this.isGetUserByAppAdmin) {
      this.user.LabIds = [];
      this.user.LabIds.push(this.currentUser.labIds[0])
    }

    if (this.labIds.length > 0) {
      this.user.LabIds = [];
      this.labIds.forEach(lab => {
        this.user.LabIds.splice(this.user.LabIds.length, 0, lab.id);
      })
    }

    if (this.user.RoleId === DefaultRole.ApplicationAdmin) {
      this.user.LabId = 0;
      this.user.LabIds = [];
    }

    if (this.user.LabIds.length === 0 && this.user.RoleId !== DefaultRole.ApplicationAdmin) {
      message = 'Please select Lab for user'
      this.showErrorMessage(message);
      return;
    }

    if (this.user.PASSWORD === this.user.CONFIRM_PASSWORD && this.user.PASSWORD !== '') {
      if (this.user.PASSWORD.length < 4) {
        return;
      }
    }


    if (this.user.PASSWORD !== this.user.CONFIRM_PASSWORD) {
      message = 'Password does not match with confirm password.'
      this.showErrorMessage(message);
      return;
    }

    this.loaderService.show();
    this.userService.saveUser(this.user).then((res) => {
      this.errorMsg.push({
        severity: 'success',
        summary: 'Success Message', detail: 'Save Successfully'
      });

      let admin = this.localStorageService.getLoggedUser();
      if (this.currentUser.userId === this.user.USER_ID && admin === null) {
        this.localStorageService.setUserIcon(this.user.ICON);
        this.commonService.notifyOther({ option: 'onSelected', value: 'user profile upload' });
      }
      this.loaderService.hide();
      this.router.navigate(['ApplicationAdmin/user', { successMessage: true }]);
    });
  }

  public cancel(): void {
    this.routeService.openRoute('user');
  }
}
