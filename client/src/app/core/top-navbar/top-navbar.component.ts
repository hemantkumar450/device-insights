import { DefaultRole } from '../../components/shared/enums/index';
import { Component, OnInit, DoCheck, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../shared/services/index';
import { RouteService } from '../../shared/route.service';
import { CommonService } from '../shared/services/common.service';
import { Subscription } from 'rxjs/Subscription';




@Component({
  selector: 'top-navbar',
  templateUrl: 'top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})

export class TopNavbarComponent implements OnInit, DoCheck, OnDestroy {

  selectedItem: string = 'Dashboard';
  searchStr = '';
  dropdownMenuItems = [];
  topMenus = [];
  selectedTopMenu: string = '';
  private subscription: Subscription;

  constructor(public router: Router,
    public route: ActivatedRoute,
    public routeService: RouteService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService) {
    this.dropdownMenuItems = this.routeService.topModuleMenus();
  }

  ngOnInit() {
    let moduleName = 'dashboard';
    if (this.localStorageService.getModuleName()) {
      moduleName = this.localStorageService.getModuleName();
    }

    if (moduleName === 'SuperLabAdmin') {
      let loggedUser = this.localStorageService.getLoggedUser()
      if (loggedUser) {
        this.dropdownMenuItems = [{ title: 'Super Lab Admin', sref: 'SuperLabAdmin', defaultMenu: 'SuperLabAdmin' }];
      } else {
        moduleName = 'SuperAdmin';
        this.dropdownMenuItems = [{ title: 'Super Admin', sref: 'SuperAdmin', defaultMenu: 'SuperAdmin' }];
      }
    }

    if (moduleName === 'SuperLabUser') {
      let loggedUser = this.localStorageService.getLoggedUser()
      if (loggedUser) {
        this.dropdownMenuItems = [{ title: 'Super Lab User', sref: 'SuperLabUser', defaultMenu: 'SuperLabUser' }];
      } else {
        moduleName = 'SuperUser';
        this.dropdownMenuItems = [{ title: 'Super User', sref: 'SuperUser', defaultMenu: 'SuperUser' }];

      }
    }

    if (moduleName === 'smartMaintenanceUser') {
      this.dropdownMenuItems = [{ title: 'Smart Maintenance User', sref: 'smartMaintenanceUser', defaultMenu: 'smartMaintenanceUser' }];
    }

    if (moduleName === 'smartMaintenanceAdmin') {
      this.dropdownMenuItems = [{ title: 'Smart Maintenance Admin', sref: 'smartMaintenanceAdmin', defaultMenu: 'smartMaintenanceAdmin' }];
    }

    if (moduleName === 'smartLabUser') {
      this.dropdownMenuItems = [{ title: 'Smart Lab User', sref: 'smartLabUser', defaultMenu: 'smartLabUser' }];
    }

    if (moduleName === 'smartLabAdmin') {
      this.dropdownMenuItems = [{ title: 'Smart Lab Admin', sref: 'smartLabAdmin', defaultMenu: 'smartLabAdmin' }];
    }

    if (moduleName === 'smartLabSuperAdmin') {
      this.dropdownMenuItems = [{ title: 'Smart Lab Super Admin', sref: 'smartLabSuperAdmin', defaultMenu: 'smartLabSuperAdmin' }];
    }

    if (moduleName === 'qualityControlAdmin') {
      this.dropdownMenuItems = [{ title: 'Quality Control Admin', sref: 'qualityControlAdmin', defaultMenu: 'qualityControlAdmin' }];
    }

    if (moduleName === 'qualityControlUser') {
      this.dropdownMenuItems = [{ title: 'Quality Control User', sref: 'qualityControlUser', defaultMenu: 'qualityControlUser' }];
    }

    let selectedModule = this.dropdownMenuItems.filter(val => val.sref === moduleName)[0];
    if (selectedModule) {

      this.selectItem(selectedModule, true);
    } else {
      this.localStorageService.removeLogin();
      this.router.navigate(['login']);
    }

    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'onSelected') {
        let id = +res.value;
        if (id > 0) {
          this.addDropdownMenu(res.value);
        }
      }
      if (res.hasOwnProperty('option') && res.option === 'onSelectedLeftMenu') {
        this.topMenus.forEach(item => {
          item.isActive = false;
        });
      }
    });

    this.initMenu();
  }

  ngDoCheck() { }

  ngOnDestroy() { }

  addDropdownMenu(userRole) {
    let arr = [];
    this.dropdownMenuItems = [];
    let obj = { title: '', sref: '', defaultMenu: '' };
    switch (userRole) {
      case 1:
        obj.title = 'Application Admin';
        obj.sref = 'ApplicationAdmin';
        obj.defaultMenu = 'user';
        arr = [obj];
        break;
      case 2:
        obj.title = 'Super Admin';
        obj.sref = 'SuperAdmin';
        obj.defaultMenu = 'lab';
        arr = [obj];
        break;
      case 3:
        obj.title = 'Lab Admin';
        obj.sref = 'LabAdmin';
        obj.defaultMenu = 'dashboard';
        arr = [obj];
        break;
      case 4:
        obj.title = 'LabUser';
        obj.sref = 'LabUser';
        obj.defaultMenu = 'dashboard';
        arr = [obj];
        break;
      case 5:
        obj.title = 'Super User';
        obj.sref = 'SuperUser';
        obj.defaultMenu = 'lab';
        arr = [obj];
        break;
      case 6:
        obj.title = 'Super Lab Admin'; // called from lab component when superAdmin or Super User logged in
        obj.sref = 'SuperLabAdmin';
        obj.defaultMenu = 'dashboard';
        arr = [obj];
        break;
      case 7:
        obj.title = 'Super Lab User'; // called from lab component when superAdmin or Super User logged in
        obj.sref = 'SuperLabUser';
        obj.defaultMenu = 'dashboard';
        arr = [obj];
        break;
    }

    arr.forEach(item => {
      this.dropdownMenuItems.splice(this.dropdownMenuItems.length, 0, item);
    });

    this.selectItem(obj, undefined)
  }


  changeTopMenu(item) {
    this.selectedTopMenu = item.sref;
    this.localStorageService.setTopMenu(this.selectedTopMenu);
    this.topMenus.forEach(topMenu => {
      if (topMenu.sref === this.selectedTopMenu) {
        topMenu.isActive = true;
      } else {
        topMenu.isActive = false;
      }
    })
    this.router.navigate(['/' + this.localStorageService.getModuleName() + '/' + this.selectedTopMenu]);
  }

  selectItem(item, isChild) {
    this.selectedItem = item.title;

    let index = this.dropdownMenuItems.findIndex(i => i.title === item.title);
    this.dropdownMenuItems.splice(index, 1);
    this.dropdownMenuItems.unshift(item);

    this.localStorageService.setModuleName(item.sref);

    setTimeout(() => {
      let topMenu = this.localStorageService.getTopMenu();
      if (topMenu !== '' && item.defaultMenu !== topMenu) {
        this.selectedTopMenu = topMenu;
      } else {
        this.selectedTopMenu = item.defaultMenu;
      }
      if (!isChild) {
        this.selectedTopMenu = item.defaultMenu;
        this.router.navigate(['/' + item.sref + '/' + this.selectedTopMenu]);
      }
      this.initMenu();
    }, 5);
  }


  initMenu() {
    this.topMenus = [];
    let currentUser = this.localStorageService.getCurrentUser();
    if (currentUser && currentUser.roleId === DefaultRole.User && this.selectedItem === 'LabUser') {
      this.selectedItem = 'Smart Lab User';
    }
    this.topMenus = this.routeService.getSettingTopMenu(this.selectedItem);
    let moduleName = this.localStorageService.getTopMenu();
    let loggedUser = this.localStorageService.getLoggedUser();
    this.topMenus.forEach(topMenu => {
      if (topMenu.sref === moduleName) {
        topMenu.isActive = true;
      } else {
        topMenu.isActive = false;
      }
    })
  }
}
