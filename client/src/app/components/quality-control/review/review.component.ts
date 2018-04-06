
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityControlService, QualityControlCompound, QualityControlReview } from '../shared';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { Paginator } from '../../../core/paginator/paginator';
import { RouteService, PaginationService } from '../../../shared';
import { PaginationEnum } from '../../shared/enums';
import { Message } from 'primeng/primeng';
import { CustomDDO, MasterService } from '../../shared';
import { LoaderService } from '../../../core/loader/loader.service';
import { LocalStorageService } from '../../../core/shared/services/index';
import { DefaultRole } from '../../../components/shared/enums/index';

@Component({
    selector: 'app-quality-control-review',
    templateUrl: './review.component.html',
})

export class QualityControlReviewComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    @ViewChild(Paginator) paginatorComponent: Paginator;

    public pageSize: number = PaginationEnum.PageSize;
    public totalRecords: number = 0;
    public errorMsg: Message[] = [];
    currentUser: any;
    loggedUser: any;

    statusArray: Array<any> = [
        { label: 'Pending', value: 'Pending' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Approved', value: 'Approved' }
    ];

    statusId: number = 0;
    isReviewMonth: boolean = false;
    isAdmin: boolean = false;
    yearId: number = 0;
    instrumentId: number = 0;
    yearArray: Array<CustomDDO> = [];
    instruments: Array<CustomDDO> = [];
    reviewArray: Array<QualityControlReview> = [];
    reviews: Array<QualityControlReview> = [];

    constructor(
        public paginationService: PaginationService,
        private routeService: RouteService,
        private loaderService: LoaderService,
        private masterService: MasterService,
        private localStorageService: LocalStorageService,
        public confirmationService: ConfirmationService,
        private qualityControlService: QualityControlService) {
        this.paginationService.setDefaultPage();
        this.currentUser = this.localStorageService.getCurrentUser();
        this.loggedUser = this.localStorageService.getLoggedUser();
        this.currentUser = this.localStorageService.getCurrentUser();

        if (this.currentUser.roleId === DefaultRole.User || this.currentUser.roleId === DefaultRole.SuperUser) {
            this.isAdmin = false;
        } else {
            this.isAdmin = true;
        }
    }

    ngOnInit() {
        this.getInstruments();
    }

    getInstruments() {
        this.loaderService.show();
        let labId = this.currentUser.labIds[0];
        this.instruments = [];
        this.masterService.getInstruments(labId).then(result => {
            if (result.length > 0) {
                this.instruments = result;
                this.instrumentId = this.instruments[0].value;
                this.getYearDDO();
            } else {
                this.yearId = 0;
                this.loaderService.hide();
            }
        });
    }

    getYearDDO() {
        this.loaderService.show();
        this.yearArray = [];
        this.yearId = 0;
        this.masterService.getMeanYearDDO(this.currentUser.labIds[0], this.instrumentId).then(result => {
            if (result.length !== 0) {
                this.yearArray = result;
                this.yearId = this.yearArray[0].value;
            } else {
                this.yearId = 0;
            }
            this.getReviewByMonth();
        });
    }

    getReviewByMonth() {
        this.loaderService.show();
        let labId = this.currentUser.labIds[0];
        this.qualityControlService.getReviewByMonth(labId,
            this.instrumentId, this.yearId).then(response => {
                let data = response.data;
                let item: any = data.find(i => i.LAB_ID && i.LAB_ID === labId);
                if (!item) {
                    item = {};
                    item.LAB_ID = labId;
                    item.INSTRUMENT_ID = this.instrumentId;
                    item.YEAR = this.yearId;
                }

                data.forEach(review => {
                    review.LAB_ID = item.LAB_ID;
                    review.INSTRUMENT_ID = item.INSTRUMENT_ID;
                    review.YEAR = item.YEAR;
                    this.instruments.forEach(instrument => {
                        if (instrument.value === review.INSTRUMENT_ID) {
                            review.INSTRUMENT_NAME = instrument.label;
                        }
                    })
                });

                this.reviewArray = this.createdReviewByMonth(data);
                this.reviews = this.reviewArray.map(x => Object.assign({}, x));

                this.loaderService.hide();
            });
    }


    createdReviewByMonth(data: Array<QualityControlReview>) {
        data.forEach(element => {
            element.MONTH_NAME = this.masterService.getMonthName(element.MONTH)
        });
        return data;
    }

    reviewBatch(rowItem: QualityControlReview) {
        if (this.yearId === 0) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please select atleast one year' });
            return;
        }
        let month = this.masterService.getMonthName(rowItem.MONTH);
        let str = 'I confirm the review of  All Batches of ' + month + ' month of year ' + this.yearId;
        this.confirmationService.confirm({
            message: str,
            accept: () => {
                this.loaderService.show();
                this.qualityControlService.reviewBatchByMonth(rowItem.INSTRUMENT_ID, rowItem.MONTH, rowItem.YEAR, this.currentUser.userId).then(response => {
                    this.loaderService.hide();
                    let value: any = response.data;
                    if (value === 1) {
                        this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Already reviewed by someone else' });
                    } else {
                        this.errorMsg.push({ severity: 'success', summary: 'Warn Message', detail: 'Reviewed Successfully' });
                    }
                    this.getReviewByMonth();
                });
            },
            reject: () => {
            }
        });
    }

    public fileUploadEvent(fileInput: any, result: QualityControlReview, index) {
        let image = fileInput.target.files[0];
        let size = fileInput.target.files[0].size

        let FR = new FileReader();
        FR.onload = (e: any) => {
            let type = fileInput.target.files[0].type.split('/')[1];
            if (type === 'pdf') {
                let obj =
                    {
                        fileBase64: (e.target as any).result,
                        LAB_ID: this.currentUser.labIds[0],
                        INSTRUMENT_ID: result.INSTRUMENT_ID,
                        MONTH: result.MONTH,
                        YEAR: result.YEAR
                    }
                this.loaderService.show();
                this.qualityControlService.uploadReviewBatchFile(obj).then(response => {
                    this.errorMsg.push({ severity: 'success', summary: 'Warn Message', detail: 'Your file is uploaded successfully.' });
                    this.getReviewByMonth();
                });

            } else { }
        };
        FR.readAsDataURL(fileInput.target.files[0]);
    }

    changeStatusEvent(rowItem: QualityControlReview) {

        let item = this.reviews.find(i => i.LAB_ID === rowItem.LAB_ID
            && i.INSTRUMENT_ID === rowItem.INSTRUMENT_ID
            && i.YEAR === rowItem.YEAR && i.MONTH === rowItem.MONTH);

        if (rowItem.STATUS === 'Approved' && !rowItem.DOCUMENT_URL) {
            this.errorMsg.push({ severity: 'error', summary: 'Warn Message', detail: 'Please select document before approve' });
            this.reviewArray = this.reviews.map(x => Object.assign({}, x));
            return;
        }

        let str = 'Are you sure want to change the status of this batch?';
        this.confirmationService.confirm({
            message: str,
            accept: () => {
                this.loaderService.show();
                this.qualityControlService.updateReviewBatchStatus(rowItem).then(response => {
                    this.getReviewByMonth();
                });
            },
            reject: () => {
                rowItem.STATUS = item.STATUS;
            }
        });
    }

    deleteDocumentFile(item: QualityControlReview) {
        let str = 'Are you sure want to delete this pdf?';
        this.confirmationService.confirm({
            message: str,
            accept: () => {
                this.loaderService.show();
                this.qualityControlService.deleteReviewBatchFile(this.currentUser.labIds[0],
                    item.INSTRUMENT_ID, item.MONTH, item.YEAR).then(response => {
                        this.getReviewByMonth();
                    });
            }
        });
    }

    downloadDocumentFile(item: QualityControlReview) {
        window.open(item.DOCUMENT_URL);
    }

    saveQCReviewBatchByMonth(item: QualityControlReview) {
        let month = this.masterService.getMonthName(item.MONTH);
        let str = 'Are you sure you want to review the month of ' + month + '?'
        this.confirmationService.confirm({
            message: str,
            accept: () => {
                this.loaderService.show();
                this.qualityControlService.saveQCReviewBatchByMonth(this.currentUser.labIds[0],
                    item.INSTRUMENT_ID, item.MONTH, item.YEAR, this.currentUser.userId).then(response => {
                        this.getReviewByMonth();
                    });
            },
            reject: () => {
            }
        });
    }


    deleteQCReviewBatchByMonth(item: QualityControlReview) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this review ?',
            accept: () => {
                this.loaderService.show();
                this.qualityControlService.deleteQCReviewBatchByMonth(item.LAB_ID,
                    item.INSTRUMENT_ID, item.MONTH, item.YEAR).then(response => {
                        this.getReviewByMonth();
                    });
            },
            reject: () => {
            }
        });
    }

    /* call to page change of the grid */
    pageChanged(event) {
        this.paginationService.setPageChange(event);
        this.getReviewByMonth();
    }

    /* call to sorting the grid data */
    onSorting(event) {
        this.paginationService.setSortExpression(event);
        this.getReviewByMonth();
    }

    /* call to filter the grid data */
    onFiltering(event) {
        this.dataTableComponent.reset();
        this.paginatorComponent.first = 0;
        this.paginationService.setFilterValues(event.filters);
        this.getReviewByMonth();
    }

}