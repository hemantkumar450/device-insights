import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../shared/route.service';
import { LocalStorageService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../shared/enums/index';

@Component({
    selector: 'pbi-reports-left-navbar',
    templateUrl: './pbi-reports-left-navbar.component.html',
    styleUrls: ['./pbi-reports-left-navbar.component.css']
})

export class PBIReportsLeftNavbarComponent implements OnInit {
    leftMenuItems = [];
    folderName: string = 'pbiReports';
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
        this.currentUser = this.localStorageService.getCurrentUser();
        this.leftMenuItems = this.routeService.activateLeftMenu(this.leftMenuItems, this.route.snapshot.url);
    }

    getleftMenu() {
        this.leftMenuItems = [
            { title: 'PBI Reports', sref: 'pbiReports', icon: 'pbiReport.svg', isActive: false },
            { title: 'Add PBI Reports', sref: 'pbiReports/add', icon: 'pbiReport-add.svg', isActive: false }
        ];
    }

    openComponent(item) {
        this.routeService.openRoute(item.sref);
    }

}
