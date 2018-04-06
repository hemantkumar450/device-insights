import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../shared/route.service';
import { LocalStorageService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../shared/enums/index';

@Component({
  selector: 'lab-left-navbar',
  templateUrl: './lab-left-navbar.component.html',
  styleUrls: ['./lab-left-navbar.component.css']
})

export class LabLeftNavbarComponent implements OnInit {
  leftMenuItems = [];
  leftMenuItemsEdit = [];
  folderName: string = 'lab';
  id: number = 0;
  currentUser: any;

  constructor(
    public route: ActivatedRoute,
    public routeService: RouteService,
    private localStorageService: LocalStorageService) {
    this.id = this.route.snapshot.params['id'] || 0;
    this.localStorageService.setTopMenu(this.folderName);
  }
  ngOnInit() {
    this.getleftMenu();
    if (this.localStorageService.getLoggedUser()) {
      this.currentUser = this.localStorageService.getLoggedUser();
    } else {
      this.currentUser = this.localStorageService.getCurrentUser();
    }
    
    if (this.currentUser.roleId === DefaultRole.SuperAdmin || this.currentUser.roleId === DefaultRole.SuperUser) {
      this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItemsEdit, this.route.snapshot.url);
    } else {
      this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItems, this.route.snapshot.url);
    }
  }

  getleftMenu() {
    this.leftMenuItems = [
      { title: 'Laboratories', sref: 'lab', icon: 'lab.svg', isActive: false },
      { title: 'Add Laboratory', sref: 'lab/add', icon: 'lab-edit.svg', isActive: false }
    ];
    this.leftMenuItemsEdit = [
      { title: 'Laboratories', sref: 'lab', icon: 'lab.svg', isActive: false }
    ];
  }

  openComponent(item) {
    this.routeService.openRoute(item.sref);
  }

}
