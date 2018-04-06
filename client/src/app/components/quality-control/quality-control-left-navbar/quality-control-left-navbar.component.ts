import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../shared/route.service';
import { LocalStorageService, CommonService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../../components/shared/enums/index';

@Component({
  selector: 'quality-control-left-navbar',
  templateUrl: './quality-control-left-navbar.component.html',
  styleUrls: ['./quality-control-left-navbar.component.css']
})

export class QualityControlLeftNavbarComponent implements OnInit {
  leftMenuItems = [];
  folderName: string = 'QualityControl';
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
      { title: 'LJ Charts', sref: 'qualityControl', icon: 'lj_Charts.svg', isActive: false },
      { title: 'Observed Mean-SD', sref: 'qualityControl/meanSD', icon: 'observed_Mean_SD.svg', isActive: false },
      { title: 'Set Mean-SD', sref: 'qualityControl/adjMeanSD', icon: 'set_Mean_SD.svg', isActive: false },
      { title: 'QC Batch', sref: 'qualityControl/result', icon: 'qc_Batch.svg', isActive: false },
      { title: 'Review', sref: 'qualityControl/review', icon: 'review.svg', isActive: false },
    ];
  }

  openComponent(item) {
    this.routeService.openRoute(item.sref);
  }

}
