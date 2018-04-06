// Import Injectable Decorator
import { Injectable, OnInit } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { LeftMenu } from '../components/shared/models/left-navbar.model';
import { DefaultRole } from '../components/shared/enums/base.enum';
import { LocalStorageService } from '../core/shared/services/index';

// Use @Injectable() to declare the RouteService class as an Injectable
@Injectable()
export class RouteService implements OnInit {

  leftMenuItems: Array<LeftMenu> = [];
  constructor(public router: Router,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit() { }

  getLeftMenus() {
    return this.leftMenuItems;
  }

  activateLeftMenu(leftMenus: LeftMenu[], snapshotUrls: UrlSegment[]) {
    let url = '';
    snapshotUrls.forEach(function (urlSegment) {
      url = url + '/' + urlSegment.path;
    });
    let moduleName = this.localStorageService.getModuleName();
    let topMenu = this.localStorageService.getTopMenu();
    topMenu = topMenu.split('/')[0];
    leftMenus.forEach(function (val) {
      if ('/' + val.sref === '/' + topMenu + url) {
        val.isActive = true;
      } else {
        val.isActive = false;
      }
    })
    this.leftMenuItems = leftMenus;
    return leftMenus;
  }

  activateLeftAllMenu(leftMenus: LeftMenu[], snapshotUrls: UrlSegment[]) {
    let url = snapshotUrls[0].path;
    let topMenu = this.localStorageService.getTopMenu();
    topMenu = topMenu.split('/')[0];
    leftMenus.forEach(function (val) {
      if ('/' + val.sref === '/' + topMenu + '/' + url) {
        val.isActive = true;
      } else {
        val.isActive = false;
      }
    })
    this.leftMenuItems = leftMenus;
    return leftMenus;
  }

  openRoute(stateUrl) {
    this.router.navigate(['/' + this.localStorageService.getModuleName() + '/' + stateUrl]);
  }

  topModuleMenus() {
    let admin: any = this.localStorageService.getLoggedUser();
    let userRole = '';
    if (admin && admin.roleId === DefaultRole.ApplicationAdmin) {
      userRole = 'LabAdmin';
    } else {
      userRole = this.localStorageService.checkUserRole();
    }

    let arr = [];
    switch (userRole) {
      case 'ApplicationAdmin':
        arr = [{ title: 'Application Admin', sref: 'ApplicationAdmin', defaultMenu: 'user' }];
        break;
      case 'SuperAdmin':
        arr = [{ title: 'Super Admin', sref: 'SuperAdmin', defaultMenu: 'dashboard' }];
        break;
      case 'LabAdmin':
        arr = [{ title: 'Lab Admin', sref: 'LabAdmin', defaultMenu: 'dashboard' }];
        break;
      case 'LabUser':
        arr = [{ title: 'User', sref: 'LabUser', defaultMenu: 'dashboard' }];
        break;
      case 'SuperUser':
        arr = [{ title: 'Super User', sref: 'SuperUser', defaultMenu: 'lab' }];
        break;
    }

    return arr;
  }

  getSettingTopMenu(selectedItem) {
    let arr = [];
    switch (selectedItem) {
      case 'Application Admin':
        arr = this.getApplicationAdminTopMenu();
        break;
      case 'Super Admin':
        arr = this.getSuperAdminTopMenu();
        break;
      case 'Super User':
        arr = this.getSuperUserTopMenu();
        break;
      case 'Lab Admin':
        arr = this.getLabAdminTopMenu();
        break;
      case 'User':
        arr = this.getUserTopMenu();
        break;
      case 'Smart Lab Admin':
        arr = this.getSmartLabTopMenu();
        break;
      case 'Smart Lab User':
        arr = this.getSmartLabUserTopMenu();
        break;
      case 'Smart Lab Super Admin':
        arr = this.getSmartLabAdminTopMenu();
        break;
      case 'Quality Control Admin':
        arr = this.getQCAdminTopMenu();
        break;
      case 'Quality Control User':
        arr = this.getQCUserTopMenu();
        break;
      case 'Super Lab Admin':
        arr = this.getSuperLabAdminTopMenu();
        break;
      case 'Super Lab User':
        arr = this.getSuperLabUserTopMenu();
        break;
      case 'Smart Maintenance User':
        arr = this.getSuperMaintenanceUserTopMenu();
        break;
      case 'Smart Maintenance Admin':
        arr = this.getSuperMaintenanceUserTopMenu();
        break;
    }
    return arr;
  }

  getSuperMaintenanceUserTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Frequencies',
        sref: 'smartMaintenance/frequency',
        isActive: false
      },
      {
        title: 'Instruments',
        sref: 'smartMaintenance/instrument',
        isActive: false
      },
      {
        title: 'Items',
        sref: 'smartMaintenance/item',
        isActive: false
      },
      {
        title: 'Item Mapping',
        sref: 'smartMaintenance/itemMapping',
        isActive: false
      }
    ]
  }

  getSuperLabUserTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Labs',
        sref: 'lab',
        isActive: false
      }
    ]
  }

  getSuperLabAdminTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Labs',
        sref: 'lab',
        isActive: false
      }
    ]
  }

  getSmartLabUserTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      }
    ]
  }

  getQCUserTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Instruments',
        sref: 'qualityControl/instrument',
        isActive: false
      },
      {
        title: 'Compounds',
        sref: 'qualityControl/compound',
        isActive: false
      },
      {
        title: 'QC Levels',
        sref: 'qualityControl/method',
        isActive: false
      },
      {
        title: 'Reasons',
        sref: 'qualityControl/reason',
        isActive: false
      }
    ]
  }


  getQCAdminTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Instruments',
        sref: 'qualityControl/instrument',
        isActive: false
      },
      {
        title: 'Compounds',
        sref: 'qualityControl/compound',
        isActive: false
      },
      {
        title: 'QC Levels',
        sref: 'qualityControl/method',
        isActive: false
      },
      {
        title: 'Reasons',
        sref: 'qualityControl/reason',
        isActive: false
      }
    ]
  }

  getSmartLabTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Locations',
        sref: 'smartLab/location',
        isActive: false
      },
      {
        title: 'Devices',
        sref: 'smartLab/device',
        isActive: false
      }
    ]
  }

  getSmartLabAdminTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Locations',
        sref: 'smartLab/location',
        isActive: false
      },
      {
        title: 'Devices',
        sref: 'smartLab/device',
        isActive: false
      },
      {
        title: 'Sensor Types',
        sref: 'sensorType',
        isActive: false
      }
    ]
  }


  getApplicationAdminTopMenu() {
    return [
      {
        title: 'Users',
        sref: 'user',
        isActive: false
      },
      {
        title: 'Labs',
        sref: 'lab',
        isActive: false
      },
      {
        title: 'PBIReports',
        sref: 'pbiReports',
        isActive: false
      }
    ];
  }

  getSuperAdminTopMenu() {
    return [
      {
        title: 'Labs',
        sref: 'lab',
        isActive: false
      }, {
        title: 'Users',
        sref: 'user',
        isActive: false
      }
    ];
  }

  getSuperUserTopMenu() {
    return [
      {
        title: 'Labs',
        sref: 'lab',
        isActive: false
      }
    ];
  }

  getLabAdminTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      },
      {
        title: 'Users',
        sref: 'user',
        isActive: false
      }
    ];
  }

  getUserTopMenu() {
    return [
      {
        title: 'Modules',
        sref: 'dashboard',
        isActive: false
      }
    ];
  }
}
