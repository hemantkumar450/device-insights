
import { Component, OnInit, ViewChild } from '@angular/core';
import { SmartLabModel, SmartLabService } from './shared';
import { QualityControlService } from '../quality-control';
import { Message } from 'primeng/primeng';
import { Paginator } from '../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../shared';
import { PaginationEnum } from '../shared/enums';
import { LoaderService } from '../../core/loader/loader.service';
import { LocalStorageService } from '../../core/shared/services/index';
import { DefaultModule } from '../shared/enums/index';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-smart-lab',
  templateUrl: './smart-lab.component.html',
})

export class SmartLabComponent implements OnInit {

  public labs: Array<SmartLabModel> = [];
  public pageSize: number = PaginationEnum.PageSize;
  public totalRecords: number = 0;
  public errorMessage: Array<Message> = [];
  currentUser: any;
  PBmodel: pbi.IEmbedConfiguration;
  tokenType = pbi.Embed;
  title: string;
  report: pbi.Report;
  pages: pbi.Page[];
  currentPage: pbi.Page;
  powerbi: pbi.service.Service;
  powerbiAccessToken = ''; // token from api
  powerbireportID = 'b42b26ad-3822-4d11-a643-d657778fa350'; // reportid
  powerbigroupID = 'a0ecc01d-5214-4a4f-96a4-0aedc7958764'; // group id
  embedURL = 'https://app.powerbi.com/reportEmbed?reportId=' + this.powerbireportID + '&groupId=' + this.powerbigroupID;

  constructor(private smartLabService: SmartLabService,
    private qualityControlService: QualityControlService,
    public routeService: RouteService,
    private localStorageService: LocalStorageService,
    public paginationService: PaginationService) {
    this.currentUser = this.localStorageService.getCurrentUser();
    this.checkSMChart();
  }

  ngOnInit() {
  }

  checkSMChart() {
    let SMChartData = JSON.parse(this.localStorageService.getSMDashboard());
    if (!SMChartData) {
      this.getSMartLabChart();
    } else {
      let currentTime = new Date().getTime();
      let diff = currentTime - SMChartData.chartSetTime;
      diff = (diff / (1000 * 60)) % 60;
      if (diff > 20) {
        this.getSMartLabChart();
      } else {
        this.powerbireportID = SMChartData.reportId;
        this.powerbigroupID = SMChartData.groupId;
        this.powerbiAccessToken = SMChartData.token;
        setTimeout(() => { this.showReport(); }, 1000)

      }
    }
  }

  getSMartLabChart() {
    let labId = this.currentUser.labIds[0];
    this.qualityControlService.getModuleChartByModuleId(labId, DefaultModule.SmartLabMonitoring).then(result => {
      if (result.data) {
        result.data.chartSetTime = new Date().getTime();
        this.localStorageService.setSMDashboard(result.data);
        this.powerbireportID = result.data.reportId;
        this.powerbigroupID = result.data.groupId;
        this.powerbiAccessToken = result.data.token;
        this.showReport();
      } else {
        this.errorMessage.push({ severity: 'error', summary: '', detail: 'No data available.So Chart will not prepare' });
      }
    });
  }

  showReport() {
    this.embedURL = 'https://app.powerbi.com/reportEmbed?reportId=' + this.powerbireportID + '&groupId=' + this.powerbigroupID;
    let config: any = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: this.powerbiAccessToken,
      embedUrl: this.embedURL,//'https://app.powerbi.com/reportEmbed?reportId=3bda68fe-de34-4dc5-b2c2-ad4fdc2a31b6&groupId=a0ecc01d-5214-4a4f-96a4-0aedc7958764',
      id: this.powerbireportID,
      permissions: pbi.models.Permissions.All,
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: true
      }
    };
    // Grab the reference to the div HTML element that will host the report.
    let reportContainer = <HTMLElement>document.getElementById('pbi-report');

    // Embed the report and display it within the div container.

    this.powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    if (reportContainer) {
      this.report = <pbi.Report>this.powerbi.embed(reportContainer, config);

      // Report.off removes a given event handler if it exists.
      this.report.off("loaded");

      this.report.off("pageChanged");

      this.report.on("pageChanged", e => {
      });
    }
  }
}
