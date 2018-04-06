import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { RouteService, PaginationService } from '../../../shared';
import { Paginator } from '../../../core/paginator/paginator';
import { Message } from 'primeng/primeng';
import { PaginationEnum } from '../../shared/enums';
import { LocalStorageService } from '../../../core/shared/services/index';
import { SmartMaintenanceItem, SmartMaintenanceItemService } from '../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { DefaultRole } from '../../shared/enums/index';
import { CustomDDO, MasterService } from '../../shared';

@Component({
    selector: 'app-smart-maintenance-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})

export class SmartMaintenanceItemComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;
    pageSize: number = PaginationEnum.PageSize;
    totalRecords: number = 0;
    items: Array<SmartMaintenanceItem> = new Array<SmartMaintenanceItem>();
    item = new SmartMaintenanceItem();
    isAppAdmin: boolean = false;
    isAdd: boolean = false;
    currentUser: any;
    frequencies: Array<CustomDDO> = [];
    itemTypes: Array<CustomDDO> = [{ label: 'Radio Button', value: 1 }, { label: 'Text', value: 2 }];
    instruments: Array<CustomDDO> = [];
    errorMsg: Message[] = [];

    constructor(
        public paginationService: PaginationService,
        private loaderService: LoaderService,
        private masterService: MasterService,
        public confirmationService: ConfirmationService,
        private smartMaintenanceItemService: SmartMaintenanceItemService,
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
                this.getItem();
            } else {
                this.errorMsg.push({
                    severity: 'error',
                    summary: 'Warn Message',
                    detail: 'please add instrument first.'
                });
            };
            this.loaderService.hide();
        })
    }

    public getItem() {
        if (this.isAdd) {
            return;
        }
        let labId = this.currentUser.labIds[0];
        this.loaderService.show();
        this.smartMaintenanceItemService.getItems(this.paginationService.getParams(),
            labId,
            this.item.INSTR_ID,
            this.item.FREQ_ID).then(result => {
                this.items = result.data.Data;
                this.totalRecords = result.data.TotalRecords;
                this.items.forEach(element => {
                    element.isEdit = false;
                    return element;
                });
                this.loaderService.hide();
            });
    }

    public addItem() {
        this.item = new SmartMaintenanceItem();
        let isEdit = this.checkEditCase();
        if (isEdit) {
            this.isAdd = true;
        }
    }

    checkEditCase() {
        let count = 0;
        let isEdit = false;
        this.items.forEach(item => {
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

    private editItem(item: SmartMaintenanceItem): void {
        if (this.isAdd) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please cancel the add option' });
            return;
        } else {
            this.isAdd = false;
        }
        item.isEdit = this.checkEditCase();
    }

    public saveItem(item: SmartMaintenanceItem) {
        if (item.ITEM_NAME.trim() === '') {
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
        item.ITEM_NAME = item.ITEM_NAME.trim();
        item.LAB_ID = this.currentUser.labIds[0];
        this.loaderService.show();
        this.smartMaintenanceItemService.saveItem(item).then(result => {
            this.isAdd = false;
            this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record added successfully' });
            this.getItem();
        })
    }

    private deleteItem(item: SmartMaintenanceItem) {
        this.isAdd = false;
        this.confirmationService.confirm({
            message: 'It will delete all its related rows from Item Mapping table.' +
                'Are you sure that you want to delete - ' + item.ITEM_NAME + ' ?',
            icon: 'fa fa-trash',
            accept: () => {
                this.loaderService.show();
                this.smartMaintenanceItemService.deleteItemById(item.ITEM_ID).then(result => {
                    this.getItem();
                    this.errorMsg.push({ severity: 'success', summary: '', detail: 'Record deleted successfully' });
                })
            }
        });
    }


    cancel() {
        this.isAdd = false;
    }

    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getItem();
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getItem();
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getItem();
    }

}
