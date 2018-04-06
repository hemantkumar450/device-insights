import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../shared/route.service';
import { LocalStorageService, CommonService } from '../../../core/shared/services/index';

@Component({
  selector: 'smart-lab-left-navbar',
  templateUrl: './smart-lab-left-navbar.component.html',
  styleUrls: ['./smart-lab-left-navbar.component.css']
})

export class SmartLabLeftNavbarComponent implements OnInit {
  leftMenuItems = [];
  folderName: string = 'smartLab';
  id: number = 0;

  constructor(
    public route: ActivatedRoute,
    public routeService: RouteService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService) {
    this.id = this.route.snapshot.params['id'] || 0;
  }

  ngOnInit() {
    this.getleftMenu();
    this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItems, this.route.snapshot.url);
    this.leftMenuItems.forEach(item => {
      if (item.isActive) {
        this.commonService.notifyOther({ option: 'onSelectedLeftMenu', value: 'false' });
      }
    });
  }

  getleftMenu() {
    this.leftMenuItems = [
      { title: 'Dashboard', sref: 'smartLab', icon: 'dashboard.svg', isActive: false },
      { title: 'Temperature', sref: 'smartLab/temperature', icon: 'temperature.svg', isActive: false },
      { title: 'Humidity', sref: 'smartLab/humidity', icon: 'humidity.svg', isActive: false },
      { title: 'Reports', sref: 'smartLab/report', icon: 'reports.svg', isActive: false }
    ];
  }

  openComponent(item) {
    this.routeService.openRoute(item.sref);
  }

}
