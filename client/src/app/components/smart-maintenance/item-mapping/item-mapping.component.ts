import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../../shared';
import { Paginator } from '../../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService } from '../../../core/shared/services/index';
import { SmartMaintenanceItemMapping, SmartMaintenanceItemMappingService } from '../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole } from '../../shared/enums/index';
import { CustomDDO, MasterService } from '../../shared';

@Component({
    selector: 'app-smart-maintenance-item-mapping',
    templateUrl: './item-mapping.component.html',
    styleUrls: ['./item-mapping.component.css']
})

export class SmartMaintenanceItemMappingComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;
    pageSize: number = PaginationEnum.PageSize;
    totalRecords: number = 0;
    itemMaps: Array<SmartMaintenanceItemMapping> = new Array<SmartMaintenanceItemMapping>();
    itemMapArray: Array<SmartMaintenanceItemMapping> = new Array<SmartMaintenanceItemMapping>();
    itemMap = new SmartMaintenanceItemMapping();
    isAppAdmin: boolean = false;
    isAdd: boolean = false;
    currentUser: any;
    frequencies: Array<CustomDDO> = [];
    instruments: Array<CustomDDO> = [];
    errorMsg: Message[] = [];

    constructor(
        public paginationService: PaginationService,
        private loaderService: LoaderService,
        private masterService: MasterService,
        public confirmationService: ConfirmationService,
        private smartMaintenanceItemMappingService: SmartMaintenanceItemMappingService,
        private localStorageService: LocalStorageService) {
        this.paginationService.setDefaultPage();
        this.currentUser = this.localStorageService.getCurrentUser();
        if (this.currentUser.roleId === DefaultRole.ApplicationAdmin) {
            this.isAppAdmin = true;
        }
        this.getFrequencies();

    }

    ngOnInit() {
    }


    getFrequencies() {
        this.loaderService.show();
        this.masterService.getIMFrequencyDDO().then(result => {
            if (result.length > 0) {
                this.frequencies = result;
                let obj: CustomDDO = { label: 'All', value: 0 };
                this.frequencies.splice(0, 0, obj);
                this.getInstruments();
            } else {
                this.errorMsg.push({
                    severity: 'error',
                    summary: 'Warn Message',
                    detail: 'please add frequency first.'
                });
            }

            this.loaderService.hide();
        });
    }

    getInstruments() {
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.masterService.getIMInstrumentDDO(labId).then(result => {
            if (result.length > 0) {
                this.instruments = result;
                let obj: CustomDDO = { label: 'All', value: 0 };
                this.instruments.splice(0, 0, obj);
                this.getItemMapping();
            } else {
                this.errorMsg.push({
                    severity: 'error',
                    summary: 'Warn Message',
                    detail: 'please add instrument first.'
                });
            }

            this.loaderService.hide();
        })
    }

    public getItemMapping() {
        if (this.isAdd) {
            return;
        }
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.smartMaintenanceItemMappingService.getItemMapping(this.paginationService.getParams(),
            labId,
            this.itemMap.INSTR_ID,
            this.itemMap.FREQ_ID).then(result => {
                this.itemMaps = result.data.Data;
                this.totalRecords = result.data.TotalRecords;
                this.itemMaps.forEach(element => {
                    element.isEdit = false;
                    return element;
                });
                this.loaderService.hide();
                this.itemMapArray = this.itemMaps.map(x => Object.assign({}, x));
            });

    }

    public addItemMapping() {
        this.itemMap = new SmartMaintenanceItemMapping();
        let isEdit = this.checkEditCase();
        if (isEdit) {
            this.isAdd = true;
        }
    }

    checkEditCase() {
        let count = 0;
        let isEdit = false;
        this.itemMaps.forEach(item => {
            if (item.isEdit) {
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

    private editItemMapping(item: SmartMaintenanceItemMapping): void {
        if (this.isAdd) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please cancel the add option' });
            return;
        } else {
            this.isAdd = false;
        }
        item.isEdit = this.checkEditCase();
    }



    public saveItemMapping(item: SmartMaintenanceItemMapping) {
        if (item.MAP_NAME.trim() === '') {
            this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please insert item name' });
            return;
        }
        if (item.FREQ_ID === 0) {
            this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please select atleast one Frequency' });
            return;
        }
        if (item.INSTR_ID === 0) {
            this.errorMsg.push({ severity: 'error', summary: '', detail: 'Please select atleast one Instrument' });
            return;
        }
        item.MAP_NAME = item.MAP_NAME.trim();
        item.LAB_ID = this.currentUser.labIds[0];
        this.loaderService.show();
        this.smartMaintenanceItemMappingService.saveItemMapping(item).then(result => {
            this.isAdd = false;
            this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
            this.getItemMapping();
        })
    }

    private deleteItemMapping(item: SmartMaintenanceItemMapping) {
        this.isAdd = false;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete - ' + item.MAP_NAME + ' ?',
            icon: 'fa fa-trash',
            accept: () => {
                this.loaderService.show();
                this.smartMaintenanceItemMappingService.deleteItemMappingById(item.MAP_ID).then(result => {
                    this.getItemMapping();
                    this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
                })
            }
        });
    }


    cancel() {
        this.isAdd = false;
    }

    cancelItemMapping(itemMap) {
        itemMap.isEdit = false;
        this.itemMaps = this.itemMapArray.map(x => Object.assign({}, x));
    }

    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getItemMapping();
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getItemMapping();
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getItemMapping();
    }

}
