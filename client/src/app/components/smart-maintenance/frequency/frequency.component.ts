import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../../shared';
import { Paginator } from '../../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService, CommonService } from '../../../core/shared/services/index';
import { SmartMaintenanceFrequencyService, SmartMaintenanceFrequency } from '../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole } from '../../shared/enums/index';

@Component({
    selector: 'app-smart-maintenance-frequency',
    templateUrl: './frequency.component.html',
    styleUrls: ['./frequency.component.css']
})

export class SmartMaintenanceFrequencyComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;
    public pageSize: number = PaginationEnum.PageSize;
    public totalRecords: number = 0;
    public frequencies: Array<SmartMaintenanceFrequency> = new Array<SmartMaintenanceFrequency>();
    public frequencieArray: Array<SmartMaintenanceFrequency> = new Array<SmartMaintenanceFrequency>();
    public frequency = new SmartMaintenanceFrequency();
    public currentUser: any;
    isAdd: boolean = false;
    isAppAdmin: boolean = false;
    public errorMsg: Message[] = [];

    constructor(
        public paginationService: PaginationService,
        private routeService: RouteService,
        public route: ActivatedRoute,
        private loaderService: LoaderService,
        public confirmationService: ConfirmationService,
        private commonService: CommonService,
        private smartMaintenanceFrequencyService: SmartMaintenanceFrequencyService,
        private localStorageService: LocalStorageService) {
        this.paginationService.setDefaultPage();
        this.currentUser = this.localStorageService.getCurrentUser();
        if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
            this.isAppAdmin = true;
        }
    }

    ngOnInit() {
        this.getFrequency();
    }

    public getFrequency() {
        this.loaderService.show();
        this.smartMaintenanceFrequencyService.getFrequencies(this.paginationService.getParams()).then(result => {
            this.frequencies = result.data.Data;
            this.totalRecords = result.data.TotalRecords;
            this.frequencies.forEach(element => {
                element.isEdit = false;
                return element;
            });
            this.frequencieArray = this.frequencies.map(x => Object.assign({}, x));
            this.loaderService.hide();
        })
    }

    public addFrequency() {
        this.frequency = new SmartMaintenanceFrequency();
        let isEdit = this.checkEditCase();
        if (isEdit) {
            this.isAdd = true;
        }
    }

    checkEditCase() {
        let count = 0;
        let isEdit = false;
        this.frequencies.forEach(location => {
            if (location.isEdit) {
                count++;
            }
        });
        if (count > 0) {
            isEdit = false;
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'First save previous edit' });
        } else {
            isEdit = true;
        }
        return isEdit;
    }

    private editFrequency(frequency: SmartMaintenanceFrequency): void {
        this.isAdd = false;
        frequency.isEdit = this.checkEditCase();
    }

    public saveFrequency(frequency: SmartMaintenanceFrequency) {
        if (frequency.FREQ_NAME.trim() === '') {
            this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert frequency name' });
            return;
        }
        frequency.FREQ_NAME = frequency.FREQ_NAME.trim();
        this.loaderService.show();
        this.smartMaintenanceFrequencyService.saveFrequency(frequency).then(result => {
            this.commonService.notifyOther({ option: 'onAddFrequency', value: 0 });
            this.isAdd = false;
            this.getFrequency();
        })
    }

    cancel() {
        this.isAdd = false;
    }

    cancelfreq(freq) {
        freq.isEdit = false;
        this.frequencies = this.frequencieArray.map(x => Object.assign({}, x));
    }

    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getFrequency();
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getFrequency();
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getFrequency();
    }

}
