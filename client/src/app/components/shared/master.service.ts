import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiUrl } from '../../shared';
import { LoaderService } from '../../core/loader/loader.service';

@Injectable()
export class MasterService {

  constructor(private loaderService: LoaderService, private http: Http) { }

  getLabDDOForApplicationUser(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'lab/ddo/applicationUser')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.LAB_NAME, value: item.LAB_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getLabDDOForSmartLabLocations(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'smartLabLocation/ddo')
      .toPromise()
      .then(response => {

        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.LOCATION_NAME, value: item.LOCATION_ID }
          results.push(obj);
        });
        this.loaderService.hide();
        return results;
      })
      .catch(this.handleError);
  }

  getLabDDOForSensorTypes(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'sensorType/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.SENSOR_TYPE_NAME, value: item.SENSOR_TYPE_ID }
          results.push(obj);
        });
        this.loaderService.hide();
        return results;
      })
      .catch(this.handleError);
  }


  getLabDDOForSuperAdminByUserId(userId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'lab/ddo/superUserByUserId/' + userId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.LAB_NAME, value: item.LAB_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getLabDDOForSuperUserByUserId(superAdminId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'lab/ddo/superUserByUserId/' + superAdminId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.LAB_NAME, value: item.LAB_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getStateDDOs(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'state/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.STATE_NAME, value: item.STATE_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getModuleDDO(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'module/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.MODULE_NAME, value: item.MODULE_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getLabDDO(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'lab/master/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.LAB_NAME, value: item.LAB_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  // getMeanSDCompoundDDO(labId): Promise<any> {
  //   return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/compound/ddo/' + labId)
  //     .toPromise()
  //     .then(response => {
  //       let data = response.json();
  //       let results = [];
  //       data.map((item) => {
  //         let obj = { label: item.COMP_NAME, value: item.COMP_ID }
  //         results.push(obj);
  //       });
  //       return results;
  //     })
  //     .catch(this.handleError);
  // }

  getMeanSDCompoundDDOByInstrumentId(labId, instrumentId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/compound/ddo/' + labId + '/' + instrumentId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.COMP_NAME, value: item.COMP_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getInstruments(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/instruments/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.INSTRUMENT_NAME, value: item.INSTRUMENT_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getCompoundMethodDDOByinstrumentId(labId, instrumentId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/compoundMethod/ddo/' + labId + '/' + instrumentId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.METHOD_NAME, value: item.METHOD_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getAdjMeanMonthDDO(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/adjMean/month/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let monthName = this.getMonthName(item.MONTH);
          let obj = { label: monthName, value: item.MONTH }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getAdjMeanYearDDO(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/adjMean/year/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.YEAR, value: item.YEAR }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getMeanMonthDDO(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/Mean/month/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let monthName = this.getMonthName(item.MONTH);
          let obj = { label: monthName, value: item.MONTH }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getReviewMonthDDO(labId, yearId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/review/month/ddo/' + labId + '/' + yearId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let monthName = this.getMonthName(item.MONTH);
          let obj = { label: monthName, value: item.MONTH }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getMeanYearDDO(labId, instrumentId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/Mean/year/ddo/' + labId + '/' + instrumentId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.YEAR, value: item.YEAR }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }


  getQCCompoundDDO(instrumentID): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/result/compound/ddo/' + instrumentID)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.COMP_NAME, value: item.COMP_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getbatchesDDO(monthId, yearId, dayId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/batch/ddo/' + monthId + '/' + yearId + '/' + dayId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.BATCH_ID, value: item.BATCH_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getReasons(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/reason/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          // let obj = { label: item.REASON_NAME, value: item.REASON_ID }
          let obj = { label: item.REASON_CODE, value: item.REASON_CODE }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getQCInstrumentDDO(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'qualityControl/instrument/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.INSTRUMENT_NAME, value: item.INSTRUMENT_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  /* IM DDOs */
  getIMFrequencyDDO(): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'smartMaintenance/frequency/ddo')
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.FREQ_NAME, value: item.FREQ_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getIMInstrumentDDO(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'smartMaintenance/Instrument/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.INSTR_NAME, value: item.INSTR_ID }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getItemMapDDO(labId, INSTR_ID, FREQ_ID, ITEM_ID): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'smartMaintenance/itemMapping/ddo/' + labId + '/' + INSTR_ID + '/' + FREQ_ID + '/' + ITEM_ID)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.MAP_NAME, value: item.MAP_NAME }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getChecklistMonth(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'smartMaintenance/checklist/month/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let monthName = this.getMonthName(item.MONTH);
          let obj = { label: monthName, value: item.MONTH }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getChecklistYear(labId): Promise<any> {
    return this.http.get(ApiUrl.MASTER_URI + 'smartMaintenance/checklist/year/ddo/' + labId)
      .toPromise()
      .then(response => {
        let data = response.json();
        let results = [];
        data.map((item) => {
          let obj = { label: item.YEAR, value: item.YEAR }
          results.push(obj);
        });
        return results;
      })
      .catch(this.handleError);
  }

  getMonthName(MONTH) {
    let monthName = '';
    switch (MONTH) {
      case 1:
        monthName = 'January'
        break;
      case 2:
        monthName = 'Febuary'
        break;
      case 3:
        monthName = 'March'
        break;
      case 4:
        monthName = 'April'
        break;
      case 5:
        monthName = 'May'
        break;
      case 6:
        monthName = 'June'
        break;
      case 7:
        monthName = 'July'
        break;
      case 8:
        monthName = 'August'
        break;
      case 9:
        monthName = 'September'
        break;
      case 10:
        monthName = 'October'
        break;
      case 11:
        monthName = 'November'
        break;
      case 12:
        monthName = 'December'
        break;
    }
    return monthName;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
