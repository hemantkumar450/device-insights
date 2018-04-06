// Import Injectable Decorator
import { Injectable, OnInit } from '@angular/core';
import { PaginationEnum } from '../components/shared/enums/base.enum';

// Use @Injectable() to declare the RouteService class as an Injectable
@Injectable()
export class PaginationService implements OnInit {

  sortExpression = '';
  filterValues = [];
  startPage = 1;

  pageSize = PaginationEnum.PageSize;

  constructor() {
  }

  ngOnInit() {
  }

  setDefaultPage() {
    this.startPage = 1;
    this.pageSize = PaginationEnum.PageSize;
    this.sortExpression = '';
    this.filterValues = [];
  }

  setPageChange(event) {
    this.startPage = 1 + event.page;
    this.pageSize = event.rows;
  }

  getParams() {
    let pagination = {
      PageSize: this.pageSize,
      RunCount: true,
      StartPageNo: this.startPage,
      SortExpression: this.sortExpression
    };
    return Object.assign(pagination, this.filterValues);
  }

  setSortExpression(event) {
    this.sortExpression = '';
    if (event) {
      let orderBy = '';
      if (event.order === -1) {
        orderBy = 'desc';
      }
      this.sortExpression = event.field + ' ' + orderBy;
    }
  }

  setFilterValues(filtersObj) {
    this.setDefaultPage();
    this.filterValues = [];
    let copy = Object.assign({}, filtersObj);
    this._deleteAllProp(filtersObj);
    let filteredObj = this._deleteEmptyProp(copy);
    this.filterValues = this._addPrefixToProp(copy);
  }

  _deleteAllProp(obj) {
    for (let prop in obj) {
      delete obj[prop];
    }
    return obj;
  }

  _deleteEmptyProp(obj) {
    for (let prop in obj) {
      let val = obj[prop].value;
      if (val === undefined || val === null || val.length === 0) {
        delete obj[prop];
      }
    }
    return obj;
  }

  _addPrefixToProp(obj) {
    for (let prop in obj) {
      obj['Filter.' + prop] = obj[prop].value;
      delete obj[prop];
    }
    return obj;
  }

}
