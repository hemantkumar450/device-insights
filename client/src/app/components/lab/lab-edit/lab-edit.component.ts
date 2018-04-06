import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from './../../../shared';
import { LabModel, LabService } from '../shared';
import { UserModel } from '../../user/shared';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from './../../shared';
import { EmailValidateService } from '../../shared/services/email-validate.component'
import { UserService } from '../../user';
import { DefaultRole } from '../../shared/enums';
import { LoaderService } from '../../../core/loader/loader.service';


@Component({
  selector: 'app-lab-edit',
  templateUrl: './lab-edit.component.html',
  styleUrls: ['./lab-edit.component.css']
})

export class LabEditComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: any;
  public errorMsg: Message[] = [];
  public lab: LabModel = new LabModel();
  public states: Array<CustomDDO> = [];
  public modules: Array<CustomDDO> = [];
  public isEmailExist: boolean = false;
  public isEmailValid: boolean = false;
  public isPhoneInvalid: boolean = false;
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  phonePattern = /^\d{10}$/;
  constructor(
    private LabService: LabService,
    private router: Router,
    private routeService: RouteService,
    private masterService: MasterService,
    private loaderService: LoaderService,
    private userService: UserService,
    public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getDefaultParams();
  }

  getDefaultParams() {

    this.lab.LAB_ID = +this.route.snapshot.params['id'] || 0;
    if (this.lab.LAB_ID > 0) {
      this.getLabById(this.lab.LAB_ID);
    } else {
      this.lab.IS_ACTIVE = true;
    }
    this.getStateDDOs();
  }

  getStateDDOs() {
    this.loaderService.show();
    this.masterService.getStateDDOs().then(result => {
      this.states = result;
      this.getModuleDDO();
    });
  }

  getModuleDDO() {
    this.masterService.getModuleDDO().then((res) => {
      this.modules = res;
      if (this.lab.LAB_ID === 0) {
        this.loaderService.hide();
      }
    });
  }

  private getLabById(LAB_ID) {
    this.loaderService.show();
    this.LabService.getLabById(LAB_ID).then((result) => {
      this.lab = result.data;
      this.lab.User = new UserModel();
      this.loaderService.hide();
    });
  }

  emailCheckHandler(event) {
    if (event.keyCode === 8) {
      this.isEmailValid = false;
      this.isEmailExist = false;
    }
  }

  emailValidate() {
    this.isEmailExist = false;

    if (this.emailPattern.test(this.lab.EMAIL)) {
      this.loaderService.show();
      this.userService.emailValidate(this.lab.EMAIL).then((result) => {
        if (result.data === 1) {
          this.isEmailExist = true;
        }
        this.loaderService.hide();
      });
    } else {
      if (this.lab.EMAIL !== '') {
        this.isEmailValid = true;
      }
    }
  }

  phoneCheckHandler(event, isErrorShow) {
    this.isPhoneInvalid = false;
    if (this.lab.PHONE !== '' && !this.phonePattern.test(this.lab.PHONE) && isErrorShow) {
      if (this.lab.PHONE === null) {
        return;
      } else {
        this.isPhoneInvalid = true;
        return;
      }
    }
  }

  public imageUploadEvent(fileInput: any) {
    let image = fileInput.target.files[0];
    let size = fileInput.target.files[0].size
    if (size > 10240) {
      this.myInputVariable.nativeElement.value = '';
      this.lab.ICON = '';
      let message = 'Image size should be less than 10 KB';
      this.showErrorMessage(message);
      return;
    }

    let FR = new FileReader();
    FR.onload = (e) => {
      let type = fileInput.target.files[0].type.split('/')[0];
      if (type === 'image') {
        this.lab.ICON = fileInput.target.files[0].name;
        this.lab.ICON = (e.target as any).result;
      } else {
        this.myInputVariable.nativeElement.value = '';
        this.lab.ICON = '';
        let message = 'Please choose only image file';
        this.showErrorMessage(message);
      };
    }
    FR.readAsDataURL(fileInput.target.files[0]);
  }

  showErrorMessage(message) {
    this.errorMsg.push({
      severity: 'error',
      detail: message
    });
  }

  public save(isValid) {
    let message = '';
    this.isPhoneInvalid = false;

    if (this.isEmailExist) {
      return;
    }

    if (!this.emailPattern.test(this.lab.EMAIL)) {
      return;
    }

    if (this.lab.User.FIRST_NAME.trim() === '' && this.lab.LAB_ID === 0) {
      this.lab.User.FIRST_NAME = null;
      return;
    }

    if (this.lab.User.LAST_NAME.trim() === '' && this.lab.LAB_ID === 0) {
      this.lab.User.LAST_NAME = null;
      return;
    }

    if (this.lab.LAB_NAME.trim() === '' || this.lab.ADDR.trim() === '' ||
      this.lab.ZIP.trim() === '' || this.lab.PHONE.trim() === '' || this.lab.ModuleIds.length === 0) {
      return;
    }

    if (this.lab.PHONE !== '' && !this.phonePattern.test(this.lab.PHONE)) {
      if (this.lab.PHONE === null) {
        return;
      } else {
        this.isPhoneInvalid = true;
        return;
      }
    }

    if (this.lab.STATE_ID === 0) {
      message = 'Please select state';
      this.showErrorMessage(message);
      return;
    }

    if (this.lab.LAB_ID === 0 && (this.lab.User.PASSWORD === '' || this.lab.User.CONFIRM_PASSWORD === '')) {
      message = 'Please Enter Password And Confirm'
      this.showErrorMessage(message);
      return;
    }


    if ((this.lab.User.PASSWORD === this.lab.User.CONFIRM_PASSWORD) && this.lab.User.PASSWORD !== '') {
      if (this.lab.User.PASSWORD.length < 4) {
        return;
      }
    }

    if (this.lab.User.PASSWORD !== this.lab.User.CONFIRM_PASSWORD) {
      message = 'Password does not match with confirm password.'
      this.showErrorMessage(message);
      if (this.lab.LAB_ID === 0) {
        return;
      }
      if (this.lab.User.PASSWORD !== '') {
        return;
      }
    }

    if (this.lab.LATITUTE == null) {
      this.lab.LATITUTE = 0;
    }
    if (this.lab.LONGITUTE == null) {
      this.lab.LONGITUTE = 0;
    }

    this.lab.User.RoleId = DefaultRole.LabAdmin;
    this.lab.User.EMAIL_ID = this.lab.EMAIL.trim();
    this.loaderService.show();
    this.LabService.saveLab(this.lab).then((res) => {
      this.errorMsg.push({
        severity: 'success',
        summary: 'Success Message', detail: 'Save Successfully'
      });
      this.router.navigate(['ApplicationAdmin/lab', { successMessage: true }]);
    });
  }

  public cancel(): void {
    this.routeService.openRoute('lab');
  }
}
