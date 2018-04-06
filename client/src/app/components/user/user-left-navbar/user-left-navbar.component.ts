import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../shared/route.service';
import { LocalStorageService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../shared/enums/index';

@Component({
  selector: 'user-left-navbar',
  templateUrl: './user-left-navbar.component.html',
  styleUrls: ['./user-left-navbar.component.css']
})

export class UserLeftNavbarComponent implements OnInit {
  leftMenuItems = [];
  leftMenuItemsEdit = [];
  folderName: string = 'user';
  id: number = 0;
  currentUser: any;

  constructor(
    public route: ActivatedRoute,
    public routeService: RouteService,
    private localStorageService: LocalStorageService) {
    this.localStorageService.setTopMenu(this.folderName);
    this.id = this.route.snapshot.params['id'] || 0;
  }

  ngOnInit() {
    this.getleftMenu();
    if (this.localStorageService.getLoggedUser()) {
      this.currentUser = this.localStorageService.getLoggedUser();
    } else {
      this.currentUser = this.localStorageService.getCurrentUser();
    }

    if (this.currentUser.roleId !== DefaultRole.ApplicationAdmin) {
      this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItemsEdit, this.route.snapshot.url);
    } else {
      this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItems, this.route.snapshot.url);
    }
  }

  openComponent(item) {
    this.routeService.openRoute(item.sref);
  }

  getleftMenu() {
    this.leftMenuItems = [
      { title: 'Users', sref: 'user', icon: 'users.svg', isActive: false },
      { title: 'Add User', sref: 'user/add', icon: 'user-info.svg', isActive: false }
    ];
    this.leftMenuItemsEdit = [
      { title: 'Users', sref: 'user', icon: 'users.svg', isActive: false }
    ];
  }
}
