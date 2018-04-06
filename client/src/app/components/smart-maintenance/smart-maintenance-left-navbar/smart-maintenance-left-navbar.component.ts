import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../shared/route.service';
import { LocalStorageService, CommonService } from '../../../core/shared/services/index';
import { SmartMaintenanceFrequencyService } from '../shared/smart-maintenance-frequency.service';
import { SmartMaintenanceFrequency } from '../shared/smart-maintenance.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'smart-maintenance-left-navbar',
  templateUrl: './smart-maintenance-left-navbar.component.html',
  styleUrls: ['./smart-maintenance-left-navbar.component.css']
})

export class SmartMaintenanceLeftNavbarComponent implements OnInit {
  leftMenuItems = [];
  folderName: string = 'smartMaintainance';
  id: number = 0;
  frequencyItems: Array<SmartMaintenanceFrequency> = [];
  freqId: number = 0;
  selectedFrequency: string = '';
  private subscription: Subscription;

  constructor(
    public route: ActivatedRoute,
    public routeService: RouteService,
    private commonService: CommonService,
    private smartMaintenanceFrequencyService: SmartMaintenanceFrequencyService,
    private localStorageService: LocalStorageService) {
    this.id = this.route.snapshot.params['id'] || 0;
  }

  ngOnInit() {
    this.getFrequencies();
    this.freqId = +this.route.snapshot.params['freqId'];
    this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItems, this.route.snapshot.url);
    this.leftMenuItems.forEach(item => {
      if (item.isActive) {
        this.commonService.notifyOther({ option: 'onSelectedLeftMenu', value: 'false' });
      }
    });

    this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'onAddFrequency') {
        this.getFrequencies();
      }
    });
  }

  getFrequencies() {
    this.smartMaintenanceFrequencyService.getDynamicFrequencies().then(frequency => {
      this.frequencyItems = frequency.data;
      if (this.frequencyItems.length > 0) {
        this.getleftMenu();
      } else {
        let obj = { title: 'Report', sref: 'smartMaintenance/report', icon: 'emergency-contact.svg', isActive: true }
        this.leftMenuItems.splice(this.leftMenuItems.length, 0, obj);
      }
    })
  }

  getleftMenu() {
    this.leftMenuItems = [];
    this.frequencyItems.forEach((item, index) => {
      let obj = { title: item.FREQ_NAME, sref: 'smartMaintenance/dynamicfrequency/' + item.FREQ_ID, icon: 'dynamic.svg', isActive: false }
      if (item.FREQ_ID === this.freqId && this.route.snapshot.url[0].path !== 'report') {
        obj.isActive = true;
      }
      this.leftMenuItems.splice(this.leftMenuItems.length, 0, obj);
      if (index === this.frequencyItems.length - 1) {
        obj = { title: 'Report', sref: 'smartMaintenance/report', icon: 'reports.svg', isActive: false }
        if (this.route.snapshot.url[0].path === 'report') {
          obj.isActive = true;
        }
        this.leftMenuItems.splice(this.leftMenuItems.length, 0, obj);
      }
    })
  }

  openComponent(item) {
    this.leftMenuItems.forEach(element => {
      if (element.title === item.title) {
        element.isActive = true;
      } else {
        element.isActive = false;
      }
    });
    this.commonService.notifyOther({ option: 'onSelectedLeftMenu', value: 'false' });
    var last = item.sref.substring(item.sref.lastIndexOf("/") + 1, item.sref.length);
    if (+last) {
      this.commonService.notifyOther({ option: 'dynamicFrequencyCall', value: +last });
    }
    this.routeService.openRoute(item.sref);
  }

}
