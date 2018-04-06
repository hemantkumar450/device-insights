import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../../shared';
import { Paginator } from '../../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService, CommonService } from '../../../core/shared/services/index';
import {
    SmartMaintenanceService,
    SmartMaintenanceFrequencyService,
    SmartMaintenanceItemService,
    SmartMaintenanceFrequency,
    SmartMaintenanceItem
} from '../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole, SmartMaintananceItemType } from '../../shared/enums/index';
import { Subscription } from 'rxjs/Subscription';
import { CustomDDO, MasterService } from './../../shared';

@Component({
    selector: 'app-smart-maintenance-dynamic-frequency',
    templateUrl: './dynamic-frequency.component.html',
    styleUrls: ['./dynamic-frequency.component.css']
})

export class SmartMaintenanceDynamicFrequencyComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;

    pageSize: number = PaginationEnum.PageSize;
    totalRecords: number = 0;

    items = new Array<SmartMaintenanceItem>();
    firstCol: string = '';
    frequency = new SmartMaintenanceFrequency();
    private subscription: Subscription;

    errorMsg: Message[] = [];
    monthArray: Array<CustomDDO> = [];
    yearArray: Array<CustomDDO> = [];
    instruments: Array<CustomDDO> = [];
    itemMaps: Array<CustomDDO> = [];
    checklistArray: Array<any> = [];
    checklists: Array<any> = [];
    monthId: number = 0;
    yearId: number = 0;
    instrumentId: number = 0;

    currentUser: any;
    isAdd: boolean = false;
    isAppAdmin: boolean = false;


    freqId: number = 0;

    constructor(
        public paginationService: PaginationService,
        public route: ActivatedRoute,
        private loaderService: LoaderService,
        private commonService: CommonService,
        public confirmationService: ConfirmationService,
        private smartMaintenanceFrequencyService: SmartMaintenanceFrequencyService,
        private smartMaintenanceItemService: SmartMaintenanceItemService,
        private masterService: MasterService,
        private smartMaintenanceService: SmartMaintenanceService,
        private localStorageService: LocalStorageService) {
        this.paginationService.setDefaultPage();
        this.currentUser = this.localStorageService.getCurrentUser();
        if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
            this.isAppAdmin = true;
        }
        this.getMonthDDO();
        this.getYearDDO();
        this.getInstrumentDDO();

    }

    ngOnInit() {
        this.freqId = this.route.snapshot.params['freqId'];
        this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
            if (res.hasOwnProperty('option') && res.option === 'dynamicFrequencyCall') {
                this.currentUser = this.localStorageService.getCurrentUser();
                this.freqId = res.value;
                this.getInstrumentDDO();
            }
        });
    }

    getMonthDDO() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getChecklistMonth(labId).then(result => {
            this.monthArray = result;
            if (this.monthArray.length > 0) {
                this.monthId = this.monthArray[0].value;
            }
        });
    }

    getYearDDO() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getChecklistYear(labId).then(result => {
            this.yearArray = result;
            if (this.yearArray.length > 0) {
                this.yearId = this.yearArray[0].value;
            }
        });
    }

    getInstrumentDDO() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getIMInstrumentDDO(labId).then(result => {
            this.instruments = result;
            if (this.instruments.length > 0) {
                this.instrumentId = this.instruments[0].value;
                this.getFrequency(this.freqId);
            } else {
                this.loaderService.hide();
                this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please add instruments' });
            }

        });
    }

    public getFrequency(freqId) {
        this.freqId = freqId;
        this.loaderService.show();
        this.smartMaintenanceFrequencyService.getFrequencyById(this.freqId).then(result => {
            this.frequency = result.data;
            this.getItemByFrequency();
        });
    }

    getItemByFrequency() {
        this.loaderService.show();
        this.smartMaintenanceItemService.getItemByFrequency(this.freqId, this.instrumentId).then(result => {
            this.items = result.data;
            if (this.items.length > 0) {
                this.firstCol = this.items[0].ITEM_NAME;
            }
            this.getChecklistArray();
        });
    }

    getChecklistArray() {
        this.loaderService.show();
        this.smartMaintenanceService.getChecklistArray(
            this.currentUser.labIds[0],
            this.instrumentId,
            this.freqId,
            this.monthId,
            this.yearId
        ).then(checklist => {
            this.isAdd = false;
            this.checklistArray = checklist.data.Data;
            this.totalRecords = checklist.data.TotalRecords;

            this.checklistArray.forEach(element => {
                this.items.forEach((item, index) => {
                    if (item.ITEM_TYPE === 1 && index > 0) {
                        element[item.ITEM_NAME] = element[item.ITEM_NAME] === 'true' ? true : false;
                    }
                    element.isEdit = false;
                    return element;
                });
            });
            this.checklists = this.checklistArray.map(x => Object.assign({}, x));
            if (this.items.length > 0) {
                this.getItemMapDDO();
            } else {
                this.loaderService.hide();
            }
        });
    }

    getItemMapDDO() {
        let labId = this.currentUser.labIds[0];
        let itemId = 0;
        if (this.items.length > 0) {
            itemId = this.items[0].ITEM_ID;
        }
        this.itemMaps = [];
        this.loaderService.show();
        this.masterService.getItemMapDDO(labId, this.instrumentId, this.freqId, itemId).then(result => {
            this.itemMaps = result;
            this.loaderService.hide();
        });
    }


    addCheckList() {
        if (this.itemMaps.length === 0) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please add Item mapping first' });
            return;
        }
        if (this.isAdd) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'First save previous edit' });
            return;
        }
        let obj = {};
        this.items.forEach((item, index) => {
            if (item.ITEM_TYPE === 1 && index !== 0) {
                obj[item.ITEM_NAME] = false;
            } else {
                obj[item.ITEM_NAME] = '';
            }

        });
        obj['isEdit'] = true;
        this.isAdd = true;
        this.checklistArray = [...this.checklistArray, obj];
    }

    editChecklist(item) {
        if (this.itemMaps.length === 0) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please add Item mapping first for edit' });
            return;
        }
        item.isEdit = this.checkEditCase();
        this.isAdd = false;
    }

    checkEditCase() {
        let count = 0;
        let isEdit = false;
        this.checklistArray.forEach(checklist => {
            if (checklist.isEdit) {
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


    toggleClicked(checklist, itemName) {
        let value = checklist[itemName] === true ? 'Yes' : 'No';
        this.confirmationService.confirm({
            message: 'Are you sure that you want to make the value ' + value + ' for this column ?',
            icon: 'fa fa-trash',
            reject: () => {
                checklist[itemName] = !checklist[itemName];
            }
        });
    }

    saveChecklist(item) {
        let isNull = false;
        let date = null;

        let colArray = Object.getOwnPropertyNames(item).sort();
        colArray.forEach(col => {
            if (item[col] === '') {
                isNull = true;
            };
        });
        if (isNull) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'All fields are required.' });
            return;
        }

        if (this.isAdd) {
            item.isEdit = false;
        } else {
            date = item['DATE']
        }
        this.loaderService.show();
        this.smartMaintenanceService.saveChecklist(
            item,
            this.freqId,
            this.currentUser.labIds[0],
            this.instrumentId,
            date
        ).then(checklist => {
            this.isAdd = false;
            this.getChecklistArray();
        });
    }

    deleteChecklist(item) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this row?',
            icon: 'fa fa-trash',
            accept: () => {
                this.loaderService.show();
                this.smartMaintenanceService.deleteChecklistById(item).then(checklist => {
                    this.getChecklistArray();
                });
            }
        });
    }

    cancelDynamicFreq(freq) {
        freq.isEdit = false;
        this.checklistArray = this.checklists.map(x => Object.assign({}, x));
    }

    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getFrequency(this.freqId);
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getFrequency(this.freqId);
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getFrequency(this.freqId);
    }

}
